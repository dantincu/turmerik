import { NullOrUndef, actWithValIf, MtblRefValue } from "@/src/trmrk/core";
import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";
import { clearIntervalIfReq, clearTimeoutIfReq } from "@/src/trmrk/timeout";

import { defaultLongPressTimeoutMills } from "../core";
import { MouseButton, isContainedBy } from "./touchAndMouseEvents";
import { LongPressOrRightClickEventData } from "./LongPressService";

export interface MultiClickServiceInitArgs {
  hostElem: HTMLElement;
  multiClickMillis?: number | NullOrUndef;
  multiClickPressAndHoldIntervalMillis?: number | NullOrUndef;
  multiClicksCount?: number | NullOrUndef;
  validMouseOrTouchMoveMaxPx?: number | NullOrUndef;
  longPressPreventDefault?: boolean | NullOrUndef;
  multiClick?: ((event: PointerEvent) => void) | NullOrUndef;
  multiClickPointerUp?:
    | ((event: MultiClickStepEventData) => void)
    | NullOrUndef;
  multiClickPointerDown?:
    | ((event: MultiClickStepEventData) => void)
    | NullOrUndef;
  multiClickPressAndHold?:
    | ((event: MultiClickPressAndHoldEventData) => void)
    | NullOrUndef;
  multiClickEnded?: (() => void) | NullOrUndef;
  multiClickComplete?: (() => void) | NullOrUndef;
}

export interface MultiClickStepEventData {
  event: PointerEvent;
  clicksCount: number;
}

export interface MultiClickPressAndHoldEventData {
  pointerDownEvent: PointerEvent;
  elapsedIntervalsCount: number;
}

export class MultiClickService extends TrmrkDisposableBase {
  private args: MultiClickServiceInitArgs | null = null;
  private pointerDownEvent: PointerEvent | null = null;
  private clicksCount = 0;
  private lastClickMillis = 0;
  private lastMouseDownMillis = 0;
  private elapsedIntervalsCount = 0;

  private pressAndHoldStartTimeout: MtblRefValue<NodeJS.Timeout | null> = {
    value: null,
  };
  private pressAndHoldInterval: MtblRefValue<NodeJS.Timeout | null> = {
    value: null,
  };
  private mouseUpTimeout: MtblRefValue<NodeJS.Timeout | null> = { value: null };

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
    this.removeEventListeners();
    const data = this.getEventData(event);

    if (data.isValid) {
      clearTimeoutIfReq(this.mouseUpTimeout);
      const now = new Date();
      const millis = now.getTime();
      this.lastMouseDownMillis = millis;

      if (
        this.lastClickMillis > 0 &&
        millis - this.lastClickMillis > this.args!.multiClickMillis!
      ) {
        this.resetState();
      }

      this.pressAndHoldStartTimeout.value = setTimeout(() => {
        this.firePressAndHold();

        this.pressAndHoldInterval.value = setInterval(() => {
          this.elapsedIntervalsCount++;
          this.firePressAndHold();
        }, this.args!.multiClickPressAndHoldIntervalMillis!);
      }, this.args!.multiClickMillis!);

      document.addEventListener("pointermove", this.pointerMove, {
        capture: true,
      });

      document.addEventListener("pointerup", this.pointerUp, {
        capture: true,
      });

      this.fireMultiClickPointerDown(data, this.clicksCount);
    } else {
      this.resetState();
    }
  }

  pointerMove(event: PointerEvent) {
    const data = this.getEventData(event);

    if (!data.isValid) {
      this.reset();
    }
  }

  pointerUp(event: PointerEvent) {
    const data = this.getEventData(event);

    if (data.isValid) {
      const now = new Date();
      const millis = now.getTime();

      this.clicksCount++;
      this.lastClickMillis = millis;

      if (
        millis - this.lastMouseDownMillis >
        this.args!.multiClickMillis! / 2
      ) {
        this.resetCore();
        actWithValIf(this.args!.multiClickComplete, (f) => f());
        actWithValIf(this.args!.multiClickEnded, (f) => f());
      } else {
        clearTimeoutIfReq(this.pressAndHoldStartTimeout);
        clearIntervalIfReq(this.pressAndHoldInterval);

        if (this.clicksCount >= this.args!.multiClicksCount!) {
          const clicksCount = this.clicksCount;
          this.resetCore();
          this.fireMultiClickPointerUp(data, clicksCount);
          actWithValIf(this.args!.multiClick, (f) =>
            f(data.event as PointerEvent),
          );
          actWithValIf(this.args!.multiClickComplete, (f) => f());
          actWithValIf(this.args!.multiClickEnded, (f) => f());
        } else {
          this.removeEventListeners();
          this.fireMultiClickPointerUp(data, this.clicksCount);
          this.mouseUpTimeout.value = setTimeout(() => {
            this.resetCore();
            actWithValIf(this.args!.multiClickComplete, (f) => f());
            actWithValIf(this.args!.multiClickEnded, (f) => f());
          }, this.args!.multiClickMillis! / 2);
        }
      }
    } else {
      this.reset();
    }
  }

  init(args: MultiClickServiceInitArgs) {
    this.args = {
      ...args,
      multiClickPressAndHoldIntervalMillis:
        args.multiClickPressAndHoldIntervalMillis ??
        Math.round(defaultLongPressTimeoutMills / 4),
      multiClickMillis: args.multiClickMillis ?? defaultLongPressTimeoutMills,
      validMouseOrTouchMoveMaxPx: args.validMouseOrTouchMoveMaxPx ?? 40,
      longPressPreventDefault: args.longPressPreventDefault ?? true,
    };

    const elem = args.hostElem;
    elem.addEventListener("pointerdown", this.pointerDown);
  }

  private reset() {
    this.pointerDownEvent = null;
    this.resetCore();
    actWithValIf(this.args?.multiClickEnded, (f) => f());
  }

  private resetCore() {
    this.resetStateCore();
    this.removeEventListeners();
  }

  private resetState() {
    this.resetStateCore();
    actWithValIf(this.args?.multiClickEnded, (f) => f());
  }

  private resetStateCore() {
    clearTimeoutIfReq(this.pressAndHoldStartTimeout);
    clearIntervalIfReq(this.pressAndHoldInterval);
    clearTimeoutIfReq(this.mouseUpTimeout);
    this.lastClickMillis = 0;
    this.lastMouseDownMillis = 0;
    this.clicksCount = 0;
    this.elapsedIntervalsCount = 0;
  }

  private removeEventListeners() {
    document.removeEventListener("pointermove", this.pointerMove, {
      capture: true,
    });

    document.removeEventListener("pointerup", this.pointerUp, {
      capture: true,
    });
  }

  private firePressAndHold() {
    actWithValIf(this.args!.multiClickPressAndHold, (f) =>
      f({
        pointerDownEvent: this.pointerDownEvent!,
        elapsedIntervalsCount: this.elapsedIntervalsCount,
      }),
    );
  }

  private fireMultiClickPointerDown(
    data: LongPressOrRightClickEventData,
    clicksCount: number,
  ) {
    actWithValIf(this.args!.multiClickPointerDown, (f) =>
      f({
        event: data.event as PointerEvent,
        clicksCount,
      }),
    );
  }

  private fireMultiClickPointerUp(
    data: LongPressOrRightClickEventData,
    clicksCount: number,
  ) {
    actWithValIf(this.args!.multiClickPointerUp, (f) =>
      f({
        event: data.event as PointerEvent,
        clicksCount,
      }),
    );
  }

  private getEventData(event: PointerEvent) {
    const data: LongPressOrRightClickEventData = {
      elem: this.args!.hostElem,
      event,
      composedPath: null,
      isValid: event.button === MouseButton.Left,
    };

    if (data.isValid) {
      data.isValid = isContainedBy({ event, parent: data.elem });
    }

    return data;
  }
}
