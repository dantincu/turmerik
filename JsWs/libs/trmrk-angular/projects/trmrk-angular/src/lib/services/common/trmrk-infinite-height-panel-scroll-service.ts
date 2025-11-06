import { Injectable, OnDestroy, ElementRef, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { NullOrUndef } from '../../../trmrk/core';
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

export const SCROLL_CONTROL_MAX_SPEED_FACTOR = 13;
export const SCROLL_CONTROL_SPEED_MULTIPLIER = 4;
export const BASE_SCROLL_STEP_PX = 40;

export interface TrmrkInfiniteHeightPanelServiceInitScrollControlSetupArgs {
  hostElRef: () => ElementRef;
  appSettingsChoicesCatKey: string | NullOrUndef;
  controlToggledEvent: () => EventEmitter<boolean>;
  cdr: () => ChangeDetectorRef;
}

export interface TrmrkInfiniteHeightPanelServiceInitScrollBarSetupArgs {
  hostElRef: () => ElementRef;
  scrolledEvent: () => EventEmitter<TrmrkInfiniteHeightPanelScrollEvent>;
}

export interface TrmrkInfiniteHeightPanelScrollEvent {
  topPx: number;
  maxTopPx: number;
  topPxRatio: number;
}

@Injectable()
export class TrmrkInfiniteHeightPanelScrollService implements OnDestroy {
  scrollControlSetupArgs!: TrmrkInfiniteHeightPanelServiceInitScrollControlSetupArgs;
  scrollBarSetupArgs!: TrmrkInfiniteHeightPanelServiceInitScrollBarSetupArgs;

  scrollControlIsExpanded = false;
  scrollControlSpeedFactor = 1;

  scrollBarThumbNgStyle = {
    top: `0px`,
  };

  currentTopPx = 0;
  currentTopPxRatio = 0;

  scrollUpCount = 0;
  scrollDownCount = 0;

  private basicAppSettingsDbAdapter: BasicAppSettingsDbAdapter;

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore,
    private trmrkSessionService: TrmrkSessionService
  ) {
    this.basicAppSettingsDbAdapter = indexedDbDatabasesService.basicAppSettings.value;
  }

  ngOnDestroy(): void {
    this.scrollControlSetupArgs = null!;
    this.scrollBarSetupArgs = null!;
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
      this.scrollControlSetupArgs.cdr().detectChanges();
    }
  }

  scrollControlScrollDownMouseDown(evt: TrmrkMultiClickStepEventData) {
    if (evt.clicksCount > 0) {
      this.scrollDownCount = evt.clicksCount + 1;
      this.scrollControlSetupArgs.cdr().detectChanges();
    }
  }

  scrollControlScrollUpPressAndHold(evt: TrmrkMultiClickPressAndHoldEventData) {
    this.scrollUpCount = evt.elapsedIntervalsCount + 1;
    this.scrollControlSetupArgs.cdr().detectChanges();
  }

  scrollControlScrollDownPressAndHold(evt: TrmrkMultiClickPressAndHoldEventData) {
    this.scrollDownCount = evt.elapsedIntervalsCount + 1;
    this.scrollControlSetupArgs.cdr().detectChanges();
  }

  scrollControlScrollEnded() {
    this.scrollUpCount = 0;
    this.scrollDownCount = 0;
    this.scrollControlSetupArgs.cdr().detectChanges();
  }

  scrollControlScrollComplete() {
    console.log('scrollControlScrollComplete');
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

  scrollBarThumbDragStart(event: TouchOrMouseCoords) {}

  scrollBarThumbDrag(event: TrmrkDragEvent) {
    const evt = this.scrollBarGetEvtArgs(event);
    this.scrollBarScrolledCore(evt);
  }

  scrollBarThumbDragEnd(event: TrmrkDragEvent) {
    const evt = this.scrollBarGetEvtArgs(event);
    this.scrollBarScrolled(evt);
  }

  async setupScrollControl(args: TrmrkInfiniteHeightPanelServiceInitScrollControlSetupArgs) {
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
  }

  async setupScrollBar(args: TrmrkInfiniteHeightPanelServiceInitScrollBarSetupArgs) {
    this.scrollBarSetupArgs = args;
  }

  scrollBarUpdateThumbTop(topPx: number) {
    this.scrollBarThumbNgStyle = {
      ...this.scrollBarThumbNgStyle,
      top: `${topPx}px`,
    };
  }

  scrollBarScrolled(evt: TrmrkInfiniteHeightPanelScrollEvent) {
    this.currentTopPx = evt.topPx;
    this.currentTopPxRatio = evt.topPxRatio;
    this.scrollBarScrolledCore(evt);
  }

  scrollBarScrolledCore(evt: TrmrkInfiniteHeightPanelScrollEvent) {
    this.scrollBarUpdateThumbTop(evt.topPx);
    this.scrollBarSetupArgs.scrolledEvent().emit(evt);
  }

  scrollBarGetEvtArgs(event: TrmrkDragEvent) {
    let topPx =
      event.touchOrMouseMoveCoords.screenY -
      event.touchStartOrMouseDownCoords!.screenY +
      this.currentTopPx;

    const maxTopPx = this.scrollBarGetMaxTopPx();
    topPx = Math.max(0, Math.min(topPx, maxTopPx));

    const topPxRatio = topPx / maxTopPx;

    return {
      topPx,
      maxTopPx,
      topPxRatio,
    } as TrmrkInfiniteHeightPanelScrollEvent;
  }

  scrollBarGetMaxTopPx() {
    return (this.scrollBarSetupArgs.hostElRef().nativeElement as HTMLElement).offsetHeight - 40;
  }
}
