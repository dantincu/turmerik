import { NullOrUndef, withValIf, actWithValIf } from "@/src/trmrk/core";
import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";

import { defaultLongPressTimeoutMills } from "../core";
import { MouseButton, isAnyContainedBy } from "./touchAndMouseEvents";

export interface LongPressServiceInitArgs {
  hostElem: HTMLElement;
  longPressIntervalMillis?: number | NullOrUndef;
  validMouseOrTouchMoveMaxPx?: number | NullOrUndef;
  longPressPreventDefault?: boolean | NullOrUndef;
  altHostElems?: (() => HTMLElement[]) | NullOrUndef;
  longPressOrRightClick?: ((event: PointerEvent) => void) | NullOrUndef;
  shortPressOrLeftClick?: ((event: PointerEvent) => void) | NullOrUndef;
}

export interface LongPressOrRightClickEventData {
  elem: HTMLElement;
  event: TouchEvent | MouseEvent | PointerEvent;
  composedPath: EventTarget[] | null;
  isValid: boolean;
}

export class LongPressService extends TrmrkDisposableBase {
  private args: LongPressServiceInitArgs | null = null;
  private pointerDownEvent: PointerEvent | null = null;
  private longPressTimeout: NodeJS.Timeout | null = null;

  constructor() {
    super();

    this.pointerDown = this.pointerDown.bind(this);
    this.pointerUp = this.pointerUp.bind(this);
    this.pointerMove = this.pointerMove.bind(this);
    this.contextMenu = this.contextMenu.bind(this);
    this.longPressTimeoutElapsed = this.longPressTimeoutElapsed.bind(this);
  }

  disposeCore(): void {
    actWithValIf(this.args?.hostElem, (elem) => {
      elem.removeEventListener("contextmenu", this.contextMenu);
      elem.removeEventListener("pointerdown", this.pointerDown);
    });

    this.reset();
    this.args = null;
  }

  init(args: LongPressServiceInitArgs) {
    this.args = {
      ...args,
      longPressIntervalMillis:
        args.longPressIntervalMillis ?? defaultLongPressTimeoutMills,
      validMouseOrTouchMoveMaxPx: args.validMouseOrTouchMoveMaxPx ?? 40,
      longPressPreventDefault: args.longPressPreventDefault ?? true,
      altHostElems: args.altHostElems ?? null,
    };

    const elem = args.hostElem;
    elem.addEventListener("contextmenu", this.contextMenu);
    elem.addEventListener("pointerdown", this.pointerDown);
  }

  pointerDown(event: PointerEvent) {
    this.reset();
    this.pointerDownEvent = event;
    const data = this.getEventData(event);

    if (data.isValid) {
      document.addEventListener("pointermove", this.pointerMove, {
        capture: true,
      });

      document.addEventListener("pointerup", this.pointerUp, {
        capture: true,
      });

      if (event.buttons === 1) {
        this.longPressTimeout = setTimeout(
          this.longPressTimeoutElapsed,
          this.args!.longPressIntervalMillis!,
        );
      }
    } else {
      this.pointerDownEvent = null;
    }
  }

  pointerUp(event: PointerEvent) {
    const data = this.getEventData(event, true);

    if (data.isValid) {
      actWithValIf(
        [this.args!.shortPressOrLeftClick, this.args!.longPressOrRightClick][
          [MouseButton.Left, MouseButton.Right].indexOf(event.button)
        ],
        (f) => f(this.pointerDownEvent!),
      );
    }

    this.reset();
  }

  pointerMove(event: PointerEvent) {
    const data = this.getEventData(event);

    if (!data.isValid) {
      this.reset();
    }
  }

  contextMenu(event: PointerEvent) {
    if (this.args!.longPressPreventDefault) {
      event.preventDefault();
    }
  }

  longPressTimeoutElapsed() {
    actWithValIf(this.args!.longPressOrRightClick, (f) =>
      f!(this.pointerDownEvent!),
    );

    this.reset();
  }

  reset() {
    this.pointerDownEvent = null;
    actWithValIf(this.longPressTimeout, clearTimeout);
    this.longPressTimeout = null;

    document.removeEventListener("pointermove", this.pointerMove, {
      capture: true,
    });

    document.removeEventListener("pointerup", this.pointerUp, {
      capture: true,
    });

    document.removeEventListener("contextmenu", this.contextMenu, {
      capture: true,
    });
  }

  private getEventData(event: PointerEvent, isForMouseUp = false) {
    const data: LongPressOrRightClickEventData = {
      elem: this.args!.hostElem,
      event,
      composedPath: null,
      isValid: true,
    };

    /* According to gemini: 
       To check if a button is currently being held down during a move, you should use the buttons property. This is a bitmask representing all buttons currently pressed.
        0: No button is pressed (Standard hover/move).
        1: Left mouse button or Touch contact.
        2: Right mouse button.
        4: Middle mouse button.
    */
    data.isValid = (isForMouseUp ? [0] : [1, 2]).indexOf(event.buttons) >= 0;

    if (data.isValid) {
      data.isValid = isAnyContainedBy({
        event,
        parent: [
          ...(withValIf(this.args!.altHostElems, (f) => f()) ?? []),
          data.elem,
        ],
      });
    }

    if (data.isValid) {
      const diffX = Math.abs(event.screenX - this.pointerDownEvent!.screenX);
      const diffY = Math.abs(event.screenY - this.pointerDownEvent!.screenY);

      data.isValid =
        Math.max(diffX, diffY) <= this.args!.validMouseOrTouchMoveMaxPx!;
    }

    return data;
  }
}

export const createLongPressService = () => new LongPressService();
