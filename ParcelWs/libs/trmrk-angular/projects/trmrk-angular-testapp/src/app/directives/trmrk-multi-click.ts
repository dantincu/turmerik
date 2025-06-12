import {
  Directive,
  HostListener,
  EventEmitter,
  Output,
  Input,
  OnDestroy,
  ElementRef,
} from '@angular/core';

import {
  MouseButton,
  TouchOrMouseCoords,
  getSingleTouchOrClick,
} from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkLongPressOrRightClickEventData } from './interfaces';

@Directive({
  selector: '[trmrkMultiClick]',
})
export class TrmrkMultiClick implements OnDestroy {
  private clicksCount = 0;
  private lastClickMillis = 0;

  @Output() trmrkMultiClick = new EventEmitter<TouchOrMouseCoords>();
  @Input() trmrkMultiClickMillis = 200;
  @Input() trmrkMultiClicksCount = 5;

  constructor(private el: ElementRef<HTMLElement>) {
    const elem = el.nativeElement;
    this.touchStartOrMouseDown = this.touchStartOrMouseDown.bind(this);
    this.touchOrMouseMove = this.touchOrMouseMove.bind(this);
    this.touchEndOrMouseUp = this.touchEndOrMouseUp.bind(this);
    elem.addEventListener('mousedown', this.touchStartOrMouseDown);
    elem.addEventListener('touchstart', this.touchStartOrMouseDown);
  }

  ngOnDestroy(): void {
    const elem = this.el.nativeElement;

    if (elem) {
      elem.removeEventListener('mousedown', this.touchStartOrMouseDown);
      elem.removeEventListener('touchstart', this.touchStartOrMouseDown);
    }

    this.reset();
  }

  private touchStartOrMouseDown(event: TouchEvent | MouseEvent) {
    this.removeEventListeners();
    const data = this.getEventData(event);

    if (data.isValid) {
      if (this.lastClickMillis > 0) {
        const now = new Date();
        const millis = now.getTime();

        if (millis - this.lastClickMillis > this.trmrkMultiClickMillis) {
          this.resetState();
        }
      }

      document.addEventListener('mousemove', this.touchOrMouseMove, {
        capture: true,
      });

      document.addEventListener('touchmove', this.touchOrMouseMove, {
        capture: true,
      });

      document.addEventListener('mouseup', this.touchEndOrMouseUp, {
        capture: true,
      });

      document.addEventListener('touchend', this.touchEndOrMouseUp, {
        capture: true,
      });
    } else {
      this.resetState();
    }
  }

  private touchOrMouseMove(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event);

    if (!data.isValid) {
      this.reset();
    }
  }

  private touchEndOrMouseUp(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event);

    if (data.isValid) {
      this.clicksCount++;

      if (this.clicksCount >= this.trmrkMultiClicksCount) {
        this.resetState();
        this.trmrkMultiClick.emit(data.mouseOrTouchCoords!);
      }

      this.removeEventListeners();
    } else {
      this.reset();
    }
  }

  private getEventData(event: TouchEvent | MouseEvent) {
    const data: TrmrkLongPressOrRightClickEventData = {
      elem: this.el.nativeElement,
      event,
      mouseOrTouchCoords: getSingleTouchOrClick(event, null, false),
      composedPath: null,
      isValid: false,
    };

    data.isValid = !!(data.elem && data.mouseOrTouchCoords);

    if (data.isValid) {
      const mouseButton = data.mouseOrTouchCoords!.mouseButton;
      data.isValid = (mouseButton ?? -1) <= MouseButton.Left;
    }

    if (data.isValid) {
      data.composedPath = event.composedPath();
      const target = event.target;
      data.isValid = !!(target && data.composedPath.indexOf(data.elem) >= 0);
    }

    return data;
  }

  private reset() {
    this.resetState();
    this.removeEventListeners();
  }

  private resetState() {
    this.lastClickMillis = 0;
    this.clicksCount = 0;
  }

  private removeEventListeners() {
    document.removeEventListener('mousemove', this.touchOrMouseMove, {
      capture: true,
    });

    document.removeEventListener('touchmove', this.touchOrMouseMove, {
      capture: true,
    });

    document.removeEventListener('mouseup', this.touchEndOrMouseUp, {
      capture: true,
    });

    document.removeEventListener('touchend', this.touchEndOrMouseUp, {
      capture: true,
    });
  }
}
