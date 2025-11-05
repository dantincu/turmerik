import {
  Component,
  ElementRef,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrmrkDrag } from '../../../directives/trmrk-drag';
import { TouchOrMouseCoords } from '../../../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkDragEvent } from '../../../services/common/types';
import { whenChanged } from '../../../services/common/simpleChanges';

export interface TrmrkInfiniteHeightPanelScroll {
  topPx: number;
  maxTopPx: number;
  topPxRatio: number;
}

@Component({
  selector: 'trmrk-infinite-height-panel-scroll-bar',
  imports: [TrmrkDrag, CommonModule],
  templateUrl: './trmrk-infinite-height-panel-scroll-bar.html',
  styleUrl: './trmrk-infinite-height-panel-scroll-bar.scss',
})
export class TrmrkInfiniteHeightPanelScrollBar implements OnChanges {
  @Output() trmrkScrolled = new EventEmitter<TrmrkInfiniteHeightPanelScroll>();
  @Input() trmrkThumbTopPxRatio = 0;

  ngStyle = {
    top: `0px`,
  };

  private currentTopPx = 0;
  private currentTopPxRatio = 0;

  constructor(private hostElRef: ElementRef<HTMLElement>) {}

  ngOnChanges(changes: SimpleChanges): void {
    whenChanged(
      changes,
      () => this.trmrkThumbTopPxRatio,
      () => {
        if (this.currentTopPxRatio !== this.trmrkThumbTopPxRatio) {
          this.currentTopPxRatio = this.trmrkThumbTopPxRatio;
          this.currentTopPx = Math.round(this.trmrkThumbTopPxRatio * this.getMaxTopPx());
          this.updateThumbTop(this.trmrkThumbTopPxRatio);
        }
      }
    );
  }

  thumbDragStart(event: TouchOrMouseCoords) {}

  thumbDrag(event: TrmrkDragEvent) {
    const evtArgs = this.getEvtArgs(event);
    this.updateThumbTop(evtArgs.topPx);
    this.trmrkScrolled.emit(evtArgs);
  }

  thumbDragEnd(event: TrmrkDragEvent) {
    const evtArgs = this.getEvtArgs(event);
    this.updateThumbTop(evtArgs.topPx);
    this.currentTopPx = evtArgs.topPx;
    this.currentTopPxRatio = evtArgs.topPxRatio;
    this.trmrkScrolled.emit(evtArgs);
  }

  updateThumbTop(topPx: number) {
    this.ngStyle = {
      ...this.ngStyle,
      top: `${topPx}px`,
    };
  }

  getEvtArgs(event: TrmrkDragEvent) {
    let topPx =
      event.touchOrMouseMoveCoords.screenY -
      event.touchStartOrMouseDownCoords!.screenY +
      this.currentTopPx;

    const maxTopPx = this.getMaxTopPx();
    topPx = Math.max(0, Math.min(topPx, maxTopPx));

    const topPxRatio = topPx / maxTopPx;

    return {
      topPx,
      maxTopPx,
      topPxRatio,
    } as TrmrkInfiniteHeightPanelScroll;
  }

  getMaxTopPx() {
    return (this.hostElRef.nativeElement as HTMLElement).offsetHeight - 40;
  }
}
