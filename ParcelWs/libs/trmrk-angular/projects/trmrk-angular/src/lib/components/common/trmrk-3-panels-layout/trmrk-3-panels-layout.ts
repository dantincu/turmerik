import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ElementRef,
  ViewChild,
  Output,
  EventEmitter,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { NullOrUndef } from '../../../../trmrk/core';
import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

import { AppServiceBase } from '../../../services/common/app-service-base';
import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkDrag } from '../../../directives/trmrk-drag';
import { TrmrkDragEvent } from '../../../services/common/types';
import { drag_pan } from '../../../assets/icons/material/drag_pan';
import { recenter } from '../../../assets/icons/material/recenter';
import { left_panel_open } from '../../../assets/icons/material/left_panel_open';
import { TrmrkTouchStartOrMouseDown } from '../../../directives/trmrk-touch-start-or-mouse-down';

export const MIN_PANEL_WIDTH_PX = 54;
export const FULL_WIDTH_RATIO = 100000;

export enum PanelPosition {
  None = 0,
  Left,
  Middle,
  Right,
}

@Component({
  selector: 'trmrk-3-panels-layout',
  imports: [
    CommonModule,
    NgTemplateOutlet,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TrmrkHorizStrip,
    TrmrkDrag,
    TrmrkTouchStartOrMouseDown,
  ],
  templateUrl: './trmrk-3-panels-layout.html',
  styleUrl: './trmrk-3-panels-layout.scss',
})
export class Trmrk3PanelsLayout implements OnChanges, OnDestroy, AfterViewInit {
  static dfCssClass = 'trmrk-3-panels-layout';
  static dfPanelWidthRatios = [33333, 33333, 33333];

  @Output() trmrkLeftPanelTouchStartOrMouseDown = new EventEmitter<MouseEvent | TouchEvent>();
  @Output() trmrkMiddlePanelTouchStartOrMouseDown = new EventEmitter<MouseEvent | TouchEvent>();
  @Output() trmrkRightPanelTouchStartOrMouseDown = new EventEmitter<MouseEvent | TouchEvent>();
  @Output() trmrkActivePanelChanged = new EventEmitter<PanelPosition>();

  @Input() trmrkCssClass: string[] = [];
  @Input() trmrkDbObjectPfx: string = '';

  @Input() trmrkAlwaysRenderLeftPanel: boolean = false;
  @Input() trmrkShowLeftPanel: boolean = false;
  @Input() trmrkLeftPanelTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkAllowToggleLeftPanel: boolean = false;
  @Input() trmrkShowLeftPanelOptionsBtn: boolean = false;
  @Input() trmrkLeftPanelOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;

  @Input() trmrkAlwaysRenderMiddlePanel: boolean = false;
  @Input() trmrkShowMiddlePanel: boolean = false;
  @Input() trmrkMiddlePanelTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkAllowToggleMiddlePanel: boolean = false;
  @Input() trmrkShowMiddlePanelOptionsBtn: boolean = false;
  @Input() trmrkMiddlePanelOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;

  @Input() trmrkAlwaysRenderRightPanel: boolean = false;
  @Input() trmrkShowRightPanel: boolean = false;
  @Input() trmrkRightPanelTemplate?: TemplateRef<any> | NullOrUndef;
  @Input() trmrkAllowToggleRightPanel: boolean = false;
  @Input() trmrkShowRightPanelOptionsBtn: boolean = false;
  @Input() trmrkRightPanelOptionsMenuTemplate?: TemplateRef<any> | NullOrUndef;

  PanelPosition = PanelPosition;

  cssClass: string[] = [Trmrk3PanelsLayout.dfCssClass];
  showLeftPanel = false;
  showMiddlePanel = false;
  showRightPanel = false;
  visiblePanelsCount = 0;

  drag_pan: SafeHtml;
  recenter: SafeHtml;
  left_panel_open: SafeHtml;

  basePanelWidthRatios = Trmrk3PanelsLayout.dfPanelWidthRatios;
  panelWidthRatios = Trmrk3PanelsLayout.dfPanelWidthRatios;
  panelStyles!: { [key: string]: string }[];

  @ViewChild('containerEl') containerEl!: ElementRef<any>;
  @ViewChild('leftPanelEl') leftPanelEl!: ElementRef<any>;
  @ViewChild('rightPanelEl') rightPanelEl!: ElementRef<any>;

  @ViewChild('leftPanelOptionsMenu', { read: MatMenu }) leftPanelOptionsMenu!: MatMenu;

  @ViewChild('leftPanelOptionsMenuTrigger', { read: MatMenuTrigger })
  leftPanelOptionsMenuTrigger!: MatMenuTrigger;

  @ViewChild('middlePanelOptionsMenu', { read: MatMenu }) middlePanelOptionsMenu!: MatMenu;

  @ViewChild('middlePanelOptionsMenuTrigger', { read: MatMenuTrigger })
  middlePanelOptionsMenuTrigger!: MatMenuTrigger;

  @ViewChild('rightPanelOptionsMenu', { read: MatMenu }) rightPanelOptionsMenu!: MatMenu;

  @ViewChild('rightPanelOptionsMenuTrigger', { read: MatMenuTrigger })
  rightPanelOptionsMenuTrigger!: MatMenuTrigger;

  isResizingLeftPanel = false;
  isResizingRightPanel = false;

  activePanel: PanelPosition = PanelPosition.None;

  private containerWidth: number | null = null;
  private panelMinWidthRatio: number | null = null;
  private leftPanelWidth: number | null = null;
  private rightPanelWidth: number | null = null;

  constructor(private appService: AppServiceBase, private domSanitizer: DomSanitizer) {
    this.drag_pan = domSanitizer.bypassSecurityTrustHtml(drag_pan);
    this.recenter = domSanitizer.bypassSecurityTrustHtml(recenter);
    this.left_panel_open = domSanitizer.bypassSecurityTrustHtml(left_panel_open);
    this.documentTouchStartOrMouseDown = this.documentTouchStartOrMouseDown.bind(this);

    setTimeout(() => {
      this.leftPanelOptionsMenuTrigger.menu = this.leftPanelOptionsMenu;
      this.middlePanelOptionsMenuTrigger.menu = this.middlePanelOptionsMenu;
      this.rightPanelOptionsMenuTrigger.menu = this.rightPanelOptionsMenu;
    });
  }

  ngAfterViewInit(): void {
    document.addEventListener('mousedown', this.documentTouchStartOrMouseDown, {
      capture: true,
    });

    document.addEventListener('touchstart', this.documentTouchStartOrMouseDown, {
      capture: true,
    });

    this.updatePanelWidthRatiosCore(PanelPosition.None);
    this.updatePanelWidths();
  }

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkCssClass,
      () => {
        this.cssClass = this.getCssClass();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowLeftPanel,
      () => {
        this.showLeftPanel = this.trmrkShowLeftPanel;
        this.panelsVisibilityChanged();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowMiddlePanel,
      () => {
        this.showMiddlePanel = this.trmrkShowMiddlePanel;
        this.panelsVisibilityChanged();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowRightPanel,
      () => {
        this.showRightPanel = this.trmrkShowRightPanel;
        this.panelsVisibilityChanged();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkAlwaysRenderLeftPanel,
      () => {
        this.panelsVisibilityChanged();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkAlwaysRenderMiddlePanel,
      () => {
        this.panelsVisibilityChanged();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkAlwaysRenderRightPanel,
      () => {
        this.panelsVisibilityChanged();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkDbObjectPfx,
      () => {}
    );
  }

  ngOnDestroy(): void {
    document.removeEventListener('mousedown', this.documentTouchStartOrMouseDown, {
      capture: true,
    });

    document.removeEventListener('touchstart', this.documentTouchStartOrMouseDown, {
      capture: true,
    });
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

    this.updatePanelWidths(PanelPosition.Left);
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
      FULL_WIDTH_RATIO - this.basePanelWidthRatios[0] - rightPanelNewWidthRatio;

    this.basePanelWidthRatios = [
      this.basePanelWidthRatios[0],
      middlePanelNewWidthRatio,
      rightPanelNewWidthRatio,
    ];

    this.updatePanelWidths(PanelPosition.Right);
  }

  rightPanelResizeBtnDragEnd(event: TrmrkDragEvent) {
    this.onPanelResizeBtnDragEnd(PanelPosition.Right);
  }

  leftPanelOptionsMenuBtnClick() {
    this.leftPanelOptionsMenuTrigger.openMenu();
  }

  middlePanelOptionsMenuBtnClick() {
    this.middlePanelOptionsMenuTrigger.openMenu();
  }

  rightPanelOptionsMenuBtnClick() {
    this.rightPanelOptionsMenuTrigger.openMenu();
  }

  leftPanelTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.trmrkLeftPanelTouchStartOrMouseDown.emit(event);
    this.updateActivePanel(PanelPosition.Left);
  }

  middlePanelTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.trmrkMiddlePanelTouchStartOrMouseDown.emit(event);
    this.updateActivePanel(PanelPosition.Middle);
  }

  rightPanelTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.trmrkRightPanelTouchStartOrMouseDown.emit(event);
    this.updateActivePanel(PanelPosition.Right);
  }

  documentTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    const target = event.target as HTMLElement;

    if (target) {
      if (!(this.containerEl.nativeElement as HTMLElement).contains(target)) {
        this.updateActivePanel(PanelPosition.None);
      }
    }
  }

  updatePanelWidthRatiosCore(resizedPanel: PanelPosition) {
    if (this.containerEl) {
      this.isResizingLeftPanel = resizedPanel === PanelPosition.Left;
      this.isResizingRightPanel = resizedPanel === PanelPosition.Right;
      this.containerWidth = (this.containerEl.nativeElement as HTMLElement).offsetWidth;
      this.panelMinWidthRatio = (MIN_PANEL_WIDTH_PX / this.containerWidth) * FULL_WIDTH_RATIO;
      this.leftPanelWidth = (this.leftPanelEl.nativeElement as HTMLElement).offsetWidth;
      this.rightPanelWidth = (this.rightPanelEl.nativeElement as HTMLElement).offsetWidth;
    }
  }

  onPanelResizeBtnDragEnd(resizedPanel: PanelPosition) {
    this.isResizingLeftPanel = false;
    this.isResizingRightPanel = false;
    this.containerWidth = null;
    this.panelMinWidthRatio = null;
    this.leftPanelWidth = null;
    this.rightPanelWidth = null;
    this.basePanelWidthRatios = this.panelWidthRatios;
  }

  getCssClass() {
    const cssClass = [Trmrk3PanelsLayout.dfCssClass, ...this.trmrkCssClass];

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

  updatePanelWidths(resizedPanel: PanelPosition = PanelPosition.None) {
    if (this.containerEl) {
      let leftRatio: number, middleRatio: number, rightRatio: number;
      const baseArr = this.basePanelWidthRatios;

      if (resizedPanel !== PanelPosition.Right) {
        leftRatio = this.showLeftPanel ? this.normalizePanelWidthRatio(baseArr[0]) : 0;

        middleRatio = this.showMiddlePanel
          ? this.normalizePanelWidthRatio(
              (baseArr[1] / (baseArr[1] + baseArr[2])) * (FULL_WIDTH_RATIO - leftRatio),
              leftRatio
            )
          : 0;
      } else {
        leftRatio = this.showLeftPanel ? baseArr[0] : 0;

        middleRatio = this.showMiddlePanel
          ? this.normalizePanelWidthRatio(baseArr[1], baseArr[0])
          : 0;
      }

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

  panelsVisibilityChanged() {
    this.visiblePanelsCount = this.getVisiblePanelsCount();
    this.cssClass = this.getCssClass();
    this.updatePanelWidthRatiosCore(PanelPosition.None);
    this.updatePanelWidths();
  }

  updateActivePanel(activePanel: PanelPosition) {
    if (activePanel !== this.activePanel) {
      this.activePanel = activePanel;
      this.trmrkActivePanelChanged.emit(activePanel);
    }
  }
}
