import {
  Directive,
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
  selector: '[trmrkLongPressOrRightClick]',
})
export class TrmrkLongPressOrRightClick implements OnDestroy {
  @Input() trmrkLongPressMillis: number = 400;
  @Input() trmrkValidMouseOrTouchMoveMaxPx: number = 40;
  @Output() trmrkLongPressOrRightClick = new EventEmitter<TouchOrMouseCoords>();
  @Output() trmrkShortPressOrLeftClick = new EventEmitter<TouchOrMouseCoords>();

  private mouseDownOrTouchStartCoords: TouchOrMouseCoords | null = null;
  private longPressTimeout: NodeJS.Timeout | null = null;

  constructor(private el: ElementRef<HTMLElement>) {
    const elem = el.nativeElement;
    this.touchStartOrMouseDown = this.touchStartOrMouseDown.bind(this);
    this.touchOrMouseMove = this.touchOrMouseMove.bind(this);
    this.touchEndOrMouseUp = this.touchEndOrMouseUp.bind(this);
    this.longPressTimeoutElapsed = this.longPressTimeoutElapsed.bind(this);
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
    this.reset();
    const data = this.getEventData(event);
    this.mouseDownOrTouchStartCoords = data.mouseOrTouchCoords;

    if (data.isValid) {
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

      if ((data.mouseOrTouchCoords!.mouseButton ?? -1) <= MouseButton.Left) {
        this.longPressTimeout = setTimeout(
          this.longPressTimeoutElapsed,
          this.trmrkLongPressMillis
        );
      }
    }
  }

  private touchOrMouseMove(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event, this.mouseDownOrTouchStartCoords);

    if (!data.isValid) {
      this.reset();
    }
  }

  private touchEndOrMouseUp(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event, this.mouseDownOrTouchStartCoords);

    if (data.isValid) {
      const mouseButton = data.mouseOrTouchCoords!.mouseButton;
      if ((mouseButton ?? -1) <= MouseButton.Left) {
        this.trmrkShortPressOrLeftClick.emit(data.mouseOrTouchCoords!);
      } else if (mouseButton === MouseButton.Right) {
        this.trmrkLongPressOrRightClick.emit(data.mouseOrTouchCoords!);
      }
    }

    this.reset();
  }

  private longPressTimeoutElapsed() {
    this.trmrkLongPressOrRightClick.emit(this.mouseDownOrTouchStartCoords!);
    this.reset();
  }

  private getEventData(
    event: TouchEvent | MouseEvent,
    mouseDownOrTouchStartCoords: TouchOrMouseCoords | null = null
  ) {
    const data: TrmrkLongPressOrRightClickEventData = {
      elem: this.el.nativeElement,
      event,
      mouseOrTouchCoords: getSingleTouchOrClick(event),
      composedPath: null,
      isValid: false,
    };

    data.isValid = !!(data.elem && data.mouseOrTouchCoords);

    if (!data.isValid) {
      const mouseButton = data.mouseOrTouchCoords!.mouseButton;

      data.isValid =
        (mouseButton ?? -1) <= MouseButton.Left ||
        mouseButton === MouseButton.Right;
    }

    if (data.isValid) {
      data.composedPath = event.composedPath();
      const target = event.target;
      data.isValid = !!(
        target && data.composedPath.indexOf(data.elem) >= MouseButton.Left
      );
    }

    if (data.isValid && mouseDownOrTouchStartCoords) {
      const diffX = Math.abs(
        data.mouseOrTouchCoords!.screenX - mouseDownOrTouchStartCoords!.screenX
      );

      const diffY = Math.abs(
        data.mouseOrTouchCoords!.screenY - mouseDownOrTouchStartCoords!.screenY
      );

      data.isValid =
        Math.max(diffX, diffY) <= this.trmrkValidMouseOrTouchMoveMaxPx;
    }

    return data;
  }

  private reset() {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout);
      this.longPressTimeout = null;
    }

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
