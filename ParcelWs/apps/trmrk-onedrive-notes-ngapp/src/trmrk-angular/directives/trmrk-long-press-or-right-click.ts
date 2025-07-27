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
  isAnyContainedBy,
} from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkLongPressOrRightClickEventData } from '../services/types';

@Directive({
  selector: '[trmrkLongPressOrRightClick]',
})
export class TrmrkLongPressOrRightClick implements OnDestroy {
  @Input() trmrkLongPressMillis: number = 400;
  @Input() trmrkValidMouseOrTouchMoveMaxPx: number = 40;
  @Input() trmrkLongPressPreventDefault = true;
  @Input() trmrkAltHostElems: (() => HTMLElement[]) | null = null;
  @Output() trmrkLongPressOrRightClick = new EventEmitter<TouchOrMouseCoords>();
  @Output() trmrkShortPressOrLeftClick = new EventEmitter<TouchOrMouseCoords>();

  private mouseDownOrTouchStartCoords: TouchOrMouseCoords | null = null;
  private longPressTimeout: NodeJS.Timeout | null = null;

  constructor(private el: ElementRef<HTMLElement>) {
    const elem = el.nativeElement;
    this.contextMenu = this.contextMenu.bind(this);
    this.touchStartOrMouseDown = this.touchStartOrMouseDown.bind(this);
    this.touchOrMouseMove = this.touchOrMouseMove.bind(this);
    this.touchEndOrMouseUp = this.touchEndOrMouseUp.bind(this);
    this.longPressTimeoutElapsed = this.longPressTimeoutElapsed.bind(this);
    elem.addEventListener('contextmenu', this.contextMenu);
    elem.addEventListener('mousedown', this.touchStartOrMouseDown);
    elem.addEventListener('touchstart', this.touchStartOrMouseDown);
  }

  ngOnDestroy(): void {
    const elem = this.el.nativeElement;

    if (elem) {
      elem.removeEventListener('contextmenu', this.contextMenu);
      elem.removeEventListener('mousedown', this.touchStartOrMouseDown);
      elem.removeEventListener('touchstart', this.touchStartOrMouseDown);
    }

    this.reset();
  }

  private touchStartOrMouseDown(event: TouchEvent | MouseEvent) {
    this.reset();
    const data = this.getEventData(event);

    if (data.isValid) {
      this.mouseDownOrTouchStartCoords = {
        ...data.mouseOrTouchCoords!,
        evt: null,
      };

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

  private contextMenu(event: MouseEvent) {
    if (this.trmrkLongPressPreventDefault) {
      event.preventDefault();
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
      mouseOrTouchCoords: getSingleTouchOrClick(event, null, false),
      composedPath: null,
      isValid: false,
    };

    data.isValid = !!(data.elem && data.mouseOrTouchCoords);

    if (data.isValid) {
      const mouseButton = data.mouseOrTouchCoords!.mouseButton;

      data.isValid =
        (mouseButton ?? -1) <= MouseButton.Left ||
        mouseButton === MouseButton.Right;
    }

    if (data.isValid) {
      data.isValid = isAnyContainedBy({
        event: data.mouseOrTouchCoords!,
        parent: [...(this.trmrkAltHostElems?.call(this) ?? []), data.elem],
      });
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
