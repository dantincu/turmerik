import { Injectable, Output, EventEmitter, OnDestroy, Input } from '@angular/core';

import {
  MouseButton,
  TouchOrMouseCoords,
  getSingleTouchOrClick,
} from '../../../trmrk-browser/domUtils/touchAndMouseEvents';

import {
  TrmrkDragEvent,
  TrmrkDragEventData,
  TrmrkDragStartPosition,
  TrmrkLongPressOrRightClickEventData,
} from './types';

@Injectable()
export class DragService implements OnDestroy {
  @Output() drag = new EventEmitter<TrmrkDragEvent>();
  @Output() dragEnd = new EventEmitter<TrmrkDragEvent>();
  @Input() preventDefaults = false;

  private mouseDownOrTouchStartCoords: TouchOrMouseCoords | null = null;
  private dragStartPosition: TrmrkDragStartPosition | null = null;
  private hostEl: HTMLElement | null = null;

  constructor() {
    this.touchOrMouseMove = this.touchOrMouseMove.bind(this);
    this.touchEndOrMouseUp = this.touchEndOrMouseUp.bind(this);
  }

  ngOnDestroy(): void {
    this.reset();
    this.hostEl = null;
  }

  public init(hostEl: HTMLElement | null = null) {
    this.hostEl = hostEl;
  }

  public onTouchStartOrMouseDown(event: MouseEvent | TouchEvent) {
    this.reset();
    const data = this.getEventData(event);

    if (data.isValid) {
      this.mouseDownOrTouchStartCoords = {
        ...data.mouseOrTouchCoords!,
        evt: null,
      };

      this.dragStartPosition = data.dragStartPosition;

      document.addEventListener('mousemove', this.touchOrMouseMove, {
        capture: true,
        passive: false,
      });

      document.addEventListener('touchmove', this.touchOrMouseMove, {
        capture: true,
        passive: false,
      });

      document.addEventListener('mouseup', this.touchEndOrMouseUp, {
        capture: true,
      });

      document.addEventListener('touchend', this.touchEndOrMouseUp, {
        capture: true,
      });
    }

    const mouseOrTouchCoords = data.isValid ? data.mouseOrTouchCoords : null;
    return mouseOrTouchCoords;
  }

  public [Symbol.dispose]() {
    this.Dispose();
  }

  public Dispose() {
    this.reset();
  }

  private touchOrMouseMove(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event);

    if (!data.isValid) {
      this.reset();
    } else {
      this.drag.emit(this.getTrmrkDragEvent(data));
    }
  }

  private touchEndOrMouseUp(event: TouchEvent | MouseEvent) {
    const data = this.getEventData(event);
    this.dragEnd.emit(this.getTrmrkDragEvent(data));

    this.reset();
  }

  private getEventData(event: TouchEvent | MouseEvent) {
    this.preventDefaultsIfReq(event);
    const elem = this.hostEl;

    const data: TrmrkDragEventData = {
      elem: elem!,
      event,
      mouseOrTouchCoords: getSingleTouchOrClick(event, MouseButton.Left, false),
      composedPath: null,
      isValid: false,
      dragStartPosition: elem
        ? {
            clientTop: elem.clientTop,
            clientLeft: elem.clientLeft,
            offsetTop: elem.offsetTop,
            offsetLeft: elem.offsetLeft,
          }
        : null,
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
      dragStartPosition: this.dragStartPosition,
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

  private preventDefaultsIfReq(event: Event) {
    if (this.preventDefaults) {
      event.preventDefault();
    }
  }
}
