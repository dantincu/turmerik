import {
  Directive,
  ElementRef,
  OnDestroy,
  HostListener,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

export interface TrmrkContinuousPressTouchOrMouseMoveEvent {
  event: TouchEvent | MouseEvent;
  composedPath: EventTarget[];
}

@Directive({
  selector: '[trmrkContinuousPress]',
})
export class TrmrkContinuousPress implements OnDestroy {
  @Output() trmrkContinuousPress = new EventEmitter<number>();
  @Output() trmrkStart = new EventEmitter<MouseEvent | TouchEvent>();
  @Output() trmrkReset = new EventEmitter<number>();

  @Output() trmrkTouchOrMouseMove =
    new EventEmitter<TrmrkContinuousPressTouchOrMouseMoveEvent>();

  @Input() trmrkIntervalMillis = 100;
  @Input() autoResetElapsedCount = Number.MAX_SAFE_INTEGER;

  private continuousIntervalId: NodeJS.Timeout | null = null;
  private elapsedCount = 0;

  constructor(private host: ElementRef<HTMLElement>) {
    this.docMouseOrTouchMove = this.docMouseOrTouchMove.bind(this);
    this.docMouseUpOrTouchEnd = this.docMouseUpOrTouchEnd.bind(this);
  }

  ngOnDestroy(): void {
    this.reset();
  }

  @HostListener('mousedown', ['$event']) hostMouseDown(event: MouseEvent) {
    this.reset();
    document.addEventListener('mousemove', this.docMouseOrTouchMove);
    document.addEventListener('mouseup', this.docMouseUpOrTouchEnd);
    this.initContinuousInterval();
    this.trmrkStart.emit(event);
  }

  @HostListener('touchstart', ['$event']) hostTouchStart(event: TouchEvent) {
    this.reset();
    document.addEventListener('touchmove', this.docMouseOrTouchMove);
    document.addEventListener('touchend', this.docMouseUpOrTouchEnd);
    this.initContinuousInterval();
    this.trmrkStart.emit(event);
  }

  private docMouseOrTouchMove(event: MouseEvent | TouchEvent) {
    const composedPath = event.composedPath();

    if (composedPath.indexOf(this.host.nativeElement) < 0) {
      this.reset();
    } else {
      this.trmrkTouchOrMouseMove.emit({
        event,
        composedPath,
      });
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
