import trmrk from "../../../trmrk";
import { MtblRefValue } from "../../../trmrk/core";

import { EventListenersCollection } from "../../../trmrk/EventListenersCollection";

import { clearTimeoutIfReq } from "../../../trmrk-browser/domUtils/core";

import {
  TouchOrMouseCoords,
  getTouchOrMouseCoords,
  toSingleTouchOrClick,
} from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

export interface LongPressEventDataCore {
  touchEvt?: TouchEvent | null | undefined;
  mouseEvt?: MouseEvent | null | undefined;
  touchCoords?: TouchOrMouseCoords | null | undefined;
  mouseCoords?: TouchOrMouseCoords | null | undefined;
  coords: TouchOrMouseCoords;
}

export interface LongPressEventData extends LongPressEventDataCore {
  longPressInterval: MtblRefValue<NodeJS.Timeout | null>;
}

export interface LongPressEventDataTuple {
  startEvt: LongPressEventData | null;
  evt: LongPressEventDataCore;
}

export interface UseLongPressPropsCore {
  treatRightClickAsLongPress?: boolean | null | undefined;
  longPressIntervalMillis?: number | null | undefined;
  touchOrMouseMoveMinPx?: number | null | undefined;
}

export interface UseLongPressProps<
  THTMLElement extends HTMLElement = HTMLButtonElement
> extends UseLongPressPropsCore {
  domElemFactory: () => THTMLElement;
}

export class UseLongPress<
  THTMLElement extends HTMLElement = HTMLButtonElement
> {
  public readonly touchStartEventListeners: EventListenersCollection<LongPressEventDataTuple>;
  public readonly touchMoveEventListeners: EventListenersCollection<LongPressEventDataTuple>;
  public readonly touchEndEventListeners: EventListenersCollection<LongPressEventDataTuple>;
  public readonly mouseDownEventListeners: EventListenersCollection<LongPressEventDataTuple>;
  public readonly mouseMoveEventListeners: EventListenersCollection<LongPressEventDataTuple>;
  public readonly mouseUpEventListeners: EventListenersCollection<LongPressEventDataTuple>;
  public readonly shortPressEventListeners: EventListenersCollection<LongPressEventDataTuple>;
  public readonly longPressEventListeners: EventListenersCollection<LongPressEventData>;

  public readonly treatRightClickAsLongPress: boolean;
  public readonly longPressIntervalMillis: number;
  public readonly touchOrMouseMoveMinPx: number;

  public resetPredicate: ((event: LongPressEventDataTuple) => boolean) | null;

  protected readonly defaultResetPredicate: (
    event: LongPressEventDataTuple
  ) => boolean;

  protected readonly domElemFactory: () => THTMLElement;

  private domElem: THTMLElement | null = null;

  startEvt: LongPressEventData | null;

  constructor(props: UseLongPressProps<THTMLElement>) {
    this.treatRightClickAsLongPress = props.treatRightClickAsLongPress ?? true;

    this.longPressIntervalMillis = trmrk.asNumber(
      props.longPressIntervalMillis,
      400
    );

    this.touchOrMouseMoveMinPx = trmrk.asNumber(
      props.touchOrMouseMoveMinPx,
      200
    );

    this.domElemFactory = props.domElemFactory;

    this.resetPredicate = null;

    this.defaultResetPredicate = (event) => {
      const coords = event.evt.coords;
      const startCoords = event.startEvt?.coords;

      let reset = !startCoords;

      if (!reset) {
        reset =
          Math.abs(coords.screenX - startCoords!.screenX) >
          this.touchOrMouseMoveMinPx;

        reset =
          reset ||
          Math.abs(coords.screenY - startCoords!.screenY) >
            this.touchOrMouseMoveMinPx;
      }

      if (!reset) {
        var evt = (event.evt.mouseEvt ?? event.evt.touchEvt)!;
        var composedPathResult = evt.composedPath();
        var target = evt.target;

        if (target) {
          reset = composedPathResult.indexOf(target) < 0;
        } else {
          reset = true;
        }
      }

      return reset;
    };

    this.defaultResetPredicate = this.defaultResetPredicate.bind(this);

    this.touchStartEventListeners =
      new EventListenersCollection<LongPressEventDataTuple>();

    this.touchMoveEventListeners =
      new EventListenersCollection<LongPressEventDataTuple>();

    this.touchEndEventListeners =
      new EventListenersCollection<LongPressEventDataTuple>();

    this.mouseDownEventListeners =
      new EventListenersCollection<LongPressEventDataTuple>();

    this.mouseMoveEventListeners =
      new EventListenersCollection<LongPressEventDataTuple>();

    this.mouseUpEventListeners =
      new EventListenersCollection<LongPressEventDataTuple>();

    this.shortPressEventListeners =
      new EventListenersCollection<LongPressEventDataTuple>();

    this.longPressEventListeners =
      new EventListenersCollection<LongPressEventData>();

    this.startEvt = null;

    this.onLongPressIntervalElapsed =
      this.onLongPressIntervalElapsed.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  get isIdle() {
    const isIdle = !this.startEvt;
    return isIdle;
  }

  public subscribeToDomElem() {
    this.domElem = this.domElemFactory();

    this.domElem.addEventListener("touchstart", this.onTouchStart);
    this.domElem.addEventListener("mousedown", this.onMouseDown);
  }

  public unsubscribeFromDomElem() {
    this.touchMoveEventListeners.unsubscribeAll();
    this.touchEndEventListeners.unsubscribeAll();
    this.mouseDownEventListeners.unsubscribeAll();
    this.mouseMoveEventListeners.unsubscribeAll();
    this.mouseUpEventListeners.unsubscribeAll();
    this.shortPressEventListeners.unsubscribeAll();
    this.longPressEventListeners.unsubscribeAll();

    if (this.domElem) {
      this.domElem!.removeEventListener("touchstart", this.onTouchStart);
      this.domElem!.removeEventListener("mousedown", this.onMouseDown);
    }

    this.reset();
  }

  reset() {
    clearTimeoutIfReq(this.startEvt?.longPressInterval);
    this.startEvt = null;
    this.resetPredicate = null;

    document.removeEventListener("touchmove", this.onTouchMove, {
      capture: true,
    });

    document.removeEventListener("touchend", this.onTouchEnd, {
      capture: true,
    });

    document.removeEventListener("mousemove", this.onMouseMove, {
      capture: true,
    });

    document.removeEventListener("mouseup", this.onMouseUp, {
      capture: true,
    });
  }

  onLongPressIntervalElapsed() {
    if (this.startEvt) {
      this.longPressEventListeners.fireAll(this.startEvt);
    }

    this.reset();
  }

  onTouchStart(e: TouchEvent) {
    const evt = this.getTouchEventDataTuple(e);
    this.touchStartEventListeners.fireAll(evt);

    if (this.isIdle) {
      this.setStartEvtData(evt);

      document.addEventListener("touchmove", this.onTouchMove, {
        capture: true,
      });

      document.addEventListener("touchend", this.onTouchEnd, {
        capture: true,
      });
    } else {
      this.reset();
    }
  }

  onTouchMove(e: TouchEvent) {
    const evt = this.getTouchEventDataTuple(e);
    this.touchMoveEventListeners.fireAll(evt);

    if (this.startEvt?.touchCoords) {
      if (this.shouldReset(evt)) {
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  onTouchEnd(e: TouchEvent) {
    const evt = this.getTouchEventDataTuple(e);
    this.touchEndEventListeners.fireAll(evt);

    if (this.startEvt?.touchCoords) {
      if (!this.shouldReset(evt)) {
        this.shortPressEventListeners.fireAll(evt);
      }
    }

    this.reset();
  }

  onMouseDown(e: MouseEvent) {
    const evt = this.getMouseEventDataTuple(e);
    this.mouseDownEventListeners.fireAll(evt);

    if (this.isIdle) {
      this.setStartEvtData(evt);

      document.addEventListener("mousemove", this.onMouseMove, {
        capture: true,
      });

      document.addEventListener("mouseup", this.onMouseUp, {
        capture: true,
      });
    } else {
      this.reset();
    }
  }

  onMouseMove(e: MouseEvent) {
    const evt = this.getMouseEventDataTuple(e);
    this.mouseMoveEventListeners.fireAll(evt);

    if (this.startEvt?.mouseCoords) {
      if (this.shouldReset(evt)) {
        this.reset();
      }
    } else {
      this.reset();
    }
  }

  onMouseUp(e: MouseEvent) {
    const evt = this.getMouseEventDataTuple(e);
    this.mouseUpEventListeners.fireAll(evt);

    if (this.startEvt?.mouseCoords) {
      if (!this.shouldReset(evt)) {
        this.shortPressEventListeners.fireAll(evt);
      }
    }

    this.reset();
  }

  getTouchEventDataTuple(e: TouchEvent) {
    const coords = toSingleTouchOrClick(getTouchOrMouseCoords(e))!;

    const evt: LongPressEventDataTuple = {
      startEvt: this.startEvt,
      evt: {
        touchEvt: e,
        touchCoords: coords,
        coords,
      },
    };

    return evt;
  }

  getMouseEventDataTuple(e: MouseEvent) {
    const coords = toSingleTouchOrClick(getTouchOrMouseCoords(e))!;

    const evt: LongPressEventDataTuple = {
      startEvt: this.startEvt,
      evt: {
        mouseEvt: e,
        mouseCoords: coords,
        coords,
      },
    };

    return evt;
  }

  setStartEvtData(evt: LongPressEventDataTuple) {
    this.startEvt = {
      ...evt.evt,
      longPressInterval: {
        value: setTimeout(
          this.onLongPressIntervalElapsed,
          this.longPressIntervalMillis
        ),
      },
    };
  }

  shouldReset(event: LongPressEventDataTuple) {
    const resetPredicate = this.resetPredicate ?? this.defaultResetPredicate;
    const shouldReset = resetPredicate(event);

    return shouldReset;
  }
}

export const useLongPress = <
  THTMLElement extends HTMLElement = HTMLButtonElement
>(
  props: UseLongPressProps<THTMLElement>
) => {
  const retObj = new UseLongPress<THTMLElement>(props);
  return retObj;
};
