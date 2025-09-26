import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NullOrUndef } from '../../../../trmrk/core';
import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

import { AppServiceBase } from '../../../services/common/app-service-base';
import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkDrag } from '../../../directives/trmrk-drag';
import { TrmrkDragEvent } from '../../../services/common/types';
import { drag_pan } from '../../../assets/icons/material/drag_pan';

export const MIN_PANEL_WIDTH_PX = 45;

@Component({
  selector: 'trmrk-3-panels-layout',
  imports: [
    CommonModule,
    NgTemplateOutlet,
    MatButtonModule,
    MatIconModule,
    TrmrkHorizStrip,
    TrmrkDrag,
  ],
  templateUrl: './trmrk-3-panels-layout.html',
  styleUrl: './trmrk-3-panels-layout.scss',
})
export class Trmrk3PanelsLayout implements OnChanges {
  static dfCssClass = 'trmrk-3-panels-layout';
  static dfPanelWidthRatios = [33.333, 33.333, 33.333];

  @Input() trmrkCssClass: string[] = [];
  @Input() trmrkDbObjectPfx: string = '';

  @Input() trmrkAlwaysRenderLeftPanel: boolean = false;
  @Input() trmrkShowLeftPanel: boolean = false;
  @Input() trmrkLeftPanelTemplate: TemplateRef<any> | NullOrUndef;

  @Input() trmrkAlwaysRenderMiddlePanel: boolean = false;
  @Input() trmrkShowMiddlePanel: boolean = false;
  @Input() trmrkMiddlePanelTemplate: TemplateRef<any> | NullOrUndef;

  @Input() trmrkAlwaysRenderRightPanel: boolean = false;
  @Input() trmrkShowRightPanel: boolean = false;
  @Input() trmrkRightPanelTemplate: TemplateRef<any> | NullOrUndef;

  cssClass: string[] = [Trmrk3PanelsLayout.dfCssClass];
  showLeftPanel = false;
  showMiddlePanel = false;
  showRightPanel = false;
  visiblePanelsCount = 0;

  drag_pan: SafeHtml;
  panelBaseWidthRatios = Trmrk3PanelsLayout.dfPanelWidthRatios;
  panelWidthRatios = Trmrk3PanelsLayout.dfPanelWidthRatios;
  panelStyles!: { [key: string]: string }[];

  @ViewChild('containerEl') containerEl!: ElementRef<any>;
  @ViewChild('leftPanelEl') leftPanelEl!: ElementRef<any>;
  @ViewChild('rightPanelEl') rightPanelEl!: ElementRef<any>;

  isResizingLeftPanel = false;
  isResizingRightPanel = false;

  private dragStartTouchOrMoveCoords: TouchOrMouseCoords | null = null;
  private containerWidth: number | null = null;
  private panelMinWidthRatio: number | null = null;
  private leftPanelWidth: number | null = null;
  private rightPanelWidth: number | null = null;

  constructor(private appService: AppServiceBase, private domSanitizer: DomSanitizer) {
    this.updatePanelWidths();
    this.drag_pan = domSanitizer.bypassSecurityTrustHtml(drag_pan);
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

  leftPanelResizeBtnDragStart(event: TouchOrMouseCoords) {
    this.isResizingLeftPanel = true;
    this.dragStartTouchOrMoveCoords = event;
    this.containerWidth = (this.containerEl.nativeElement as HTMLElement).offsetWidth;
    this.panelMinWidthRatio = (MIN_PANEL_WIDTH_PX / this.containerWidth) * 100;
    this.leftPanelWidth = (this.leftPanelEl.nativeElement as HTMLElement).offsetWidth;
  }

  leftPanelResizeBtnDrag(event: TrmrkDragEvent) {
    const dx = event.touchOrMouseMoveCoords.clientX - this.dragStartTouchOrMoveCoords!.clientX;
    const leftPanelNewWidth = this.leftPanelWidth! + dx;
    const leftPanelNewWidthRatio = (leftPanelNewWidth / this.containerWidth!) * 100;

    const leftPanelNormNewWidthRatio = Math.min(
      Math.max(leftPanelNewWidthRatio, this.panelMinWidthRatio!),
      100 - 2 * this.panelMinWidthRatio!
    );

    const middlePanelNewWidthRatio =
      (100 - leftPanelNormNewWidthRatio) *
      (this.panelWidthRatios[1] / (this.panelWidthRatios[1] + this.panelWidthRatios[2]));

    const middlePanelNormNewWidthRatio = Math.min(
      Math.max(middlePanelNewWidthRatio, this.panelMinWidthRatio!),
      100 - this.panelMinWidthRatio! - leftPanelNormNewWidthRatio
    );

    const rightPanelNewWidthRatio = 100 - leftPanelNormNewWidthRatio - middlePanelNormNewWidthRatio;

    this.panelBaseWidthRatios = [
      leftPanelNormNewWidthRatio,
      middlePanelNormNewWidthRatio,
      rightPanelNewWidthRatio,
    ];

    this.updatePanelWidths();
  }

  leftPanelResizeBtnDragEnd(event: TrmrkDragEvent) {
    this.isResizingLeftPanel = false;
    this.dragStartTouchOrMoveCoords = null;
    this.containerWidth = null;
    this.panelMinWidthRatio = null;
    this.leftPanelWidth = null;
  }

  rightPanelResizeBtnDragStart(event: TouchOrMouseCoords) {
    this.isResizingRightPanel = true;
    this.dragStartTouchOrMoveCoords = event;
    this.containerWidth = (this.containerEl.nativeElement as HTMLElement).offsetWidth;
    this.panelMinWidthRatio = (MIN_PANEL_WIDTH_PX / this.containerWidth) * 100;
    this.rightPanelWidth = (this.rightPanelEl.nativeElement as HTMLElement).offsetWidth;
  }

  rightPanelResizeBtnDrag(event: TrmrkDragEvent) {
    const dx = event.touchOrMouseMoveCoords.clientX - this.dragStartTouchOrMoveCoords!.clientX;
    const rightPanelNewWidth = this.rightPanelWidth! - dx;
    const rightPanelNewWidthRatio = (rightPanelNewWidth / this.containerWidth!) * 100;

    const rightPanelNormNewWidthRatio = Math.min(
      Math.max(rightPanelNewWidthRatio, this.panelMinWidthRatio!),
      100 - this.panelBaseWidthRatios[0] - this.panelMinWidthRatio!
    );

    const middlePanelNewWidthRatio =
      100 - this.panelBaseWidthRatios[0] - rightPanelNormNewWidthRatio;

    this.panelBaseWidthRatios = [
      this.panelBaseWidthRatios[0],
      middlePanelNewWidthRatio,
      rightPanelNormNewWidthRatio,
    ];

    this.updatePanelWidths();
  }

  rightPanelResizeBtnDragEnd(event: TrmrkDragEvent) {
    this.isResizingRightPanel = false;
    this.dragStartTouchOrMoveCoords = null;
    this.containerWidth = null;
    this.panelMinWidthRatio = null;
    this.rightPanelWidth = null;
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

  updatePanelWidths() {
    if (this.showLeftPanel) {
      if (this.showMiddlePanel) {
        if (this.showRightPanel) {
          this.panelWidthRatios = [...this.panelBaseWidthRatios];
        } else {
          this.panelWidthRatios = [
            this.panelBaseWidthRatios[0],
            100 - this.panelBaseWidthRatios[0],
            0,
          ];
        }
      } else if (this.showRightPanel) {
        this.panelWidthRatios = [
          this.panelBaseWidthRatios[0],
          0,
          100 - this.panelBaseWidthRatios[0],
        ];
      } else {
        this.panelWidthRatios = [100, 0, 0];
      }
    } else if (this.showMiddlePanel) {
      if (this.showRightPanel) {
        const middlePanelWidthRatio =
          (this.panelBaseWidthRatios[1] /
            (this.panelBaseWidthRatios[1] + this.panelBaseWidthRatios[2])) *
          100;

        this.panelWidthRatios = [0, middlePanelWidthRatio, 100 - middlePanelWidthRatio];
      } else {
        this.panelWidthRatios = [0, 100, 0];
      }
    } else if (this.showRightPanel) {
      this.panelWidthRatios = [0, 0, 100];
    } else {
      this.panelWidthRatios = [0, 0, 0];
    }

    this.panelStyles = this.panelWidthRatios.map((ratio) => ({
      width: `${ratio}%`,
      maxWidth: `${ratio}%`,
    }));
  }

  panelsVisibilityChanged() {
    this.visiblePanelsCount = this.getVisiblePanelsCount();
    this.cssClass = this.getCssClass();
    this.updatePanelWidths();
  }
}
