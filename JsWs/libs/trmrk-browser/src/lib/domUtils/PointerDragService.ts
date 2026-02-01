import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";
import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";

import { pointerIsTouchOrLeftMouseBtn } from "./touchAndMouseEvents";
import { LongPressOrRightClickEventData } from "./LongPressService";

export interface PointerDragServiceInitArgs {
  eventDataAvailable?:
    | ((eventData: DragEventData, isForMouseUp: boolean) => void)
    | NullOrUndef;
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
  private hostElem: HTMLElement | null = null;

  constructor() {
    super();

    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.pointerMove = this.pointerMove.bind(this);
  }

  disposeCore(): void {
    const elem = this.hostElem;

    if (elem) {
      elem.removeEventListener("pointerdown", this.pointerDown);
    }

    this.reset();
    this.hostElem = null;
    this.args = null;
  }

  pointerDown(event: PointerEvent) {
    this.reset();
    this.pointerDownEvent = event;
    const data = this.getEventData(event);

    if (data.isValid) {
      document.addEventListener("pointermove", this.pointerMove, {
        capture: true,
        passive: false,
      });

      document.addEventListener("pointerup", this.pointerUp, {
        capture: true,
      });

      actWithValIf(this.args!.dragStart, (f) => f(event));
    } else {
      this.pointerDownEvent = null;
    }

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
    const data = this.getEventData(event, true);
    actWithValIf(this.args!.dragEnd, (f) => f(this.getDragEvent(data)));
    this.reset();
  }

  init(args: PointerDragServiceInitArgs) {
    this.args = {
      ...args,
    };
  }

  setHostElem(hostElem: HTMLElement | null) {
    this.hostElem?.removeEventListener("pointerdown", this.pointerDown);
    this.hostElem = hostElem;
    this.hostElem?.addEventListener("pointerdown", this.pointerDown);
  }

  private getDragEvent(data: LongPressOrRightClickEventData) {
    const event: PointerDragEvent = {
      pointerDownEvent: this.pointerDownEvent!,
      event: data.event as PointerEvent,
    };

    return event;
  }

  private getEventData(event: PointerEvent, isForMouseUp = false) {
    event.preventDefault();
    const elem = this.hostElem;

    const data: DragEventData = {
      elem: elem!,
      event,
      composedPath: null,
      isValid: pointerIsTouchOrLeftMouseBtn(event, isForMouseUp) && !!elem,
      dragStartPosition: elem
        ? {
            clientTop: elem.clientTop,
            clientLeft: elem.clientLeft,
            offsetTop: elem.offsetTop,
            offsetLeft: elem.offsetLeft,
          }
        : null,
    };

    actWithValIf(this.args?.eventDataAvailable, (f) => f(data, isForMouseUp));
    return data;
  }

  private reset() {
    this.pointerDownEvent = null;

    document.removeEventListener("pointerup", this.pointerUp, {
      capture: true,
    });

    document.removeEventListener("pointermove", this.pointerMove, {
      capture: true,
    });
  }
}

export const createPointerDragService = () => new PointerDragService();
