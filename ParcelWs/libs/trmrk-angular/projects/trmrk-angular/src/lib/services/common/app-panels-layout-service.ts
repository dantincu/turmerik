import { Injectable, ElementRef, EventEmitter } from '@angular/core';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { Subscription } from 'rxjs';

import { NullOrUndef } from '../../../trmrk/core';
import { TouchOrMouseCoords } from '../../../trmrk-browser/domUtils/touchAndMouseEvents';
import { getElemIdx } from '../../../trmrk-browser/domUtils/getDomElemBounds';
import { htmlCollectionToArr } from '../../../trmrk-browser/domUtils/common';
import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';
import { AppServiceBase, extractAppObjectKeyParts } from './app-service-base';

import {
  AppSettingsChoice,
  BasicAppSettingsDbAdapter,
  commonAppSettingsChoiceCatKeys,
  commonAppSettingsChoiceKeys,
} from '../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { dbRequestToPromise } from '../../../trmrk-browser/indexedDB/core';

import { TrmrkDrag } from '../../directives/trmrk-drag';
import { TrmrkDragEvent } from './types';
import { TrmrkTouchStartOrMouseDown } from '../../directives/trmrk-touch-start-or-mouse-down';
import { TrmrkDisaposable } from './types';

export const MIN_PANEL_WIDTH_PX = 54;
export const FULL_WIDTH_RATIO = 100000;
export const HALF_WIDTH_RATIO = FULL_WIDTH_RATIO / 2;
export const THIRD_WIDTH_RATIO = Math.floor(FULL_WIDTH_RATIO / 3);
export const TWO_THIRDS_WIDTH_RATIO = FULL_WIDTH_RATIO - THIRD_WIDTH_RATIO;

export enum PanelPosition {
  None = 0,
  Left,
  Middle,
  Right,
}

export const commonLayoutKeys = mapPropNamesToThemselves(
  {
    main: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);

export interface AppPanelLayoutServiceSetupArgs {
  layoutKey?: string | NullOrUndef;
  containerEl: () => ElementRef<any>;
  leftPanelEl: () => ElementRef<any>;
  rightPanelEl: () => ElementRef<any>;

  leftPanelOptionsMenu: () => MatMenu;
  leftPanelOptionsMenuTrigger: () => MatMenuTrigger;
  middlePanelOptionsMenu: () => MatMenu;
  middlePanelOptionsMenuTrigger: () => MatMenuTrigger;
  rightPanelOptionsMenu: () => MatMenu;
  rightPanelOptionsMenuTrigger: () => MatMenuTrigger;

  resizeLeftPanelStrip: () => ElementRef<HTMLElement> | NullOrUndef;
  resizeRightPanelStrip: () => ElementRef<HTMLElement> | NullOrUndef;
}

@Injectable()
export class AppPanelsLayoutService implements TrmrkDisaposable {
  static dfCssClass = 'trmrk-3-panels-layout';
  static dfPanelWidthRatios = [THIRD_WIDTH_RATIO, THIRD_WIDTH_RATIO, THIRD_WIDTH_RATIO];

  id: number = 0;
  setupArgs: AppPanelLayoutServiceSetupArgs | null = null;

  alwaysRenderLeftPanelChanged = new EventEmitter<boolean>();
  showLeftPanelChanged = new EventEmitter<boolean>();
  alwaysRenderMiddlePanelChanged = new EventEmitter<boolean>();
  showMiddlePanelChanged = new EventEmitter<boolean>();
  alwaysRenderRightPanelChanged = new EventEmitter<boolean>();
  showRightPanelChanged = new EventEmitter<boolean>();

  onAfterSetup = new EventEmitter<void>();
  onAppSettingsChoicesLoaded = new EventEmitter<void>();
  whenReady = new EventEmitter<void>();

  onLeftPanelTouchStartOrMouseDown = new EventEmitter<MouseEvent | TouchEvent>();
  onMiddlePanelTouchStartOrMouseDown = new EventEmitter<MouseEvent | TouchEvent>();
  onRightPanelTouchStartOrMouseDown = new EventEmitter<MouseEvent | TouchEvent>();
  onActivePanelChanged = new EventEmitter<PanelPosition>();

  cssClassArr: string[] = [AppPanelsLayoutService.dfCssClass];
  visiblePanelsCount = 0;

  corePanelWidthRatios = AppPanelsLayoutService.dfPanelWidthRatios;
  basePanelWidthRatios = AppPanelsLayoutService.dfPanelWidthRatios;
  panelWidthRatios = AppPanelsLayoutService.dfPanelWidthRatios;
  panelStyles: { [key: string]: string }[] = [{}, {}, {}];

  setupDone = false;
  appSettingsChoicesLoaded = false;

  isResizingLeftPanel = false;
  isResizingRightPanel = false;

  resizeLeftPanelStripCloseActionIsActivated = false;
  resizeRightPanelStripCloseActionIsActivated = false;

  resizeLeftPanelStripResetActionIsActivated = false;
  resizeRightPanelStripResetActionIsActivated = false;

  activePanel: PanelPosition = PanelPosition.None;
  optionsMenuOpenForPanel: PanelPosition = PanelPosition.None;

  private indexedDb = {
    appSettings: {
      choices: {
        appPanelsLayout: {
          catKey: '',
        },
      },
    },
  };

  private _cssClass: string[] = [];

  private _alwaysRenderLeftPanel: boolean = false;
  private _showLeftPanel: boolean = false;
  private _allowToggleLeftPanel: boolean = false;
  private _showLeftPanelOptionsBtn: boolean = false;

  private _alwaysRenderMiddlePanel: boolean = false;
  private _showMiddlePanel: boolean = false;
  private _preferMiddlePanel: boolean = false;
  private _allowToggleMiddlePanel: boolean = false;
  private _showMiddlePanelOptionsBtn: boolean = false;

  private _alwaysRenderRightPanel: boolean = false;
  private _showRightPanel: boolean = false;
  private _allowToggleRightPanel: boolean = false;
  private _showRightPanelOptionsBtn: boolean = false;

  private containerWidth: number | null = null;
  private panelMinWidthRatio: number | null = null;
  private leftPanelWidth: number | null = null;
  private rightPanelWidth: number | null = null;

  private leftPanelMenuClosedSubscriptions: Subscription[] = [];
  private middlePanelMenuClosedSubscriptions: Subscription[] = [];
  private rightPanelMenuClosedSubscriptions: Subscription[] = [];
  private appResetSubscription: Subscription;

  constructor(
    private appService: AppServiceBase,
    private basicAppSettingsDbAdapter: BasicAppSettingsDbAdapter
  ) {
    this.appResetSubscription = this.appService.onAppReset.subscribe(() => {
      this.loadAppSettingsChoices();
    });

    this.documentTouchStartOrMouseDown = this.documentTouchStartOrMouseDown.bind(this);
    this.leftPanelOptionsMenuClosed = this.leftPanelOptionsMenuClosed.bind(this);
    this.middlePanelOptionsMenuClosed = this.middlePanelOptionsMenuClosed.bind(this);
    this.rightPanelOptionsMenuClosed = this.rightPanelOptionsMenuClosed.bind(this);

    document.addEventListener('mousedown', this.documentTouchStartOrMouseDown, {
      capture: true,
    });

    document.addEventListener('touchstart', this.documentTouchStartOrMouseDown, {
      capture: true,
    });
  }

  get cssClass() {
    return this._cssClass;
  }

  set cssClass(value: string[]) {
    this._cssClass = value;
  }

  get alwaysRenderLeftPanel() {
    return this._alwaysRenderLeftPanel;
  }

  set alwaysRenderLeftPanel(value: boolean) {
    if (this._alwaysRenderLeftPanel !== value) {
      this._alwaysRenderLeftPanel = value;
      this.panelsVisibilityChanged();
      this.leftPanelVisibilityPropValueChanged();
      this.alwaysRenderLeftPanelChanged.emit(value);
    }
  }

  get showLeftPanel() {
    return this._showLeftPanel;
  }

  set showLeftPanel(value: boolean) {
    if (this._showLeftPanel !== value) {
      this._showLeftPanel = value;
      this.panelsVisibilityChanged();
      this.leftPanelVisibilityPropValueChanged();
      this.showLeftPanelChanged.emit(value);

      if (!value) {
        if (!this.showMiddlePanel && !this.showRightPanel) {
          if (this.preferMiddlePanel) {
            this.togglePanelVisibility(PanelPosition.Middle, true);
          } else {
            this.togglePanelVisibility(PanelPosition.Right, true);
          }
        }
      }
    }
  }

  get allowToggleLeftPanel() {
    return this._allowToggleLeftPanel;
  }

  set allowToggleLeftPanel(value: boolean) {
    this._allowToggleLeftPanel = value;
  }

  get showLeftPanelOptionsBtn() {
    return this._showLeftPanelOptionsBtn;
  }

  set showLeftPanelOptionsBtn(value: boolean) {
    this._showLeftPanelOptionsBtn = value;
  }

  get alwaysRenderMiddlePanel() {
    return this._alwaysRenderMiddlePanel;
  }

  set alwaysRenderMiddlePanel(value: boolean) {
    if (this._alwaysRenderMiddlePanel !== value) {
      this._alwaysRenderMiddlePanel = value;
      this.panelsVisibilityChanged();
      this.middlePanelVisibilityPropValueChanged();
      this.alwaysRenderMiddlePanelChanged.emit(value);
    }
  }

  get showMiddlePanel() {
    return this._showMiddlePanel;
  }

  set showMiddlePanel(value: boolean) {
    if (this._showMiddlePanel !== value) {
      this._showMiddlePanel = value;

      if (value) {
        this.preferMiddlePanel = true;
      } else if (this.showRightPanel) {
        this.preferMiddlePanel = false;
      }

      this.panelsVisibilityChanged();
      this.middlePanelVisibilityPropValueChanged();
      this.showMiddlePanelChanged.emit(value);
    }
  }

  get preferMiddlePanel() {
    return this._preferMiddlePanel;
  }

  set preferMiddlePanel(value: boolean) {
    this._preferMiddlePanel = value;
  }

  get allowToggleMiddlePanel() {
    return this._allowToggleMiddlePanel;
  }

  set allowToggleMiddlePanel(value: boolean) {
    this._allowToggleMiddlePanel = value;
  }

  get showMiddlePanelOptionsBtn() {
    return this._showMiddlePanelOptionsBtn;
  }

  set showMiddlePanelOptionsBtn(value: boolean) {
    this._showMiddlePanelOptionsBtn = value;
  }

  get alwaysRenderRightPanel() {
    return this._alwaysRenderRightPanel;
  }

  set alwaysRenderRightPanel(value: boolean) {
    if (this._alwaysRenderRightPanel !== value) {
      this._alwaysRenderRightPanel = value;
      this.panelsVisibilityChanged();
      this.rightPanelVisibilityPropValueChanged();
      this.alwaysRenderRightPanelChanged.emit(value);
    }
  }

  get showRightPanel() {
    return this._showRightPanel;
  }

  set showRightPanel(value: boolean) {
    if (this._showRightPanel !== value) {
      this._showRightPanel = value;

      if (value) {
        this.preferMiddlePanel = false;
      }

      this.panelsVisibilityChanged();
      this.rightPanelVisibilityPropValueChanged();
      this.showRightPanelChanged.emit(value);
    }
  }

  get allowToggleRightPanel() {
    return this._allowToggleRightPanel;
  }

  set allowToggleRightPanel(value: boolean) {
    this._allowToggleRightPanel = value;
  }

  get showRightPanelOptionsBtn() {
    return this._showRightPanelOptionsBtn;
  }

  set showRightPanelOptionsBtn(value: boolean) {
    this._showRightPanelOptionsBtn = value;
  }

  leftPanelResizeBtnDragStart(event: TouchOrMouseCoords) {
    this.updatePanelWidthRatiosCore(PanelPosition.Left);
  }

  leftPanelResizeBtnDrag(event: TrmrkDragEvent) {
    const leftPanelNewWidthRatio = this.getNewPanelWidthRatioCore(event, PanelPosition.Left);

    const middlePanelNewWidthRatio =
      (FULL_WIDTH_RATIO - leftPanelNewWidthRatio) *
      (this.basePanelWidthRatios[1] /
        (this.basePanelWidthRatios[1] + this.basePanelWidthRatios[2]));

    const rightPanelNewWidthRatio =
      FULL_WIDTH_RATIO - leftPanelNewWidthRatio - middlePanelNewWidthRatio;

    this.basePanelWidthRatios = [
      leftPanelNewWidthRatio,
      middlePanelNewWidthRatio,
      rightPanelNewWidthRatio,
    ];

    this.updatePanelWidths();
    this.highlightResizePanelStripIfReq(event, true);
  }

  leftPanelResizeBtnDragEnd(event: TrmrkDragEvent) {
    this.onPanelResizeBtnDragEnd(PanelPosition.Left);
  }

  rightPanelResizeBtnDragStart(event: TouchOrMouseCoords) {
    this.updatePanelWidthRatiosCore(PanelPosition.Right);
  }

  rightPanelResizeBtnDrag(event: TrmrkDragEvent) {
    const rightPanelNewWidthRatio = this.getNewPanelWidthRatioCore(event, PanelPosition.Right);

    const middlePanelNewWidthRatio =
      FULL_WIDTH_RATIO -
      (this.showLeftPanel ? this.basePanelWidthRatios[0] : 0) -
      rightPanelNewWidthRatio;

    this.basePanelWidthRatios = [
      this.basePanelWidthRatios[0],
      middlePanelNewWidthRatio,
      rightPanelNewWidthRatio,
    ];

    this.updatePanelWidths();
    this.highlightResizePanelStripIfReq(event, false);
  }

  rightPanelResizeBtnDragEnd(event: TrmrkDragEvent) {
    this.onPanelResizeBtnDragEnd(PanelPosition.Right);
  }

  leftPanelOptionsMenuBtnClick() {
    this.setupArgs?.leftPanelOptionsMenuTrigger().openMenu();
    this.optionsMenuOpenForPanel = PanelPosition.Left;
  }

  middlePanelOptionsMenuBtnClick() {
    this.setupArgs?.middlePanelOptionsMenuTrigger().openMenu();
    this.optionsMenuOpenForPanel = PanelPosition.Middle;
  }

  rightPanelOptionsMenuBtnClick() {
    this.setupArgs?.rightPanelOptionsMenuTrigger().openMenu();
    this.optionsMenuOpenForPanel = PanelPosition.Right;
  }

  leftPanelTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.onLeftPanelTouchStartOrMouseDown.emit(event);
    this.updateActivePanel(PanelPosition.Left);
  }

  middlePanelTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.onMiddlePanelTouchStartOrMouseDown.emit(event);
    this.updateActivePanel(PanelPosition.Middle);
  }

  rightPanelTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.onRightPanelTouchStartOrMouseDown.emit(event);
    this.updateActivePanel(PanelPosition.Right);
  }

  documentTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    const target = event.target as HTMLElement;

    if (target) {
      if (!(this.setupArgs?.containerEl()?.nativeElement as HTMLElement)?.contains(target)) {
        this.updateActivePanel(PanelPosition.None);
      }
    }
  }

  leftPanelCloseBtnClicked() {
    this.togglePanelVisibility(PanelPosition.Left, false);
  }

  middlePanelCloseBtnClicked() {
    this.togglePanelVisibility(PanelPosition.Middle, false);
  }

  rightPanelCloseBtnClicked() {
    this.togglePanelVisibility(PanelPosition.Right, false);
  }

  showLeftPanelBtnShortTouchOrMouseClick(buttonPanelPosition: PanelPosition) {
    this.togglePanelVisibility(PanelPosition.Left, true);
    this.togglePanelVisibility(buttonPanelPosition, false);
  }

  showLeftPanelBtnLongTouchOrMouseClick() {
    this.togglePanelVisibility(PanelPosition.Left, true);
  }

  showMiddlePanelBtnShortTouchOrMouseClick() {
    this.togglePanelVisibility(PanelPosition.Middle, true);
    this.togglePanelVisibility(PanelPosition.Right, false);
  }

  showMiddlePanelBtnLongTouchOrMouseClick() {
    this.togglePanelVisibility(PanelPosition.Middle, true);
  }

  showRightPanelBtnShortTouchOrMouseClick() {
    this.togglePanelVisibility(PanelPosition.Right, true);
    this.togglePanelVisibility(PanelPosition.Middle, false);
  }

  showRightPanelBtnLongTouchOrMouseClick() {
    this.togglePanelVisibility(PanelPosition.Right, true);
  }

  onPanelResizeBtnDragEnd(resizedPanel: PanelPosition) {
    this.isResizingLeftPanel = false;
    this.isResizingRightPanel = false;
    this.containerWidth = null;
    this.panelMinWidthRatio = null;
    this.leftPanelWidth = null;
    this.rightPanelWidth = null;
    this.basePanelWidthRatios = this.panelWidthRatios;

    if (this.resizeLeftPanelStripCloseActionIsActivated) {
      this.togglePanelVisibility(PanelPosition.Left, false);
    } else if (this.resizeRightPanelStripCloseActionIsActivated) {
      this.togglePanelVisibility(PanelPosition.Right, false);
    }

    this.updateCorePanelWidthRatios(resizedPanel);
    this.applyCorePanelWidthRatios();
    this.updatePanelWidths();
    this.unhighlightResizePanelStrips();
    this.writePanelWidthRatiosToIndexedDb();
  }

  panelsVisibilityChanged() {
    this.visiblePanelsCount = this.getVisiblePanelsCount();
    this.cssClassArr = this.getCssClass();
    this.applyCorePanelWidthRatios();
    this.updatePanelWidthRatiosCore(PanelPosition.None);
    this.updatePanelWidths();
  }

  leftPanelVisibilityPropValueChanged() {
    if (this.setupArgs) {
      this.panelVisibilityPropValueChanged(
        this.setupArgs.leftPanelOptionsMenuTrigger,
        this.leftPanelMenuClosedSubscriptions,
        this.leftPanelOptionsMenuClosed
      );
    }
  }

  middlePanelVisibilityPropValueChanged() {
    if (this.setupArgs) {
      this.panelVisibilityPropValueChanged(
        this.setupArgs.rightPanelOptionsMenuTrigger,
        this.rightPanelMenuClosedSubscriptions,
        this.rightPanelOptionsMenuClosed
      );
    }
  }

  rightPanelVisibilityPropValueChanged() {
    if (this.setupArgs) {
      this.panelVisibilityPropValueChanged(
        this.setupArgs.middlePanelOptionsMenuTrigger,
        this.middlePanelMenuClosedSubscriptions,
        this.middlePanelOptionsMenuClosed
      );
    }
  }

  panelVisibilityPropValueChanged(
    panelOptionsMenuTriggerFactory: () => MatMenuTrigger,
    panelMenuClosedSubscriptions: Subscription[],
    panelOptionsMenuClosed: () => void
  ) {
    setTimeout(() => {
      const panelOptionsMenuTrigger = panelOptionsMenuTriggerFactory();

      if (panelOptionsMenuTrigger) {
        panelMenuClosedSubscriptions.push(
          panelOptionsMenuTrigger.menuClosed.subscribe(panelOptionsMenuClosed)
        );
      }
    });
  }

  leftPanelOptionsMenuClosed() {
    this.activePanel = PanelPosition.Left;
    this.optionsMenuOpenForPanel = PanelPosition.None;
  }

  middlePanelOptionsMenuClosed() {
    this.activePanel = PanelPosition.Middle;
    this.optionsMenuOpenForPanel = PanelPosition.None;
  }

  rightPanelOptionsMenuClosed() {
    this.activePanel = PanelPosition.Right;
    this.optionsMenuOpenForPanel = PanelPosition.None;
  }

  setup(args: AppPanelLayoutServiceSetupArgs) {
    this.reset();
    this.setupArgs = args;
    this.updatePanelWidthRatiosCore(PanelPosition.None);
    this.updatePanelWidths();
    this.setupDone = true;
    this.onAfterSetup.emit();
    this.fireReadyIfReq();
  }

  dispose() {
    this.reset();
    this.alwaysRenderLeftPanelChanged.unsubscribe();
    this.showLeftPanelChanged.unsubscribe();
    this.alwaysRenderMiddlePanelChanged.unsubscribe();
    this.showMiddlePanelChanged.unsubscribe();
    this.alwaysRenderRightPanelChanged.unsubscribe();
    this.showRightPanelChanged.unsubscribe();

    this.onLeftPanelTouchStartOrMouseDown.unsubscribe();
    this.onMiddlePanelTouchStartOrMouseDown.unsubscribe();
    this.onRightPanelTouchStartOrMouseDown.unsubscribe();
    this.onActivePanelChanged.unsubscribe();
    this.onAfterSetup.unsubscribe();

    for (let subscriptionsArr of [
      this.leftPanelMenuClosedSubscriptions,
      this.middlePanelMenuClosedSubscriptions,
      this.rightPanelMenuClosedSubscriptions,
    ]) {
      for (let subscription of subscriptionsArr) {
        subscription.unsubscribe();
      }

      subscriptionsArr.splice(0, subscriptionsArr.length);
    }

    this.appResetSubscription.unsubscribe();
    this.appResetSubscription = null!;
    this.setupArgs = null;
  }

  reset() {}

  loadAppSettingsChoices() {
    return new Promise<void>((resolve, reject) => {
      const appPanelsLayoutCatKey = (this.indexedDb.appSettings.choices.appPanelsLayout.catKey =
        this.appService.getAppObjectKey([
          commonAppSettingsChoiceCatKeys.appPanelsLayout,
          this.setupArgs!.layoutKey ?? commonLayoutKeys.main,
        ]));

      this.basicAppSettingsDbAdapter.open(
        (_, db) => {
          const keyPathsArr = [
            commonAppSettingsChoiceKeys.panelWidthRatios,
            commonAppSettingsChoiceKeys.panelVisibilities,
          ].map((key) => [appPanelsLayoutCatKey, this.appService.getAppObjectKey([key])]);

          Promise.all(
            keyPathsArr.map((keyPath) =>
              dbRequestToPromise<AppSettingsChoice>(
                this.basicAppSettingsDbAdapter.stores.choices.store(db).get(keyPath)
              )
            )
          ).then((resultsArr) => {
            for (let result of resultsArr) {
              const choice = result.value;

              if (choice) {
                const choiceKey = extractAppObjectKeyParts(choice.key).filter(
                  (str) => str.length
                )[0];

                switch (choiceKey) {
                  case commonAppSettingsChoiceKeys.panelWidthRatios:
                    this.corePanelWidthRatios = choice.value;
                    this.applyCorePanelWidthRatios();
                    this.updatePanelWidthRatiosCore(PanelPosition.None);
                    this.updatePanelWidths();
                    break;
                  case commonAppSettingsChoiceKeys.panelVisibilities:
                    const panelVisibilities = choice.value as boolean[];
                    this.showLeftPanel = panelVisibilities[0];
                    this.showMiddlePanel = panelVisibilities[1];
                    this.showRightPanel = panelVisibilities[2];
                    break;
                }
              }
            }

            this.appSettingsChoicesLoaded = true;
            this.onAppSettingsChoicesLoaded.emit();
            this.fireReadyIfReq();
            resolve();
          });
        },
        (_, error) => {
          reject(error);
        }
      );
    });
  }

  applyCorePanelWidthRatios() {
    const visibilities = [this.showLeftPanel, this.showMiddlePanel, this.showRightPanel];

    this.basePanelWidthRatios = this.corePanelWidthRatios.map((value, i) =>
      visibilities[i] ? value : 0
    );

    if (visibilities.some((v) => !v)) {
      if (visibilities[0]) {
        if (visibilities[1]) {
          if (!visibilities[2]) {
            this.basePanelWidthRatios[1] = FULL_WIDTH_RATIO - this.basePanelWidthRatios[0];
          }
        } else if (visibilities[2]) {
          this.basePanelWidthRatios[2] = FULL_WIDTH_RATIO - this.basePanelWidthRatios[0];
        } else {
          this.basePanelWidthRatios[0] = FULL_WIDTH_RATIO;
        }
      } else if (visibilities[1]) {
        if (visibilities[2]) {
          const increaseFactor =
            FULL_WIDTH_RATIO / (FULL_WIDTH_RATIO - this.corePanelWidthRatios[0]);

          this.basePanelWidthRatios = this.basePanelWidthRatios.map((v, i) =>
            i > 0 ? v * increaseFactor : 0
          );
        } else {
          this.basePanelWidthRatios[1] = FULL_WIDTH_RATIO;
        }
      } else {
        this.basePanelWidthRatios[2] = FULL_WIDTH_RATIO;
      }
    }
  }

  fireReadyIfReq() {
    if (this.setupDone && this.appSettingsChoicesLoaded) {
      this.whenReady.emit();
    }
  }

  updatePanelWidthRatiosCore(resizedPanel: PanelPosition) {
    if (this.setupArgs?.containerEl()) {
      this.isResizingLeftPanel = resizedPanel === PanelPosition.Left;
      this.isResizingRightPanel = resizedPanel === PanelPosition.Right;
      this.containerWidth = (this.setupArgs.containerEl().nativeElement as HTMLElement).offsetWidth;
      this.panelMinWidthRatio = (MIN_PANEL_WIDTH_PX / this.containerWidth) * FULL_WIDTH_RATIO;

      this.leftPanelWidth = this.showLeftPanel
        ? (this.setupArgs.leftPanelEl()?.nativeElement as HTMLElement)?.offsetWidth ?? 0
        : 0;

      this.rightPanelWidth = this.showRightPanel
        ? (this.setupArgs.rightPanelEl()?.nativeElement as HTMLElement)?.offsetWidth ?? 0
        : 0;
    }
  }

  updateCorePanelWidthRatios(resizedPanel: PanelPosition) {
    if (this.visiblePanelsCount === 3) {
      this.corePanelWidthRatios = [...this.basePanelWidthRatios];
    } else {
      if (this.showLeftPanel) {
        const decreaseFactor =
          (this.basePanelWidthRatios[1] + this.basePanelWidthRatios[2]) /
          (this.corePanelWidthRatios[1] + this.corePanelWidthRatios[2]);

        this.corePanelWidthRatios[0] = this.basePanelWidthRatios[0];
        this.corePanelWidthRatios[1] = Math.floor(this.corePanelWidthRatios[1] * decreaseFactor);
        this.corePanelWidthRatios[2] = Math.floor(this.corePanelWidthRatios[2] * decreaseFactor);
      } else {
        const decreaseFactor =
          (this.corePanelWidthRatios[1] + this.corePanelWidthRatios[2]) / FULL_WIDTH_RATIO;

        this.corePanelWidthRatios[1] = Math.floor(this.basePanelWidthRatios[1] * decreaseFactor);
        this.corePanelWidthRatios[2] = Math.floor(this.basePanelWidthRatios[2] * decreaseFactor);
      }
    }

    if (this.resizeLeftPanelStripResetActionIsActivated) {
      const relRatio =
        this.corePanelWidthRatios[1] /
        (this.corePanelWidthRatios[1] + this.corePanelWidthRatios[2]);

      this.corePanelWidthRatios[0] = THIRD_WIDTH_RATIO;
      this.corePanelWidthRatios[1] = Math.floor(relRatio * TWO_THIRDS_WIDTH_RATIO);
      this.corePanelWidthRatios[2] = TWO_THIRDS_WIDTH_RATIO - this.corePanelWidthRatios[1];
    } else if (this.resizeRightPanelStripResetActionIsActivated) {
      const availableWidth = FULL_WIDTH_RATIO - this.corePanelWidthRatios[0];
      this.corePanelWidthRatios[1] = this.corePanelWidthRatios[2] = Math.floor(availableWidth / 2);
    }
  }

  updateActivePanel(activePanel: PanelPosition) {
    if (activePanel !== this.activePanel) {
      this.activePanel = activePanel;
      this.onActivePanelChanged.emit(activePanel);
    }
  }

  togglePanelVisibility(panelPosition: PanelPosition, show: boolean) {
    switch (panelPosition) {
      case PanelPosition.Left:
        this.showLeftPanel = show;
        break;
      case PanelPosition.Middle:
        this.showMiddlePanel = show;
        break;
      case PanelPosition.Right:
        this.showRightPanel = show;
        break;
    }

    this.writePanelVisibilitiesToIndexedDb();
  }

  highlightResizePanelStripIfReq(event: TrmrkDragEvent, isLeftPanel: boolean) {
    if (this.setupArgs) {
      const resizePanelStrip = isLeftPanel
        ? this.setupArgs.resizeLeftPanelStrip()
        : this.setupArgs.resizeRightPanelStrip();
      const target = event.touchOrMouseMoveCoords.evt!.target as HTMLElement;

      if (target && resizePanelStrip) {
        const nodesArr = htmlCollectionToArr(resizePanelStrip.nativeElement.children);
        const idx = getElemIdx(nodesArr, event.touchOrMouseMoveCoords);
        let closeBtnActivated = false;
        let resetBtnActivated = false;

        switch (idx) {
          case 0:
            closeBtnActivated = true;
            break;
          case 1:
            resetBtnActivated = true;
            break;
          case 3:
            closeBtnActivated = true;
            break;
          case 4:
            resetBtnActivated = true;
            break;
        }

        if (isLeftPanel) {
          this.resizeLeftPanelStripCloseActionIsActivated = closeBtnActivated;
          this.resizeLeftPanelStripResetActionIsActivated = resetBtnActivated;
        } else {
          this.resizeRightPanelStripCloseActionIsActivated = closeBtnActivated;
          this.resizeRightPanelStripResetActionIsActivated = resetBtnActivated;
        }
      }
    }
  }

  unhighlightResizePanelStrips() {
    this.resizeLeftPanelStripCloseActionIsActivated = false;
    this.resizeLeftPanelStripResetActionIsActivated = false;
    this.resizeRightPanelStripCloseActionIsActivated = false;
    this.resizeRightPanelStripResetActionIsActivated = false;
  }

  writePanelWidthRatiosToIndexedDb() {
    this.basicAppSettingsDbAdapter.open((_, db) => {
      this.basicAppSettingsDbAdapter.stores.choices.store(db, null, 'readwrite').put({
        catKey: this.indexedDb.appSettings.choices.appPanelsLayout.catKey,
        key: this.appService.getAppObjectKey([commonAppSettingsChoiceKeys.panelWidthRatios]),
        value: this.corePanelWidthRatios,
      });
    });
  }

  writePanelVisibilitiesToIndexedDb() {
    this.basicAppSettingsDbAdapter.open((_, db) => {
      this.basicAppSettingsDbAdapter.stores.choices.store(db, null, 'readwrite').put({
        catKey: this.indexedDb.appSettings.choices.appPanelsLayout.catKey,
        key: this.appService.getAppObjectKey([commonAppSettingsChoiceKeys.panelVisibilities]),
        value: [this.showLeftPanel, this.showMiddlePanel, this.showRightPanel],
      });
    });
  }

  getCssClass() {
    const cssClass = [AppPanelsLayoutService.dfCssClass, ...this.cssClass];

    if (this.showLeftPanel) {
      cssClass.push('trmrk-has-left-panel');
    }

    if (this.showMiddlePanel) {
      cssClass.push('trmrk-has-middle-panel');
    }

    if (this.showRightPanel) {
      cssClass.push('trmrk-has-right-panel');
    }

    cssClass.push(`trmrk-has-${this.visiblePanelsCount}-panels`);
    return cssClass;
  }

  getVisiblePanelsCount() {
    let visiblePanelsCount = 0;

    if (this.showLeftPanel) {
      visiblePanelsCount++;
    }

    if (this.showMiddlePanel) {
      visiblePanelsCount++;
    }

    if (this.showRightPanel) {
      visiblePanelsCount++;
    }

    return visiblePanelsCount;
  }

  updatePanelWidths() {
    if (this.setupArgs?.containerEl()) {
      let leftRatio: number, middleRatio: number, rightRatio: number;
      const baseArr = this.basePanelWidthRatios;

      leftRatio = this.showLeftPanel
        ? this.visiblePanelsCount === 1
          ? FULL_WIDTH_RATIO
          : this.normalizePanelWidthRatio(baseArr[0])
        : 0;

      middleRatio = this.showMiddlePanel
        ? this.showRightPanel
          ? this.normalizePanelWidthRatio(
              (baseArr[1] / (baseArr[1] + baseArr[2])) * (FULL_WIDTH_RATIO - leftRatio),
              leftRatio
            )
          : FULL_WIDTH_RATIO - leftRatio
        : 0;

      rightRatio = this.showRightPanel ? FULL_WIDTH_RATIO - leftRatio - middleRatio : 0;
      const panelWidthRatios = [leftRatio, middleRatio, rightRatio];
      this.panelWidthRatios = panelWidthRatios;

      this.panelStyles = panelWidthRatios.map((ratio) => {
        ratio = Math.floor(ratio);

        return {
          width: `${ratio / 1000}%`,
          maxWidth: `${ratio / 1000}%`,
        };
      });
    } else {
      this.panelStyles = [{}, {}, {}];
    }
  }

  normalizePanelWidthRatio(panelWidthRatio: number, otherPanelWidthRatio?: number | NullOrUndef) {
    const minRatio = this.panelMinWidthRatio!;

    const maxRatio = Math.max(
      FULL_WIDTH_RATIO -
        (this.visiblePanelsCount === 3 ? minRatio : 0) -
        (otherPanelWidthRatio ?? minRatio),
      minRatio
    );

    panelWidthRatio = Math.min(Math.max(panelWidthRatio, minRatio), maxRatio);
    return panelWidthRatio;
  }

  getPanelResizeDx(event: TrmrkDragEvent) {
    const dx = event.touchOrMouseMoveCoords.clientX - event.touchStartOrMouseDownCoords!.clientX;
    return dx;
  }

  getNewPanelWidthCore(event: TrmrkDragEvent, resizedPanel: PanelPosition) {
    const dx = this.getPanelResizeDx(event);
    let newPanelWidth: number;

    switch (resizedPanel) {
      case PanelPosition.Left:
        newPanelWidth = this.leftPanelWidth! + dx;
        break;
      case PanelPosition.Right:
        newPanelWidth = this.rightPanelWidth! - dx;
        break;
      default:
        throw new Error(`Unsupported resized panel position: ${resizedPanel}`);
    }

    return newPanelWidth;
  }

  getNewPanelWidthRatioCore(event: TrmrkDragEvent, resizedPanel: PanelPosition) {
    const newPanelWidth = this.getNewPanelWidthCore(event, resizedPanel);
    const newPanelWidthRatio = (newPanelWidth / this.containerWidth!) * FULL_WIDTH_RATIO;
    return newPanelWidthRatio;
  }
}
