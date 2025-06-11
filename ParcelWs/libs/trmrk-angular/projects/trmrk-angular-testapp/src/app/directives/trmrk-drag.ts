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

import {
  TrmrkLongPressOrRightClickEventData,
  TrmrkDragEvent,
  TrmrkDragEventData,
  TrmrkDragStartPosition,
} from './interfaces';

@Directive({
  selector: '[trmrkDrag]',
})
export class TrmrkDrag implements OnDestroy {
  @Output() trmrkDrag = new EventEmitter<TrmrkDragEvent>();
  @Output() trmrkDragStart = new EventEmitter<TouchOrMouseCoords>();
  @Output() trmrkDragEnd = new EventEmitter<TrmrkDragEvent>();

  private mouseDownOrTouchStartCoords: TouchOrMouseCoords | null = null;
  private dragStartPosition: TrmrkDragStartPosition | null = null;

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
    this.reset();
    const data = this.getEventData(event);

    if (data.isValid) {
      this.mouseDownOrTouchStartCoords = data.mouseOrTouchCoords;
      this.dragStartPosition = data.dragStartPosition;

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

      this.trmrkDragStart.emit(data.mouseOrTouchCoords!);
    }
  }

  private touchOrMouseMove(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event);

    if (!data.isValid) {
      this.reset();
    } else {
      this.trmrkDrag.emit(this.getTrmrkDragEvent(data));
    }
  }

  private touchEndOrMouseUp(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event);

    this.trmrkDragEnd.emit(this.getTrmrkDragEvent(data));

    this.reset();
  }

  private getEventData(event: TouchEvent | MouseEvent) {
    const elem = this.el.nativeElement;

    const data: TrmrkDragEventData = {
      elem,
      event,
      mouseOrTouchCoords: getSingleTouchOrClick(event),
      composedPath: null,
      isValid: false,
      dragStartPosition: {
        clientTop: elem.clientTop,
        clientLeft: elem.clientLeft,
        offsetTop: elem.offsetTop,
        offsetLeft: elem.offsetLeft,
      },
    };

    data.isValid = !!(data.elem && data.mouseOrTouchCoords);

    if (data.isValid) {
      const mouseButton = data.mouseOrTouchCoords!.mouseButton;
      data.isValid = (mouseButton ?? -1) <= MouseButton.Left;
    }

    return data;
  }

  private getTrmrkDragEvent(data: TrmrkLongPressOrRightClickEventData) {
    const event: TrmrkDragEvent = {
      touchStartOrMouseDownCoords: this.mouseDownOrTouchStartCoords!,
      touchOrMouseMoveCoords: data.mouseOrTouchCoords!,
      dragStartPosition: this.dragStartPosition!,
    };

    return event;
  }

  private reset() {
    this.mouseDownOrTouchStartCoords = null;
    this.dragStartPosition = null;

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
