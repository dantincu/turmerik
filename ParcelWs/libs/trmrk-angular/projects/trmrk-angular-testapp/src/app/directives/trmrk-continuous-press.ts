import {
  Directive,
  ElementRef,
  OnDestroy,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';

import { isContainedBy } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

@Directive({
  selector: '[trmrkContinuousPress]',
})
export class TrmrkContinuousPress implements OnDestroy, AfterViewInit {
  @Output() trmrkContinuousPress = new EventEmitter<number>();
  @Output() trmrkStart = new EventEmitter<MouseEvent | TouchEvent>();
  @Output() trmrkReset = new EventEmitter<number>();

  @Output() trmrkTouchOrMouseMove = new EventEmitter<TouchEvent | MouseEvent>();

  @Input() trmrkIntervalMillis = 100;
  @Input() autoResetElapsedCount = Number.MAX_SAFE_INTEGER;

  private continuousIntervalId: NodeJS.Timeout | null = null;
  private elapsedCount = 0;

  constructor(private host: ElementRef<HTMLElement>) {
    this.hostTouchStartOrMouseDown = this.hostTouchStartOrMouseDown.bind(this);

    this.docMouseOrTouchMove = this.docMouseOrTouchMove.bind(this);
    this.docMouseUpOrTouchEnd = this.docMouseUpOrTouchEnd.bind(this);
  }

  ngAfterViewInit(): void {
    this.host.nativeElement.addEventListener(
      'touchstart',
      this.hostTouchStartOrMouseDown
    );

    this.host.nativeElement.addEventListener(
      'mousedown',
      this.hostTouchStartOrMouseDown
    );
  }

  ngOnDestroy(): void {
    document.removeEventListener('touchstart', this.hostTouchStartOrMouseDown);
    document.removeEventListener('mousedown', this.hostTouchStartOrMouseDown);
    this.reset();
  }

  hostTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.reset();
    document.addEventListener('touchmove', this.docMouseOrTouchMove, {
      capture: true,
    });
    document.addEventListener('mousemove', this.docMouseOrTouchMove, {
      capture: true,
    });
    document.addEventListener('touchend', this.docMouseUpOrTouchEnd);
    document.addEventListener('mouseup', this.docMouseUpOrTouchEnd);
    this.initContinuousInterval();
    this.trmrkStart.emit(event);
  }

  private docMouseOrTouchMove(event: MouseEvent | TouchEvent) {
    if (!isContainedBy(event, this.host.nativeElement)) {
      this.reset();
    } else {
      this.trmrkTouchOrMouseMove.emit(event);
    }
  }

  private docMouseUpOrTouchEnd(event: MouseEvent | TouchEvent) {
    this.reset();
  }

  private initContinuousInterval() {
    this.continuousIntervalId = setInterval(() => {
      this.trmrkContinuousPress.emit(++this.elapsedCount);

      if (this.elapsedCount >= this.autoResetElapsedCount) {
        this.reset();
      }
    }, this.trmrkIntervalMillis);
  }

  private reset() {
    this.trmrkReset.emit(this.elapsedCount);
    this.elapsedCount = 0;

    if (this.continuousIntervalId) {
      clearInterval(this.continuousIntervalId);
      this.continuousIntervalId = null;
    }

    document.removeEventListener('mousemove', this.docMouseOrTouchMove);
    document.removeEventListener('mouseup', this.docMouseUpOrTouchEnd);
  }
}
