import { Component, Input, OnChanges, SimpleChanges, TemplateRef } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NullOrUndef } from '../../../../trmrk/core';

import { whenChanged } from '../../../services/common/simpleChanges';
import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';
import { drag_pan } from '../../../assets/icons/material/drag_pan';

@Component({
  selector: 'trmrk-3-panels-layout',
  imports: [CommonModule, MatButtonModule, MatIconModule, TrmrkHorizStrip],
  templateUrl: './trmrk-3-panels-layout.html',
  styleUrl: './trmrk-3-panels-layout.scss',
})
export class Trmrk3PanelsLayout implements OnChanges {
  static dfCssClass = 'trmrk-3-panels-layout';

  @Input() trmrkCssClass: string[] = [];

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

  constructor(private domSanitizer: DomSanitizer) {
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
      }
    );
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
}
