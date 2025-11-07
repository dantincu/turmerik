import { Injectable, OnDestroy, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { NullOrUndef } from '../../../trmrk/core';
import { getOrderOfMagnitude } from '../../../trmrk/math';
import { TouchOrMouseCoords } from '../../../trmrk-browser/domUtils/touchAndMouseEvents';

import {
  AppSessionTabSettingsChoice,
  BasicAppSettingsDbAdapter,
  commonAppSettingsChoiceCatKeys,
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

export interface TrmrkInfiniteHeightPanelServiceInitScrollPanelArgs {
  hostElRef: () => ElementRef;
  totalHeight?: ((el: ElementRef) => number) | NullOrUndef;
}

export interface TrmrkInfiniteHeightPanelServiceInitScrollControlSetupArgs {
  hostElRef: () => ElementRef;
  appSettingsChoicesCatKey: string | NullOrUndef;
  controlToggledEvent: () => EventEmitter<boolean>;
}

export interface TrmrkInfiniteHeightPanelServiceInitScrollBarSetupArgs {
  hostElRef: () => ElementRef;
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

  private basicAppSettingsDbAdapter: BasicAppSettingsDbAdapter;

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore,
    private trmrkSessionService: TrmrkSessionService
  ) {
    this.basicAppSettingsDbAdapter = indexedDbDatabasesService.basicAppSettings.value;
    this.panelScrolled = this.panelScrolled.bind(this);
  }

  ngOnDestroy(): void {
    this.reset();
  }

  async scrollControlToggleClicked(expand: boolean) {
    this.scrollControlIsExpanded = expand;
    this.scrollControlSetupArgs.controlToggledEvent().emit(expand);

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
          value: expand,
        } as AppSessionTabSettingsChoice<boolean>)
      );
    }
  }

  scrollControlScrollUpMouseDown(evt: TrmrkMultiClickStepEventData) {
    if (evt.clicksCount > 0) {
      this.scrollUpCount = evt.clicksCount + 1;
    }
  }

  scrollControlScrollDownMouseDown(evt: TrmrkMultiClickStepEventData) {
    if (evt.clicksCount > 0) {
      this.scrollDownCount = evt.clicksCount + 1;
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

  scrollControlScrollComplete() {}

  panelScrolled() {}

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

  scrollBarThumbDragStart(event: TouchOrMouseCoords) {}

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
    this.updateCoords({ ...evt, fireScrolledEvent: true, scrollPanel: true });
  }

  contentChanged(evt: TrmrkInfiniteHeightPanelScrollContentChangedEvent) {
    this.updateCoords({ ...evt, fireScrolledEvent: true });
  }

  async setupScrollPanel(args: TrmrkInfiniteHeightPanelServiceInitScrollPanelArgs) {
    if (this.scrollPanelSetupArgs) {
      this.reset();
    }

    this.scrollPanelSetupArgs = args;
    args.totalHeight ??= (elRef) => (elRef.nativeElement as HTMLElement).scrollHeight;
    (args.hostElRef().nativeElement as HTMLElement).addEventListener('scroll', this.panelScrolled);
    await this.ifIsSetUp();
  }

  async setupScrollControl(args: TrmrkInfiniteHeightPanelServiceInitScrollControlSetupArgs) {
    if (this.scrollControlSetupArgs) {
      this.reset();
    }

    this.scrollControlSetupArgs = args;

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

      if (choice?.value) {
        this.scrollControlIsExpanded = true;
      }
    }

    await this.ifIsSetUp();
  }

  async setupScrollBar(args: TrmrkInfiniteHeightPanelServiceInitScrollBarSetupArgs) {
    if (this.scrollBarSetupArgs) {
      this.reset();
    }

    this.scrollBarSetupArgs = args;
    await this.ifIsSetUp();
  }

  updateCoords(args: TrmrkInfiniteHeightPanelScrollCoordArgs) {
    this.updatePrevCoords();
    this.updateCoordsCore(args);

    this.panelScrollTopPx =
      args.panelScrollTopPx ?? this.panelScrollTopPx + this.topPx - this.prevTopPx;

    const panelScrollTopPx = this.panelScrollTopPx;
    this.panelScrollTopPx = Math.max(0, Math.min(panelScrollTopPx, this.getPanelMaxScrollTop()));
    const panelScrollTopDiffPx = panelScrollTopPx - this.panelScrollTopPx;

    this.scrollBarUpdateThumbTopPx();
    this.requiresActualScroll = this.getRequiresActualScroll();
    this.scrollControlProgressText = this.getScrollControlProgressMsg();

    if (args.scrollPanel) {
      this.scrollPanel(this.panelScrollTopPx);
    }

    if (args.fireScrolledEvent) {
      this.fireScrolledEvent();
    }

    if (panelScrollTopDiffPx !== 0) {
      this.scrollBarSetupArgs.newContentRequestedEvent().emit({
        newTopPxRatio: this.topPx + panelScrollTopDiffPx,
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
        this.topPx = args.topPx!;
        this.topPxRatio = this.getTopPxRatio();
        this.scrollBarThumbTopPx = args.scrollBarThumbTopPx ?? this.getScrollBarThumbTopPx();
      } else {
        this.scrollBarThumbTopPx = args.scrollBarThumbTopPx!;
        this.topPxRatio = this.scrollBarThumbTopPx / this.scrollBarGetMaxTopPx();
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

  scrollPanel(top: number) {
    if (top) {
      (this.scrollPanelSetupArgs.hostElRef().nativeElement as HTMLElement).scrollBy({
        top: top,
        behavior: 'instant',
      });
    }
  }

  scrollPanelBy(topDiff: number) {
    if (topDiff) {
      (this.scrollPanelSetupArgs.hostElRef().nativeElement as HTMLElement).scrollBy({
        top: topDiff,
        behavior: 'instant',
      });
    }
  }

  fireScrolledEvent() {
    this.scrollBarSetupArgs.scrolledEvent().emit({
      panelScrollTopPx: this.panelScrollTopPx,
      scrollBarThumbMaxTopPx: this.scrollBarGetMaxTopPx(),
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

    const maxTopPx = this.scrollBarGetMaxTopPx();
    topPx = Math.max(0, Math.min(topPx, maxTopPx));
    const topPxRatio = topPx / maxTopPx;

    return {
      scrollBarThumbTopPx: topPx,
      scrollBarThumbMaxTopPx: maxTopPx,
      topPxRatio,
    } as TrmrkInfiniteHeightPanelScrollEvent;
  }

  scrollBarGetMaxTopPx() {
    return (this.scrollBarSetupArgs.hostElRef().nativeElement as HTMLElement).offsetHeight - 40;
  }

  getTotalHeight() {
    const totallHeight = this.scrollPanelSetupArgs.totalHeight!(
      this.scrollPanelSetupArgs.hostElRef()
    );

    return totallHeight;
  }

  getPanelMaxScrollTop() {
    const panelEl = this.scrollPanelSetupArgs.hostElRef().nativeElement as HTMLElement;
    const maxScrollTop = panelEl.scrollHeight - panelEl.offsetHeight;
    return maxScrollTop;
  }

  getTopPx() {
    const totalScrollHeight = this.getTotalHeight();
    const topPx = this.topPxRatio * totalScrollHeight;
    return topPx;
  }

  getTopPxRatio() {
    const totalScrollHeight = this.getTotalHeight();
    const topPxRatio = totalScrollHeight === 0 ? 1 : this.topPx / totalScrollHeight;
    return topPxRatio;
  }

  getScrollBarThumbTopPx() {
    const scrollBarThumbMaxTopPx = this.scrollBarGetMaxTopPx();
    let scrollBarThumbTopPx = Math.round(this.topPxRatio * scrollBarThumbMaxTopPx);
    scrollBarThumbTopPx = Math.max(0, Math.min(scrollBarThumbTopPx, scrollBarThumbMaxTopPx));
    return scrollBarThumbTopPx;
  }

  getRequiresActualScroll() {
    return this.topPxRatio <= 1;
  }

  getScrollControlProgressMsg(): string {
    // const totalScrollHeight = this.getTotalHeight();
    const orderOfMagnitude = 4; // getOrderOfMagnitude(totalScrollHeight);
    const magnDiv = Math.pow(10, orderOfMagnitude + 1);
    const percent = Math.round(this.topPxRatio * magnDiv) / (magnDiv / 100);
    const text = [percent, '%'].join('');
    return text;
  }

  async ifIsSetUp() {
    if (this.scrollPanelSetupArgs && this.scrollControlSetupArgs && this.scrollBarSetupArgs) {
      this.setupComplete.next(true);
    }
  }

  reset() {
    this.scrollPanelSetupArgs = null!;
    this.scrollControlSetupArgs = null!;
    this.scrollBarSetupArgs = null!;

    (this.scrollPanelSetupArgs.hostElRef().nativeElement as HTMLElement).removeEventListener(
      'scroll',
      this.panelScrolled
    );

    this.setupComplete.next(false);
  }
}
