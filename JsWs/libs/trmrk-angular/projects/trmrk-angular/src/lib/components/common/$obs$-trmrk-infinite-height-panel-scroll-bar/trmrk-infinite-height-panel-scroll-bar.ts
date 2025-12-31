import { Component, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrmrkDrag } from '../../../directives/trmrk-drag';

import {
  TrmrkInfiniteHeightPanelScrollService,
  TrmrkInfiniteHeightPanelScrollEvent,
  TrmrkInfiniteHeightPanelNewContentRequestedEvent,
} from '../../../services/common/$obs$-trmrk-infinite-height-panel-scroll-service';

@Component({
  selector: 'trmrk-infinite-height-panel-scroll-bar',
  imports: [TrmrkDrag, CommonModule],
  templateUrl: './trmrk-infinite-height-panel-scroll-bar.html',
  styleUrl: './trmrk-infinite-height-panel-scroll-bar.scss',
})
export class TrmrkInfiniteHeightPanelScrollBar {
  @Output() trmrkScrolled = new EventEmitter<TrmrkInfiniteHeightPanelScrollEvent>();

  @Output() trmrkNewContentRequested =
    new EventEmitter<TrmrkInfiniteHeightPanelNewContentRequestedEvent>();

  constructor(
    public service: TrmrkInfiniteHeightPanelScrollService,
    private hostElRef: ElementRef<HTMLElement>
  ) {
    setTimeout(() => {
      service.setupScrollBar({
        hostEl: () => hostElRef.nativeElement,
        scrolledEvent: () => this.trmrkScrolled,
        newContentRequestedEvent: () => this.trmrkNewContentRequested,
      });
    });
  }
}
