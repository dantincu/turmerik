import { NullOrUndef, actWithValIf, MtblRefValue } from "@/src/trmrk/core";
import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";
import { clearIntervalIfReq, clearTimeoutIfReq } from "@/src/trmrk/timeout";

import { MouseButton } from "./touchAndMouseEvents";
import { LongPressOrRightClickEventData } from "./LongPressService";

export interface PointerDragServiceInitArgs {
  hostElem: HTMLElement;
  drag?: ((event: PointerDragEvent) => void) | NullOrUndef;
  dragStart?: ((event: PointerEvent) => void) | NullOrUndef;
  dragEnd?: ((event: PointerDragEvent) => void) | NullOrUndef;
}

export interface PointerDragEvent {
  pointerDownEvent: PointerEvent;
  event: PointerEvent;
}

export interface DragStartPosition {
  clientTop: number;
  clientLeft: number;
  offsetTop: number;
  offsetLeft: number;
}

export interface DragEventData extends LongPressOrRightClickEventData {
  dragStartPosition: DragStartPosition | null;
}

export class PointerDragService extends TrmrkDisposableBase {
  private args: PointerDragServiceInitArgs | null = null;
  private pointerDownEvent: PointerEvent | null = null;

  constructor() {
    super();

    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.pointerMove = this.pointerMove.bind(this);
  }

  disposeCore(): void {
    const elem = this.args?.hostElem;

    if (elem) {
      elem.removeEventListener("pointerdown", this.pointerDown);
    }

    this.reset();
    this.args = null;
  }

  pointerDown(event: PointerEvent) {
    this.reset();
    const data = this.getEventData(event);

    if (data.isValid) {
      this.pointerDownEvent = data.event as PointerEvent;

      document.addEventListener("pointermove", this.pointerMove, {
        capture: true,
        passive: false,
      });

      document.addEventListener("pointerup", this.pointerUp, {
        capture: true,
      });
    }

    actWithValIf(this.args!.dragStart, (f) => f(event));
    return event;
  }

  pointerMove(event: PointerEvent) {
    const data = this.getEventData(event);

    if (!data.isValid) {
      this.reset();
    } else {
      actWithValIf(this.args!.drag, (f) => f(this.getDragEvent(data)));
    }
  }

  pointerUp(event: PointerEvent) {
    const data = this.getEventData(event);
    actWithValIf(this.args!.dragEnd, (f) => f(this.getDragEvent(data)));
    this.reset();
  }

  init(args: PointerDragServiceInitArgs) {
    this.args = {
      ...args,
    };

    const elem = args.hostElem;
    elem.addEventListener("pointerdown", this.pointerDown);
  }

  private getDragEvent(data: LongPressOrRightClickEventData) {
    const event: PointerDragEvent = {
      pointerDownEvent: this.pointerDownEvent!,
      event: data.event as PointerEvent,
    };

    return event;
  }

  private getEventData(event: PointerEvent) {
    event.preventDefault();
    const elem = this.args!.hostElem;

    const data: DragEventData = {
      elem: elem!,
      event,
      composedPath: null,
      isValid: event.button === MouseButton.Left,
      dragStartPosition: elem
        ? {
            clientTop: elem.clientTop,
            clientLeft: elem.clientLeft,
            offsetTop: elem.offsetTop,
            offsetLeft: elem.offsetLeft,
          }
        : null,
    };

    return data;
  }

  private reset() {
    this.pointerDownEvent = null;
    const elem = this.args?.hostElem;

    if (elem) {
      elem.removeEventListener("pointerup", this.pointerUp);
      elem.removeEventListener("pointermove", this.pointerMove);
    }
  }
}

export const createPointerDragService = () => new PointerDragService();
