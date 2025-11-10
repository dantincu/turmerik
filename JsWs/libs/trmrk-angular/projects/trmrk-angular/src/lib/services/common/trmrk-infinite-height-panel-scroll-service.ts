import { Injectable, OnDestroy, EventEmitter } from '@angular/core';

import { NullOrUndef } from '../../../trmrk/core';
import { awaitTimeout } from '../../../trmrk/timeout';
import { TouchOrMouseCoords } from '../../../trmrk-browser/domUtils/touchAndMouseEvents';

import {
  AppSessionTabSettingsChoice,
  BasicAppSettingsDbAdapter,
  commonAppSettingsChoiceKeys,
} from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { dbRequestToPromise, openDbRequestToPromise } from '../../../trmrk-browser/indexedDB/core';

import {
  TrmrkMultiClickPressAndHoldEventData,
  TrmrkMultiClickStepEventData,
} from '../../directives/trmrk-multi-click';

import { TrmrkSessionService } from '../../services/common/trmrk-session-service';
import { IndexedDbDatabasesServiceCore } from '../../services/common/indexedDb/indexed-db-databases-service-core';

import { TrmrkDragEvent } from './types';
import { TrmrkObservable } from './TrmrkObservable';

export const SCROLL_CONTROL_MAX_SPEED_FACTOR = 13;
export const SCROLL_CONTROL_SPEED_MULTIPLIER = 4;
export const BASE_SCROLL_STEP_PX = 40;
export const SCROLL_BAR_THUMB_HEIGHT_PX = 40;

export interface TrmrkInfiniteHeightPanelServiceInitScrollPanelArgs {
  hostEl: () => HTMLElement;
  totalHeight?: ((el: HTMLElement) => number) | NullOrUndef;
}

export interface TrmrkInfiniteHeightPanelServiceInitScrollControlSetupArgs {
  hostEl: () => HTMLElement;
  appSettingsChoicesCatKey: string | NullOrUndef;
  controlToggledEvent: () => EventEmitter<boolean>;
}

export interface TrmrkInfiniteHeightPanelServiceInitScrollBarSetupArgs {
  hostEl: () => HTMLElement;
  scrolledEvent: () => EventEmitter<TrmrkInfiniteHeightPanelScrollEvent>;
  newContentRequestedEvent: () => EventEmitter<TrmrkInfiniteHeightPanelNewContentRequestedEvent>;
}

export interface TrmrkInfiniteHeightPanelScrollEvent {
  scrollBarThumbTopPx: number;
  scrollBarThumbMaxTopPx: number;
  topPx: number;
  topPxRatio: number;
  panelScrollTopPx: number;
}

export interface TrmrkInfiniteHeightPanelScrollContentChangedEvent {
  topPx: number;
}

export interface TrmrkInfiniteHeightPanelNewContentRequestedEvent {
  newTopPxRatio: number;
}

interface TrmrkInfiniteHeightPanelScrollCoordArgs {
  scrollBarThumbTopPx?: number | NullOrUndef;
  topPx?: number | NullOrUndef;
  topPxRatio?: number | NullOrUndef;
  panelScrollTopPx?: number | NullOrUndef;
  scrollPanel?: boolean | NullOrUndef;
  fireScrolledEvent?: boolean | NullOrUndef;
  updatePrevCoords?: boolean | NullOrUndef;
}

@Injectable()
export class TrmrkInfiniteHeightPanelScrollService implements OnDestroy {
  scrollPanelSetupArgs!: TrmrkInfiniteHeightPanelServiceInitScrollPanelArgs;
  scrollControlSetupArgs!: TrmrkInfiniteHeightPanelServiceInitScrollControlSetupArgs;
  scrollBarSetupArgs!: TrmrkInfiniteHeightPanelServiceInitScrollBarSetupArgs;
  setupComplete = new TrmrkObservable(false);

  requiresActualScroll = false;
  scrollControlIsExpanded = false;
  scrollControlSpeedFactor = 1;

  scrollBarThumbNgStyle = {
    top: `0px`,
  };

  panelOffsetHeight = 0;
  panelScrollHeight = 0;
  maxScrollTop = 0;
  scrollBarHeight = 0;
  scrollBarThumbMaxTopPx = 0;

  skippedHeightPx = 0;
  topPx = 0;
  topPxRatio = 0;
  scrollBarThumbTopPx = 0;
  panelScrollTopPx = 0;

  prevTopPx = 0;
  prevTopPxRatio = 0;
  prevScrollBarThumbTopPx = 0;
  prevPanelScrollTopPx = 0;

  scrollUpCount = 0;
  scrollDownCount = 0;
  scrollControlProgressText = '';

  isProgrammaticScroll = false;

  private basicAppSettingsDbAdapter: BasicAppSettingsDbAdapter;

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore,
    private trmrkSessionService: TrmrkSessionService
  ) {
    this.basicAppSettingsDbAdapter = indexedDbDatabasesService.basicAppSettings.value;
    this.panelScrolled = this.panelScrolled.bind(this);
    this.windowResized = this.windowResized.bind(this);
  }

  ngOnDestroy(): void {
    this.reset();
  }

  async scrollControlToggled(expanded: boolean) {
    await this.scrollControlToggledCore(expanded);
    this.writeScrollControlToggleStateToDbIfReq(expanded);
    this.scrollControlSetupArgs.controlToggledEvent().emit(expanded);
  }

  async scrollControlToggledCore(expanded: boolean) {
    this.scrollControlIsExpanded = expanded;
    await this.updatePanelMaxScrollTopIfReq();
  }

  scrollControlScrollUpMouseDown(evt: TrmrkMultiClickStepEventData) {
    if (evt.clicksCount > 0) {
      this.scrollUpCount = evt.clicksCount;
    } else {
      this.updateCoords({
        topPx: this.topPx - BASE_SCROLL_STEP_PX,
        fireScrolledEvent: true,
        updatePrevCoords: true,
        scrollPanel: true,
      });
    }
  }

  scrollControlScrollDownMouseDown(evt: TrmrkMultiClickStepEventData) {
    if (evt.clicksCount > 0) {
      this.scrollDownCount = evt.clicksCount;
    } else {
      this.updateCoords({
        topPx: this.topPx + BASE_SCROLL_STEP_PX,
        fireScrolledEvent: true,
        updatePrevCoords: true,
        scrollPanel: true,
      });
    }
  }

  scrollControlScrollUpPressAndHold(evt: TrmrkMultiClickPressAndHoldEventData) {
    this.scrollUpCount = evt.elapsedIntervalsCount + 1;
  }

  scrollControlScrollDownPressAndHold(evt: TrmrkMultiClickPressAndHoldEventData) {
    this.scrollDownCount = evt.elapsedIntervalsCount + 1;
  }

  scrollControlScrollEnded() {
    this.scrollUpCount = 0;
    this.scrollDownCount = 0;
    this.revertToPrevCoords(); // when complete this should have no effect
  }

  scrollControlScrollComplete() {
    const scrollCount = this.scrollDownCount - this.scrollUpCount;

    if (scrollCount !== 0) {
      this.updateCoords({
        topPx: this.topPx + BASE_SCROLL_STEP_PX * scrollCount,
        fireScrolledEvent: true,
        updatePrevCoords: true,
        scrollPanel: true,
      });
    }
  }

  panelScrolled() {
    if (!this.isProgrammaticScroll) {
      this.panelScrollTopPx = this.scrollPanelSetupArgs.hostEl().scrollTop;

      this.updateCoords({
        topPx: this.skippedHeightPx + this.panelScrollTopPx,
      });
    } else {
      this.isProgrammaticScroll = false;
    }
  }

  scrollControlIncreaseScrollSpeedMouseDown() {
    this.scrollControlSpeedFactor++;

    if (this.scrollControlSpeedFactor > SCROLL_CONTROL_MAX_SPEED_FACTOR) {
      this.scrollControlSpeedFactor = 1;
    }
  }

  scrollControlDecreaseScrollSpeedMouseDown() {
    this.scrollControlSpeedFactor--;

    if (this.scrollControlSpeedFactor < 1) {
      this.scrollControlSpeedFactor = SCROLL_CONTROL_MAX_SPEED_FACTOR;
    }
  }

  scrollControlMiddleBtnClicked() {
    this.scrollControlSpeedFactor =
      (Math.floor(this.scrollControlSpeedFactor - 1 + SCROLL_CONTROL_MAX_SPEED_FACTOR / 2) %
        SCROLL_CONTROL_MAX_SPEED_FACTOR) +
      1;
  }

  scrollBarThumbDragStart(event: TouchOrMouseCoords) {
    this.updatePrevCoords();
    this.updatePanelMaxScrollTopCore();
  }

  scrollBarThumbDrag(event: TrmrkDragEvent) {
    const evt = this.scrollBarGetEvtArgs(event);

    this.updateCoordsCore({
      scrollBarThumbTopPx: evt.scrollBarThumbTopPx,
    });

    this.scrollBarUpdateThumbTopPx();
    this.scrollControlProgressText = this.getScrollControlProgressMsg();
  }

  scrollBarThumbDragEnd(event: TrmrkDragEvent) {
    const evt = this.scrollBarGetEvtArgs(event);

    this.updateCoords({
      ...evt,
      fireScrolledEvent: true,
      updatePrevCoords: true,
      scrollPanel: true,
    });
  }

  async windowResized(ev: UIEvent) {
    await this.updatePanelMaxScrollTopIfReq();
  }

  contentChanged(evt: TrmrkInfiniteHeightPanelScrollContentChangedEvent) {
    this.updatePanelMaxScrollTopCore();
    this.skippedHeightPx = evt.topPx - this.panelScrollTopPx;
    this.updateCoords({ ...evt, updatePrevCoords: true });
  }

  async setupScrollPanel(args: TrmrkInfiniteHeightPanelServiceInitScrollPanelArgs) {
    if (this.scrollPanelSetupArgs) {
      this.reset();
    }

    this.scrollPanelSetupArgs = args;
    args.totalHeight ??= (el) => el.scrollHeight;
    args.hostEl().addEventListener('scroll', this.panelScrolled);
    await this.ifIsSetUp();
  }

  async setupScrollControl(args: TrmrkInfiniteHeightPanelServiceInitScrollControlSetupArgs) {
    if (this.scrollControlSetupArgs) {
      this.reset();
    }

    this.scrollControlSetupArgs = args;
    let expanded = false;

    if (args.appSettingsChoicesCatKey && this.trmrkSessionService.currentTab.value) {
      const db = (await openDbRequestToPromise(this.basicAppSettingsDbAdapter.open())).value;

      const keyPath = [
        args.appSettingsChoicesCatKey,
        commonAppSettingsChoiceKeys.isExpanded,
        this.trmrkSessionService.currentTab.value.tabId,
      ];

      const choice = (
        await dbRequestToPromise<AppSessionTabSettingsChoice<boolean>>(
          this.basicAppSettingsDbAdapter.stores.tabChoices.store(db).get(keyPath)
        )
      ).value;

      expanded = choice?.value ?? false;
    }

    window.addEventListener('resize', this.windowResized);
    await this.scrollControlToggledCore(expanded);
    await this.ifIsSetUp();
  }

  async setupScrollBar(args: TrmrkInfiniteHeightPanelServiceInitScrollBarSetupArgs) {
    if (this.scrollBarSetupArgs) {
      this.reset();
    }

    this.scrollBarSetupArgs = args;
    await this.ifIsSetUp();
  }

  async writeScrollControlToggleStateToDbIfReq(expanded: boolean) {
    if (
      this.scrollControlSetupArgs.appSettingsChoicesCatKey &&
      this.trmrkSessionService.currentTab.value
    ) {
      const db = (await openDbRequestToPromise(this.basicAppSettingsDbAdapter.open())).value;

      await dbRequestToPromise(
        this.basicAppSettingsDbAdapter.stores.tabChoices.store(db, null, 'readwrite').put({
          catKey: this.scrollControlSetupArgs.appSettingsChoicesCatKey,
          key: commonAppSettingsChoiceKeys.isExpanded,
          sessionId: this.trmrkSessionService.currentSession.value.sessionId,
          tabId: this.trmrkSessionService.currentTab.value.tabId,
          value: expanded,
        } as AppSessionTabSettingsChoice<boolean>)
      );
    }
  }

  updateCoords(args: TrmrkInfiniteHeightPanelScrollCoordArgs) {
    this.updateCoordsCore(args);

    if ((args.panelScrollTopPx ?? null) !== null) {
      this.panelScrollTopPx = args.panelScrollTopPx!;
    } else {
      this.panelScrollTopPx = this.topPx - this.skippedHeightPx;
    }

    const panelScrollTopPx = this.panelScrollTopPx;
    this.panelScrollTopPx = Math.max(0.01, Math.min(panelScrollTopPx, this.maxScrollTop));
    const panelScrollTopDiffPx = Math.round(panelScrollTopPx - this.panelScrollTopPx);

    this.scrollBarUpdateThumbTopPx();
    this.requiresActualScroll = this.getRequiresActualScroll();
    this.scrollControlProgressText = this.getScrollControlProgressMsg();

    if (args.scrollPanel) {
      this.scrollPanelTo(this.panelScrollTopPx);
    }

    if (args.updatePrevCoords) {
      this.updatePrevCoords();
    }
    if (args.fireScrolledEvent) {
      this.fireScrolledEvent();
    }

    if (args.scrollPanel && panelScrollTopDiffPx !== 0) {
      this.scrollBarSetupArgs.newContentRequestedEvent().emit({
        newTopPxRatio: this.getTopPxRatio(this.topPx + panelScrollTopDiffPx),
      });
    }
  }

  updatePrevCoords() {
    this.prevTopPx = this.topPx;
    this.prevTopPxRatio = this.topPxRatio;
    this.prevScrollBarThumbTopPx = this.scrollBarThumbTopPx;
    this.prevPanelScrollTopPx = this.panelScrollTopPx;
  }

  updateCoordsCore(args: TrmrkInfiniteHeightPanelScrollCoordArgs) {
    if ((args.topPxRatio ?? null) !== null) {
      this.topPxRatio = args.topPxRatio!;
      this.scrollBarThumbTopPx = args.scrollBarThumbTopPx ?? this.getScrollBarThumbTopPx();
      this.topPx = args.topPx ?? this.getTopPx();
    } else {
      if ((args.topPx ?? null) !== null) {
        this.topPx = Math.max(0, Math.min(args.topPx!, this.maxScrollTop));
        this.topPxRatio = this.getTopPxRatio();
        this.scrollBarThumbTopPx = args.scrollBarThumbTopPx ?? this.getScrollBarThumbTopPx();
      } else {
        this.scrollBarThumbTopPx = args.scrollBarThumbTopPx!;
        this.topPxRatio = this.scrollBarThumbMaxTopPx / this.scrollBarThumbTopPx;
        this.topPx = args.topPx ?? this.getTopPx();
      }
    }
  }

  revertToPrevCoords() {
    this.topPx = this.prevTopPx;
    this.topPxRatio = this.prevTopPxRatio;
    this.scrollBarThumbTopPx = this.prevScrollBarThumbTopPx;
    this.panelScrollTopPx = this.prevPanelScrollTopPx;
  }

  scrollPanelTo(top: number) {
    if (top) {
      this.isProgrammaticScroll = true;

      this.scrollPanelSetupArgs.hostEl().scrollTo({
        top: top,
        behavior: 'instant',
      });
    }
  }

  scrollPanelBy(topDiff: number) {
    if (topDiff) {
      this.scrollPanelSetupArgs.hostEl().scrollBy({
        top: topDiff,
        behavior: 'instant',
      });
    }
  }

  fireScrolledEvent() {
    this.scrollBarSetupArgs.scrolledEvent().emit({
      panelScrollTopPx: this.panelScrollTopPx,
      scrollBarThumbMaxTopPx: this.scrollBarThumbMaxTopPx,
      scrollBarThumbTopPx: this.scrollBarThumbTopPx,
      topPx: this.topPx,
      topPxRatio: this.topPxRatio,
    });
  }

  scrollBarUpdateThumbTopPx() {
    this.scrollBarThumbNgStyle = {
      ...this.scrollBarThumbNgStyle,
      top: `${this.scrollBarThumbTopPx}px`,
    };
  }

  scrollBarGetEvtArgs(event: TrmrkDragEvent) {
    let topPx =
      event.touchOrMouseMoveCoords.screenY -
      event.touchStartOrMouseDownCoords!.screenY +
      this.prevScrollBarThumbTopPx;

    const maxTopPx = this.scrollBarThumbMaxTopPx;
    topPx = Math.max(0, Math.min(topPx, maxTopPx));
    const topPxRatio = maxTopPx / topPx;

    return {
      scrollBarThumbTopPx: topPx,
      scrollBarThumbMaxTopPx: maxTopPx,
      topPxRatio,
    } as TrmrkInfiniteHeightPanelScrollEvent;
  }

  getScrollBarMaxTopPx() {
    return this.scrollBarSetupArgs.hostEl().offsetHeight - SCROLL_BAR_THUMB_HEIGHT_PX;
  }

  getTotalHeight() {
    const totallHeight = this.scrollPanelSetupArgs.totalHeight!(this.scrollPanelSetupArgs.hostEl());
    return totallHeight;
  }

  async updatePanelMaxScrollTopIfReq() {
    if (this.scrollControlIsExpanded) {
      this.updatePanelMaxScrollTopCore();

      await awaitTimeout(() => {
        this.updatePanelMaxScrollTopCore();
      });
    }
  }

  updatePanelMaxScrollTopCore() {
    const panelEl = this.scrollPanelSetupArgs.hostEl();
    const scrollBarEl = this.scrollBarSetupArgs.hostEl();

    this.panelScrollHeight = panelEl.scrollHeight;
    this.panelOffsetHeight = panelEl.offsetHeight;
    this.maxScrollTop = this.panelScrollHeight - this.panelOffsetHeight;
    this.scrollBarHeight = scrollBarEl.offsetHeight;
    this.scrollBarThumbMaxTopPx = this.scrollBarHeight - SCROLL_BAR_THUMB_HEIGHT_PX;
    this.requiresActualScroll = this.getRequiresActualScroll();
  }

  getTopPx() {
    const totalHeightForRatio = this.getMaxTopPx();
    let topPx = Math.round(totalHeightForRatio / this.topPxRatio);
    topPx = Math.max(0, Math.min(topPx));
    return topPx;
  }

  getTopPxRatio(topPx?: number | NullOrUndef) {
    const maxTopPx = this.getMaxTopPx();
    topPx ??= this.topPx;
    let topPxRatio = maxTopPx / topPx;

    topPxRatio = Math.max(1, Math.min(topPxRatio, maxTopPx * this.scrollBarThumbMaxTopPx));

    return topPxRatio;
  }

  getMaxTopPx() {
    const totalHeightForRatio = this.getTotalHeight() - this.panelOffsetHeight;
    return totalHeightForRatio;
  }

  getScrollBarThumbTopPx() {
    let scrollBarThumbTopPx = Math.round(this.scrollBarThumbMaxTopPx / this.topPxRatio);
    scrollBarThumbTopPx = Math.max(0, Math.min(scrollBarThumbTopPx, this.scrollBarThumbMaxTopPx));
    return scrollBarThumbTopPx;
  }

  getRequiresActualScroll() {
    return this.maxScrollTop > 0;
  }

  getScrollControlProgressMsg(): string {
    const orderOfMagnitude = 4;
    const magnDiv = Math.pow(10, orderOfMagnitude + 1);
    const percent = Math.round(magnDiv / this.topPxRatio) / (magnDiv / 100);
    const text = [percent, '%'].join('');
    return text;
  }

  async ifIsSetUp() {
    if (this.scrollPanelSetupArgs && this.scrollControlSetupArgs && this.scrollBarSetupArgs) {
      this.setupComplete.next(true);
    }
  }

  reset() {
    this.scrollPanelSetupArgs.hostEl().removeEventListener('scroll', this.panelScrolled);
    window.removeEventListener('resize', this.windowResized);

    this.scrollPanelSetupArgs = null!;
    this.scrollControlSetupArgs = null!;
    this.scrollBarSetupArgs = null!;

    this.setupComplete.next(false);
  }
}
