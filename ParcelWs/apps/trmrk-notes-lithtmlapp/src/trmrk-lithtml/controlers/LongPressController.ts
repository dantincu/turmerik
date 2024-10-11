import { ReactiveController, ReactiveControllerHost } from "lit";

import trmrk from "../../trmrk";
import { MtblRefValue } from "../../trmrk/core";

import { EventListenersCollection } from "../../trmrk/EventListenersCollection";

import { clearTimeoutIfReq } from "../../trmrk-browser/domUtils/core";

import {
  TouchOrMouseCoords,
  getTouchOrMouseCoords,
  toSingleTouchOrClick,
} from "../../trmrk-browser/domUtils/touchAndMouseEvents";

export interface LongPressControllerEventDataCore {
  touchEvt?: TouchEvent | null | undefined;
  mouseEvt?: MouseEvent | null | undefined;
  touchCoords?: TouchOrMouseCoords | null | undefined;
  mouseCoords?: TouchOrMouseCoords | null | undefined;
  coords: TouchOrMouseCoords;
}

export interface LongPressControllerEventData
  extends LongPressControllerEventDataCore {
  longPressInterval: MtblRefValue<NodeJS.Timeout | null>;
}

export interface LongPressControllerEventDataTuple {
  startEvt: LongPressControllerEventData | null;
  evt: LongPressControllerEventDataCore;
}

export interface LongPressControllerOptsCore {
  treatRightClickAsLongPress?: boolean | null | undefined;
  longPressIntervalMillis?: number | null | undefined;
  touchOrMouseMoveMinPx?: number | null | undefined;
}

export interface LongPressControllerOpts<
  THTMLButtonElement extends HTMLElement = HTMLButtonElement
> extends LongPressControllerOptsCore {
  mainHtmlElement: THTMLButtonElement;
  hostHtmlElement: HTMLElement;
}

export class LongPressController<
  THTMLButtonElement extends HTMLElement = HTMLButtonElement
> implements ReactiveController
{
  public readonly touchStartEventListeners: EventListenersCollection<LongPressControllerEventDataTuple>;
  public readonly touchMoveEventListeners: EventListenersCollection<LongPressControllerEventDataTuple>;
  public readonly touchEndEventListeners: EventListenersCollection<LongPressControllerEventDataTuple>;
  public readonly mouseDownEventListeners: EventListenersCollection<LongPressControllerEventDataTuple>;
  public readonly mouseMoveEventListeners: EventListenersCollection<LongPressControllerEventDataTuple>;
  public readonly mouseUpEventListeners: EventListenersCollection<LongPressControllerEventDataTuple>;
  public readonly shortPressEventListeners: EventListenersCollection<LongPressControllerEventDataTuple>;
  public readonly longPressEventListeners: EventListenersCollection<LongPressControllerEventData>;

  public readonly mainHtmlElement: THTMLButtonElement;
  public readonly hostHtmlElement: HTMLElement;

  public readonly treatRightClickAsLongPress: boolean;
  public readonly longPressIntervalMillis: number;
  public readonly touchOrMouseMoveMinPx: number;

  public resetPredicate:
    | ((event: LongPressControllerEventDataTuple) => boolean)
    | null;

  protected readonly defaultResetPredicate: (
    event: LongPressControllerEventDataTuple
  ) => boolean;

  host: ReactiveControllerHost;

  startEvt: LongPressControllerEventData | null;

  constructor(
    host: ReactiveControllerHost,
    opts: LongPressControllerOpts<THTMLButtonElement>
  ) {
    (this.host = host).addController(this);
    this.mainHtmlElement = opts.mainHtmlElement;
    this.hostHtmlElement = opts.hostHtmlElement;
    this.treatRightClickAsLongPress = opts.treatRightClickAsLongPress ?? true;

    this.longPressIntervalMillis = trmrk.asNumber(
      opts.longPressIntervalMillis,
      400
    );

    this.touchOrMouseMoveMinPx = trmrk.asNumber(opts.touchOrMouseMoveMinPx, 20);
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

      return reset;
    };

    this.defaultResetPredicate = this.defaultResetPredicate.bind(this);

    this.touchStartEventListeners =
      new EventListenersCollection<LongPressControllerEventDataTuple>();

    this.touchMoveEventListeners =
      new EventListenersCollection<LongPressControllerEventDataTuple>();

    this.touchEndEventListeners =
      new EventListenersCollection<LongPressControllerEventDataTuple>();

    this.mouseDownEventListeners =
      new EventListenersCollection<LongPressControllerEventDataTuple>();

    this.mouseMoveEventListeners =
      new EventListenersCollection<LongPressControllerEventDataTuple>();

    this.mouseUpEventListeners =
      new EventListenersCollection<LongPressControllerEventDataTuple>();

    this.shortPressEventListeners =
      new EventListenersCollection<LongPressControllerEventDataTuple>();

    this.longPressEventListeners =
      new EventListenersCollection<LongPressControllerEventData>();

    this.startEvt = null;

    this.onLongPressIntervalElapsed =
      this.onLongPressIntervalElapsed.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseEnd = this.onMouseEnd.bind(this);
  }

  get isIdle() {
    const isIdle = !!this.startEvt;
    return isIdle;
  }

  hostConnected() {
    this.mainHtmlElement.addEventListener("touchstart", this.onTouchStart);
    this.mainHtmlElement.addEventListener("mousedown", this.onMouseDown);
  }

  hostDisconnected() {
    this.touchMoveEventListeners.unsubscribeAll();
    this.touchEndEventListeners.unsubscribeAll();
    this.mouseDownEventListeners.unsubscribeAll();
    this.mouseMoveEventListeners.unsubscribeAll();
    this.mouseUpEventListeners.unsubscribeAll();
    this.shortPressEventListeners.unsubscribeAll();
    this.longPressEventListeners.unsubscribeAll();

    this.mainHtmlElement.removeEventListener("touchstart", this.onTouchStart);
    this.mainHtmlElement.removeEventListener("mousedown", this.onMouseDown);
    this.reset();
  }

  reset() {
    clearTimeoutIfReq(this.startEvt?.longPressInterval);
    this.startEvt = null;

    document.removeEventListener("touchmove", this.onTouchMove, {
      capture: true,
    });

    document.removeEventListener("touchend", this.onTouchEnd, {
      capture: true,
    });

    document.removeEventListener("mousemove", this.onMouseMove, {
      capture: true,
    });

    document.removeEventListener("mouseup", this.onMouseEnd, {
      capture: true,
    });
  }

  onLongPressIntervalElapsed() {
    if (this.startEvt) {
      this.longPressEventListeners.fireAll(this.startEvt);
    } else {
      this.reset();
    }
  }

  onTouchStart(e: TouchEvent) {
    const evt = this.getTouchEventDataTuple(e);
    this.touchStartEventListeners.fireAll(evt);

    if (this.isIdle) {
      this.setStartEvtData(evt);
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

  onMouseEnd(e: MouseEvent) {
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

    const evt: LongPressControllerEventDataTuple = {
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

    const evt: LongPressControllerEventDataTuple = {
      startEvt: this.startEvt,
      evt: {
        mouseEvt: e,
        touchCoords: coords,
        coords,
      },
    };

    return evt;
  }

  setStartEvtData(evt: LongPressControllerEventDataTuple) {
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

  shouldReset(event: LongPressControllerEventDataTuple) {
    const resetPredicate = this.resetPredicate ?? this.defaultResetPredicate;
    const shouldReset = resetPredicate(event);

    return shouldReset;
  }
}
