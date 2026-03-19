import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";
import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";

import {
  TouchOrMouseCoords,
  getSingleTouchOrClick,
  MouseButton,
} from "./touchAndMouseEvents";

import { LongPressOrRightClickEventData } from "./LongPressService";

export interface PointerDragServiceInitArgs {
  eventDataAvailable?:
    | ((eventData: DragEventData, isForMouseUp: boolean) => void)
    | NullOrUndef;
  drag?: ((event: PointerDragEvent) => void) | NullOrUndef;
  dragStart?: ((event: TouchOrMouseCoords) => void) | NullOrUndef;
  dragEnd?: ((event: PointerDragEvent) => void) | NullOrUndef;
}

export interface PointerDragEvent {
  pointerDownCoords: TouchOrMouseCoords;
  coords: TouchOrMouseCoords;
  event: MouseEvent | TouchEvent;
}

export interface DragEventData extends LongPressOrRightClickEventData {
  coords: TouchOrMouseCoords | null;
}

export class PointerDragService extends TrmrkDisposableBase {
  private args: PointerDragServiceInitArgs | null = null;
  private pointerDownCoords: TouchOrMouseCoords | null = null;
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
      elem.removeEventListener("mousedown", this.pointerDown);
      elem.removeEventListener("touchend", this.pointerDown);
    }

    this.reset();
    this.hostElem = null;
    this.args = null;
  }

  pointerDown(event: MouseEvent | TouchEvent) {
    this.reset();
    const data = this.getEventData(event);

    if (data.isValid) {
      this.pointerDownCoords = data.coords;

      document.addEventListener("mousemove", this.pointerMove, {
        capture: true,
        passive: false,
      });

      document.addEventListener("touchmove", this.pointerMove, {
        capture: true,
        passive: false,
      });

      document.addEventListener("mouseup", this.pointerUp, {
        capture: true,
      });

      document.addEventListener("touchend", this.pointerUp, {
        capture: true,
      });

      actWithValIf(this.args!.dragStart, (f) => f(data.coords!));
    } else {
      this.pointerDownCoords = null;
    }

    return event;
  }

  pointerMove(event: MouseEvent | TouchEvent) {
    const data = this.getEventData(event);

    if (!data.isValid) {
      this.reset();
    } else {
      actWithValIf(this.args!.drag, (f) => f(this.getDragEvent(data)));
    }
  }

  pointerUp(event: MouseEvent | TouchEvent) {
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
    this.hostElem?.removeEventListener("mousedown", this.pointerDown);
    this.hostElem?.removeEventListener("touchstart", this.pointerDown);
    this.hostElem = hostElem;
    this.hostElem?.addEventListener("mousedown", this.pointerDown);
    this.hostElem?.addEventListener("touchstart", this.pointerDown);
  }

  private getDragEvent(data: DragEventData) {
    const event: PointerDragEvent = {
      pointerDownCoords: this.pointerDownCoords!,
      coords: data.coords!,
      event: data.event,
    };

    return event;
  }

  private getEventData(event: MouseEvent | TouchEvent, isForMouseUp = false) {
    event.preventDefault();
    const elem = this.hostElem;

    const data = {
      elem: elem!,
      event,
      composedPath: null,
      coords: getSingleTouchOrClick(event, MouseButton.Left, false),
    } as DragEventData;

    data.isValid = !!data.coords;
    actWithValIf(this.args?.eventDataAvailable, (f) => f(data, isForMouseUp));
    return data;
  }

  private reset() {
    this.pointerDownCoords = null;

    document.removeEventListener("mouseup", this.pointerUp, {
      capture: true,
    });

    document.removeEventListener("touchend", this.pointerUp, {
      capture: true,
    });

    document.removeEventListener("mousemove", this.pointerMove, {
      capture: true,
    });

    document.removeEventListener("touchmove", this.pointerMove, {
      capture: true,
    });
  }
}

export const createPointerDragService = () => new PointerDragService();
