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

export const MIN_PANEL_WIDTH_PX = 40;

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

  @Input() trmrkRenderLeftPanel: boolean | NullOrUndef;
  @Input() trmrkShowLeftPanel: boolean | NullOrUndef;
  @Input() trmrkLeftPanelTemplate: TemplateRef<any> | NullOrUndef;

  @Input() trmrkRenderMiddlePanel: boolean | NullOrUndef;
  @Input() trmrkShowMiddlePanel: boolean | NullOrUndef;
  @Input() trmrkMiddlePanelTemplate: TemplateRef<any> | NullOrUndef;

  @Input() trmrkRenderRightPanel: boolean | NullOrUndef;
  @Input() trmrkShowRightPanel: boolean | NullOrUndef;
  @Input() trmrkRightPanelTemplate: TemplateRef<any> | NullOrUndef;

  readonly renderPanelsByDefault = true;

  cssClass: string[] = [Trmrk3PanelsLayout.dfCssClass];
  hasLeftPanel = false;
  hasMiddlePanel = false;
  hasRightPanel = false;
  visiblePanelsCount = 0;

  drag_pan: SafeHtml;
  panelBaseWidthRatios = Trmrk3PanelsLayout.dfPanelWidthRatios;
  panelWidthRatios = Trmrk3PanelsLayout.dfPanelWidthRatios;
  panelStyles!: { [key: string]: string }[];

  @ViewChild('containerEl') containerEl!: ElementRef<any>;
  @ViewChild('leftPanelEl') leftPanelEl!: ElementRef<any>;
  @ViewChild('rightPanelEl') rightPanelEl!: ElementRef<any>;

  private dragStartTouchOrMoveCoords: TouchOrMouseCoords | null = null;
  private containerWidth: number | null = null;
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
      () => this.trmrkRenderLeftPanel,
      () => {
        this.hasLeftPanel = this.shouldShowPanel(
          this.trmrkRenderLeftPanel,
          this.trmrkShowLeftPanel
        );

        this.visiblePanelsCount = this.getVisiblePanelsCount();
        this.cssClass = this.getCssClass();
        this.updatePanelWidths();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowLeftPanel,
      () => {
        this.hasLeftPanel = this.shouldShowPanel(
          this.trmrkRenderLeftPanel,
          this.trmrkShowLeftPanel
        );

        this.visiblePanelsCount = this.getVisiblePanelsCount();
        this.cssClass = this.getCssClass();
        this.updatePanelWidths();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkRenderMiddlePanel,
      () => {
        this.hasMiddlePanel = this.shouldShowPanel(
          this.trmrkRenderMiddlePanel,
          this.trmrkShowMiddlePanel
        );

        this.visiblePanelsCount = this.getVisiblePanelsCount();
        this.cssClass = this.getCssClass();
        this.updatePanelWidths();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowMiddlePanel,
      () => {
        this.hasRightPanel = this.shouldShowPanel(
          this.trmrkRenderRightPanel,
          this.trmrkShowRightPanel
        );

        this.visiblePanelsCount = this.getVisiblePanelsCount();
        this.cssClass = this.getCssClass();
        this.updatePanelWidths();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkRenderRightPanel,
      () => {
        this.hasRightPanel = this.shouldShowPanel(
          this.trmrkRenderRightPanel,
          this.trmrkShowRightPanel
        );

        this.visiblePanelsCount = this.getVisiblePanelsCount();
        this.cssClass = this.getCssClass();
        this.updatePanelWidths();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkShowRightPanel,
      () => {
        this.hasRightPanel = this.shouldShowPanel(
          this.trmrkRenderRightPanel,
          this.trmrkShowRightPanel
        );

        this.visiblePanelsCount = this.getVisiblePanelsCount();
        this.cssClass = this.getCssClass();
        this.updatePanelWidths();
      }
    );

    whenChanged(
      changes,
      () => this.trmrkDbObjectPfx,
      () => {}
    );
  }

  leftPanelResizeBtnDragStart(event: TouchOrMouseCoords) {
    this.dragStartTouchOrMoveCoords = event;
    this.containerWidth = (this.containerEl.nativeElement as HTMLElement).offsetWidth;
    this.leftPanelWidth = (this.leftPanelEl.nativeElement as HTMLElement).offsetWidth;
  }

  leftPanelResizeBtnDrag(event: TrmrkDragEvent) {
    const dx = event.touchOrMouseMoveCoords.clientX - this.dragStartTouchOrMoveCoords!.clientX;
    const leftPanelNewWidth = Math.max(this.leftPanelWidth! + dx, MIN_PANEL_WIDTH_PX);
    const leftPanelNewWidthRatio = (leftPanelNewWidth / this.containerWidth!) * 100;

    const middlePanelNewWidthRatio =
      (100 - leftPanelNewWidthRatio) *
      (this.panelWidthRatios[1] / (this.panelWidthRatios[1] + this.panelWidthRatios[2]));

    const rightPanelNewWidthRatio = 100 - leftPanelNewWidthRatio - middlePanelNewWidthRatio;

    this.panelBaseWidthRatios = [
      leftPanelNewWidthRatio,
      middlePanelNewWidthRatio,
      rightPanelNewWidthRatio,
    ];

    this.updatePanelWidths();
  }

  leftPanelResizeBtnDragEnd(event: TrmrkDragEvent) {
    this.dragStartTouchOrMoveCoords = null;
    this.containerWidth = null;
    this.leftPanelWidth = null;
  }

  rightPanelResizeBtnDragStart(event: TouchOrMouseCoords) {
    this.dragStartTouchOrMoveCoords = event;
    this.containerWidth = (this.containerEl.nativeElement as HTMLElement).offsetWidth;
    this.rightPanelWidth = (this.rightPanelEl.nativeElement as HTMLElement).offsetWidth;
  }

  rightPanelResizeBtnDrag(event: TrmrkDragEvent) {
    const dx = event.touchOrMouseMoveCoords.clientX - this.dragStartTouchOrMoveCoords!.clientX;
    const rightPanelNewWidth = Math.max(this.rightPanelWidth! - dx, MIN_PANEL_WIDTH_PX);
    const rightPanelNewWidthRatio = (rightPanelNewWidth / this.containerWidth!) * 100;
    const middlePanelNewWidthRatio = 100 - this.panelBaseWidthRatios[0] - rightPanelNewWidthRatio;

    this.panelBaseWidthRatios = [
      this.panelBaseWidthRatios[0],
      middlePanelNewWidthRatio,
      rightPanelNewWidthRatio,
    ];

    this.updatePanelWidths();
  }

  rightPanelResizeBtnDragEnd(event: TrmrkDragEvent) {
    this.dragStartTouchOrMoveCoords = null;
    this.containerWidth = null;
    this.rightPanelWidth = null;
  }

  shouldShowPanel(renderPanel: boolean | NullOrUndef, showPanel: boolean | NullOrUndef) {
    const shouldShowPanel = (renderPanel ?? this.renderPanelsByDefault) && (showPanel ?? false);
    return shouldShowPanel;
  }

  getCssClass() {
    const cssClass = [Trmrk3PanelsLayout.dfCssClass, ...this.trmrkCssClass];

    if (this.hasLeftPanel) {
      cssClass.push('trmrk-has-left-panel');
    }

    if (this.hasMiddlePanel) {
      cssClass.push('trmrk-has-middle-panel');
    }

    if (this.hasRightPanel) {
      cssClass.push('trmrk-has-right-panel');
    }

    cssClass.push(`trmrk-has-${this.visiblePanelsCount}-panels`);
    return cssClass;
  }

  getVisiblePanelsCount() {
    let visiblePanelsCount = 0;

    if (this.hasLeftPanel) {
      visiblePanelsCount++;
    }

    if (this.hasMiddlePanel) {
      visiblePanelsCount++;
    }

    if (this.hasRightPanel) {
      visiblePanelsCount++;
    }

    return visiblePanelsCount;
  }

  updatePanelWidths() {
    if (this.hasLeftPanel) {
      if (this.hasMiddlePanel) {
        if (this.hasRightPanel) {
          this.panelWidthRatios = [...this.panelBaseWidthRatios];
        } else {
          this.panelWidthRatios = [
            this.panelBaseWidthRatios[0],
            100 - this.panelBaseWidthRatios[0],
            0,
          ];
        }
      } else if (this.hasRightPanel) {
        this.panelWidthRatios = [
          this.panelBaseWidthRatios[0],
          0,
          100 - this.panelBaseWidthRatios[0],
        ];
      } else {
        this.panelWidthRatios = [100, 0, 0];
      }
    } else if (this.hasMiddlePanel) {
      if (this.hasRightPanel) {
        const middlePanelWidthRatio =
          (this.panelBaseWidthRatios[1] /
            (this.panelBaseWidthRatios[1] + this.panelBaseWidthRatios[2])) *
          100;

        this.panelWidthRatios = [0, middlePanelWidthRatio, 100 - middlePanelWidthRatio];
      } else {
        this.panelWidthRatios = [0, 100, 0];
      }
    } else if (this.hasRightPanel) {
      this.panelWidthRatios = [0, 0, 100];
    } else {
      this.panelWidthRatios = [0, 0, 0];
    }

    this.panelStyles = this.panelWidthRatios.map((ratio) => ({
      width: `${ratio}%`,
      maxWidth: `${ratio}%`,
    }));
  }
}
