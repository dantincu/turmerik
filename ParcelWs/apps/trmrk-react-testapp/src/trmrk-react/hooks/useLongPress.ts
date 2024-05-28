import React from "react";

import { ValueOrAnyOrVoid } from "../../trmrk/core";

import {
  TouchOrMouseCoords,
  getSingleTouchOrClick,
} from "../../trmrk-browser/domUtils/touchAndMouseEvents";

import {
  clearIntervalIfReq,
  clearTimeoutIfReq,
} from "../../trmrk-browser/domUtils/core";

export const LONG_PRESS_INTERVAL_MS = 400;
export const AFTER_LONG_PRESS_INTERVAL_MS = 200;
export const AFTER_LONG_PRESS_LOOP_INTERVAL_MS = 100;
export const AFTER_LONG_PRESS_LOOP_TIMEOUT_MS = 30 * 1000;

export interface UseLongPressProps {
  requiredButton?: number | null | undefined;
  longPressIntervalMs?: number | null | undefined;
  afterLongPressIntervalMs?: number | null | undefined;
  afterLongPressLoopIntervalMs?: number | null | undefined;
  afterLongPressLoopBreakIntervalMs?: number | null | undefined;
  innerBoundsRatio?: number | null | undefined;
  widthInnerBoundsRatio?: number | null | undefined;
  heightInnerBoundsRatio?: number | null | undefined;
  touchIsOutOfBoundsPredicate?:
    | ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => boolean)
    | null
    | undefined;
  touchStartOrMouseDown?:
    | ((
        ev: TouchEvent | MouseEvent,
        coords: TouchOrMouseCoords
      ) => ValueOrAnyOrVoid<boolean>)
    | null
    | undefined;
  touchEndOrMouseUp?:
    | ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void)
    | null
    | undefined;
  touchOrMouseMove?:
    | ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void)
    | null
    | undefined;
  shortPressed?:
    | ((
        ev: TouchEvent | MouseEvent,
        coords: TouchOrMouseCoords | null
      ) => ValueOrAnyOrVoid<number>)
    | null
    | undefined;
  shortPressDelayedEnd?: (() => void) | null | undefined;
  longPressStarted?: (() => void) | null | undefined;
  longPressEnded?:
    | ((
        ev: TouchEvent | MouseEvent | null,
        coords: TouchOrMouseCoords | null
      ) => ValueOrAnyOrVoid<number>)
    | null
    | undefined;
  afterLongPressStarted?: (() => void) | null | undefined;
  afterLongPressLoop?: (() => void) | null | undefined;
  afterLongPressLoopBreak?: (() => void) | null | undefined;
  afterLongPressDelayedEnd?: (() => void) | null | undefined;
}

export interface UseLongPressResult {
  registerAll: (btnElem: HTMLElement) => void;
  unregisterAll: (btnElem?: HTMLElement | null | null) => void;
}

export const normRequiredButton = (requiredButton: number | null | undefined) =>
  requiredButton ?? 0;

export const normLongPressIntervalMs = (
  longPressIntervalMs: number | null | undefined
) => longPressIntervalMs ?? LONG_PRESS_INTERVAL_MS;

export const normAfterLongPressIntervalMs = (
  afterLongPressIntervalMs: number | null | undefined
) => afterLongPressIntervalMs ?? -1;

export const normAfterLongPressLoopIntervalMs = (
  afterLongPressLoopIntervalMs: number | null | undefined
) => afterLongPressLoopIntervalMs ?? -1;

export const normAfterLongPressLoopBreakIntervalMs = (
  afterLongPressLoopBreakIntervalMs: number | null | undefined
) => afterLongPressLoopBreakIntervalMs ?? -1;

export const normInnerBoundsRatio = (
  innerBoundsRatio: number | null | undefined,
  defaultInnerBoundsRatio: number = 1
) => innerBoundsRatio ?? defaultInnerBoundsRatio ?? 1;

export const touchIsOutOfBounds = (
  elem: HTMLElement,
  ev: TouchEvent | MouseEvent,
  coords: TouchOrMouseCoords,
  widthInnerBoundsRatio: number,
  heightInnerBoundsRatio: number
) => {
  const clientRectangle = elem.getBoundingClientRect();

  const innerRectangle = {
    width: Math.round(widthInnerBoundsRatio * clientRectangle.width),
    height: Math.round(heightInnerBoundsRatio * clientRectangle.height),
    widthHalfDiff: 0,
    heightHalfDiff: 0,
    left: clientRectangle.left,
    top: clientRectangle.top,
  };

  innerRectangle.widthHalfDiff = Math.round(
    (clientRectangle.width - innerRectangle.width) / 2
  );

  innerRectangle.heightHalfDiff = Math.round(
    (clientRectangle.height - innerRectangle.height) / 2
  );

  innerRectangle.left += innerRectangle.widthHalfDiff;
  innerRectangle.top += innerRectangle.heightHalfDiff;

  let isOutOfBounds =
    coords.pageX < innerRectangle.left ||
    coords.pageX - innerRectangle.left > innerRectangle.width;

  isOutOfBounds =
    isOutOfBounds ||
    coords.pageY < innerRectangle.top ||
    coords.pageY - innerRectangle.top > innerRectangle.height;

  return isOutOfBounds;
};

export default function useLongPress(props: UseLongPressProps) {
  const [propsRequiredButton, setPropsRequiredButton] = React.useState(
    normRequiredButton(props.requiredButton)
  );

  const btnElRef = React.useRef<HTMLElement | null>(null);

  const [propsLongPressIntervalMs, setPropsLongPressIntervalMs] =
    React.useState(normLongPressIntervalMs(props.longPressIntervalMs));

  const [propsAfterLongPressIntervalMs, setPropsAfterLongPressIntervalMs] =
    React.useState(
      normAfterLongPressIntervalMs(props.afterLongPressIntervalMs)
    );

  const [
    propsAfterLongPressLoopIntervalMs,
    setPropsAfterLongPressLoopIntervalMs,
  ] = React.useState(
    normAfterLongPressLoopIntervalMs(props.afterLongPressLoopIntervalMs)
  );

  const [
    propsAfterLongPressLoopBreakIntervalMs,
    setPropsAfterLongPressLoopBreakIntervalMs,
  ] = React.useState(
    normAfterLongPressLoopBreakIntervalMs(
      props.afterLongPressLoopBreakIntervalMs
    )
  );

  const [propsInnerBoundsRatio, setPropsInnerBoundsRatio] = React.useState(
    normInnerBoundsRatio(props.innerBoundsRatio)
  );

  const [propsWidthInnerBoundsRatio, setPropsWidthInnerBoundsRatio] =
    React.useState(
      normInnerBoundsRatio(props.widthInnerBoundsRatio, propsInnerBoundsRatio)
    );

  const [propsHeightInnerBoundsRatio, setPropsHeightInnerBoundsRatio] =
    React.useState(
      normInnerBoundsRatio(props.heightInnerBoundsRatio, propsInnerBoundsRatio)
    );

  const [requiredButton, setRequiredButton] =
    React.useState(propsRequiredButton);

  const [longPressIntervalMs, setLongPressIntervalMs] = React.useState(
    propsLongPressIntervalMs
  );

  const [afterLongPressIntervalMs, setAfterLongPressIntervalMs] =
    React.useState(propsAfterLongPressIntervalMs);

  const [afterLongPressLoopIntervalMs, setAfterLongPressLoopIntervalMs] =
    React.useState(propsAfterLongPressLoopIntervalMs);

  const [
    afterLongPressLoopBreakIntervalMs,
    setAfterLongPressLoopBreakIntervalMs,
  ] = React.useState(propsAfterLongPressLoopBreakIntervalMs);

  const [innerBoundsRatio, setInnerBoundsRatio] = React.useState(
    propsInnerBoundsRatio
  );

  const [widthInnerBoundsRatio, setWidthInnerBoundsRatio] = React.useState(
    propsWidthInnerBoundsRatio
  );

  const [heightInnerBoundsRatio, setHeightInnerBoundsRatio] = React.useState(
    propsHeightInnerBoundsRatio
  );

  const longPressTimeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  const afterLongPressTimeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  const afterLongPressLoopIntervalIdRef = React.useRef<NodeJS.Timeout | null>(
    null
  );

  const afterLongPressLoopTimeoutIdRef = React.useRef<NodeJS.Timeout | null>(
    null
  );

  const afterLongPressEndedTimeoutIdRef = React.useRef<NodeJS.Timeout | null>(
    null
  );

  const longPressIntervalPassedRef = React.useRef(false);

  const onTouchStartOrMouseDown = React.useCallback(
    (ev: TouchEvent | MouseEvent) => {
      const btnElem = ev.target as HTMLElement;

      if (btnElem) {
        clearAll(btnElem);
        const coords = getSingleTouchOrClick(ev, requiredButton);

        if (coords) {
          let $continue: ValueOrAnyOrVoid<boolean> = null;

          if (props.touchStartOrMouseDown) {
            $continue = props.touchStartOrMouseDown(ev, coords);
          }

          if ($continue !== false) {
            document.addEventListener("mouseup", onTouchEndOrMouseUp, {
              capture: true,
            });

            document.addEventListener("touchend", onTouchEndOrMouseUp, {
              capture: true,
            });

            document.addEventListener("mousemove", onTouchOrMouseMove, {
              capture: true,
            });

            document.addEventListener("touchmove", onTouchOrMouseMove, {
              capture: true,
            });

            longPressTimeoutIdRef.current = setTimeout(
              onLongPressIntervalPassed,
              longPressIntervalMs
            );
          }
        }
      }
    },
    [requiredButton, longPressIntervalMs]
  );

  const onTouchEndOrMouseUpOrTouchOrMouseMove = React.useCallback(
    (ev: TouchEvent | MouseEvent, isTouchOrMouseMove: boolean) => {
      const trgElem = ev.target as HTMLElement;

      if (trgElem && btnElRef.current) {
        const coords = getSingleTouchOrClick(ev, requiredButton);
        let $continue: boolean =
          !isTouchOrMouseMove ||
          !!coords ||
          !btnElRef.current.contains(trgElem);

        if (isTouchOrMouseMove) {
          if (props.touchOrMouseMove) {
            props.touchOrMouseMove(ev, coords);
          }

          if (coords) {
            if (props.touchIsOutOfBoundsPredicate) {
              $continue = !props.touchIsOutOfBoundsPredicate(ev, coords);
            } else {
              $continue = touchIsOutOfBounds(
                btnElRef.current,
                ev,
                coords,
                widthInnerBoundsRatio,
                heightInnerBoundsRatio
              );
            }
          }
        } else {
          if (props.touchEndOrMouseUp) {
            props.touchEndOrMouseUp(ev, coords);
          }
        }

        if ($continue) {
          if (longPressIntervalPassedRef.current) {
            longPressEnded(ev, coords);
          } else {
            shortPressed(ev, coords);
          }

          clearAll(trgElem);
        }
      }
    },
    [requiredButton, btnElRef, widthInnerBoundsRatio, heightInnerBoundsRatio]
  );

  const onTouchEndOrMouseUp = React.useCallback(
    (ev: TouchEvent | MouseEvent) => {
      onTouchEndOrMouseUpOrTouchOrMouseMove(ev, false);
    },
    [requiredButton]
  );

  const onTouchOrMouseMove = React.useCallback(
    (ev: TouchEvent | MouseEvent) => {
      onTouchEndOrMouseUpOrTouchOrMouseMove(ev, true);
    },
    [requiredButton]
  );

  const onLongPressIntervalPassed = React.useCallback(() => {
    clearTimeoutIfReq(longPressTimeoutIdRef);

    if (props.longPressStarted) {
      props.longPressStarted();
    }

    if (afterLongPressIntervalMs > 0) {
      afterLongPressTimeoutIdRef.current = setTimeout(
        onAfterLongPressInterval,
        afterLongPressIntervalMs
      );
    }

    if (afterLongPressLoopIntervalMs > 0 && props.afterLongPressLoop) {
      afterLongPressLoopIntervalIdRef.current = setInterval(
        onAfterLongPressLoopInterval,
        afterLongPressLoopIntervalMs
      );
    }

    if (afterLongPressLoopBreakIntervalMs > 0) {
      afterLongPressLoopTimeoutIdRef.current = setTimeout(
        onAfterLongPressLoopBreak,
        afterLongPressLoopBreakIntervalMs
      );
    }

    longPressIntervalPassedRef.current = true;
  }, [afterLongPressLoopIntervalMs, afterLongPressLoopBreakIntervalMs]);

  const shortPressed = React.useCallback(
    (ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => {
      if (props.shortPressed) {
        const afterLongPressEndedIntervalMs = props.shortPressed(ev, coords);

        if (afterLongPressEndedIntervalMs > 0) {
          afterLongPressEndedTimeoutIdRef.current = setTimeout(
            longPressDelayedEnd,
            afterLongPressEndedIntervalMs
          );
        }
      }
    },
    []
  );

  const shortPressDelayedEnd = React.useCallback(() => {
    if (props.shortPressDelayedEnd) {
      props.shortPressDelayedEnd();
    }
  }, []);

  const onAfterLongPressInterval = React.useCallback(() => {
    if (props.afterLongPressStarted) {
      props.afterLongPressStarted();
    }
  }, []);

  const onAfterLongPressLoopInterval = React.useCallback(() => {
    if (props.afterLongPressLoop) {
      props.afterLongPressLoop();
    }
  }, []);

  const onAfterLongPressLoopBreak = React.useCallback(() => {
    const btnElem = btnElRef.current;

    if (btnElem) {
      clearAll(btnElem);
    }

    if (props.afterLongPressLoopBreak) {
      props.afterLongPressLoopBreak();
    }

    longPressEnded(null, null);
  }, [btnElRef]);

  const longPressEnded = React.useCallback(
    (ev: TouchEvent | MouseEvent | null, coords: TouchOrMouseCoords | null) => {
      if (props.longPressEnded) {
        const afterLongPressEndedIntervalMs = props.longPressEnded(ev, coords);

        if (afterLongPressEndedIntervalMs > 0) {
          afterLongPressEndedTimeoutIdRef.current = setTimeout(
            longPressDelayedEnd,
            afterLongPressEndedIntervalMs
          );
        }
      }
    },
    []
  );

  const longPressDelayedEnd = React.useCallback(() => {
    if (props.afterLongPressDelayedEnd) {
      props.afterLongPressDelayedEnd();
    }
  }, []);

  const unregisterAll = React.useCallback(
    (btnElem: HTMLElement | null | undefined) => {
      btnElem ??= btnElRef.current;

      if (btnElem) {
        clearAll(btnElem);
        btnElem.removeEventListener("mousedown", onTouchStartOrMouseDown);
        btnElem.removeEventListener("touchstart", onTouchStartOrMouseDown);
      }
    },
    [btnElRef]
  );

  const clearAll = React.useCallback((btnElem: HTMLElement) => {
    if (btnElem) {
      clearTimeoutIfReq(longPressTimeoutIdRef);
      clearTimeoutIfReq(afterLongPressTimeoutIdRef);
      clearIntervalIfReq(afterLongPressLoopIntervalIdRef);
      clearTimeoutIfReq(afterLongPressLoopTimeoutIdRef);
      clearTimeoutIfReq(afterLongPressEndedTimeoutIdRef);
      document.removeEventListener("mouseup", onTouchEndOrMouseUp, {
        capture: true,
      });

      document.removeEventListener("touchend", onTouchEndOrMouseUp, {
        capture: true,
      });

      document.removeEventListener("mousemove", onTouchOrMouseMove, {
        capture: true,
      });

      document.removeEventListener("touchmove", onTouchOrMouseMove, {
        capture: true,
      });

      longPressIntervalPassedRef.current = false;
    }
  }, []);

  const registerAll = React.useCallback(
    (btnElem: HTMLElement) => {
      btnElRef.current = btnElem;

      btnElem.addEventListener("mousedown", onTouchStartOrMouseDown);
      btnElem.addEventListener("touchstart", onTouchStartOrMouseDown);
    },
    [btnElRef]
  );

  React.useEffect(() => {
    const newPropsRequiredButtonVal = normRequiredButton(props.requiredButton);

    const newLongPressIntervalMsVal = normLongPressIntervalMs(
      props.longPressIntervalMs
    );

    const newAfterLongPressIntervalMsVal = normAfterLongPressIntervalMs(
      props.afterLongPressIntervalMs
    );

    const newAfterLongPressLoopIntervalMsVal = normAfterLongPressLoopIntervalMs(
      props.afterLongPressLoopIntervalMs
    );

    const newAfterLongPressLoopBreakIntervalMsVal =
      normAfterLongPressLoopBreakIntervalMs(
        props.afterLongPressLoopBreakIntervalMs
      );

    const newInnerBoundsRatioVal = normInnerBoundsRatio(props.innerBoundsRatio);

    const newWidthInnerBoundsRatioVal = normInnerBoundsRatio(
      props.widthInnerBoundsRatio,
      newInnerBoundsRatioVal
    );

    const newHeightInnerBoundsRatioVal = normInnerBoundsRatio(
      props.heightInnerBoundsRatio,
      newInnerBoundsRatioVal
    );

    const setNewPropsRequiredButtonVal =
      newPropsRequiredButtonVal !== propsRequiredButton;

    const setNewLongPressIntervalMsVal =
      newLongPressIntervalMsVal !== propsLongPressIntervalMs;

    const setNewAfterLongPressIntervalMsVal =
      newAfterLongPressIntervalMsVal !== propsAfterLongPressIntervalMs;

    const setNewAfterLongPressLoopIntervalMsVal =
      newAfterLongPressLoopIntervalMsVal !== propsAfterLongPressLoopIntervalMs;

    const setNewAfterLongPressLoopBreakIntervalMsVal =
      newAfterLongPressLoopBreakIntervalMsVal !==
      propsAfterLongPressLoopBreakIntervalMs;

    const setNewInnerBoundsRatioVal =
      newInnerBoundsRatioVal !== propsInnerBoundsRatio;

    const setNewWidthInnerBoundsRatioVal =
      newWidthInnerBoundsRatioVal !== propsWidthInnerBoundsRatio;

    const setNewHeightInnerBoundsRatioVal =
      newHeightInnerBoundsRatioVal !== propsHeightInnerBoundsRatio;

    if (setNewPropsRequiredButtonVal) {
      setPropsRequiredButton(newPropsRequiredButtonVal);
      setRequiredButton(newPropsRequiredButtonVal);
    }

    if (setNewLongPressIntervalMsVal) {
      setPropsLongPressIntervalMs(newLongPressIntervalMsVal);
      setLongPressIntervalMs(newLongPressIntervalMsVal);
    }

    if (setNewAfterLongPressIntervalMsVal) {
      setPropsAfterLongPressIntervalMs(newAfterLongPressIntervalMsVal);
      setAfterLongPressIntervalMs(newAfterLongPressIntervalMsVal);
    }

    if (setNewAfterLongPressLoopIntervalMsVal) {
      setPropsAfterLongPressLoopIntervalMs(newAfterLongPressLoopIntervalMsVal);
      setAfterLongPressLoopIntervalMs(newAfterLongPressLoopIntervalMsVal);
    }

    if (setNewAfterLongPressLoopBreakIntervalMsVal) {
      setPropsAfterLongPressLoopBreakIntervalMs(
        newAfterLongPressLoopBreakIntervalMsVal
      );

      setAfterLongPressLoopBreakIntervalMs(
        newAfterLongPressLoopBreakIntervalMsVal
      );
    }

    if (setNewInnerBoundsRatioVal) {
      setPropsInnerBoundsRatio(newInnerBoundsRatioVal);
      setInnerBoundsRatio(newInnerBoundsRatioVal);
    }

    if (setNewWidthInnerBoundsRatioVal) {
      setPropsWidthInnerBoundsRatio(newWidthInnerBoundsRatioVal);
      setWidthInnerBoundsRatio(newWidthInnerBoundsRatioVal);
    }

    if (setNewHeightInnerBoundsRatioVal) {
      setPropsHeightInnerBoundsRatio(newHeightInnerBoundsRatioVal);
      setHeightInnerBoundsRatio(newHeightInnerBoundsRatioVal);
    }
  }, [
    propsRequiredButton,
    propsLongPressIntervalMs,
    propsAfterLongPressIntervalMs,
    propsAfterLongPressLoopIntervalMs,
    propsAfterLongPressLoopBreakIntervalMs,
    propsInnerBoundsRatio,
    propsWidthInnerBoundsRatio,
    propsHeightInnerBoundsRatio,
    requiredButton,
    longPressIntervalMs,
    afterLongPressIntervalMs,
    afterLongPressLoopIntervalMs,
    afterLongPressLoopBreakIntervalMs,
    innerBoundsRatio,
    widthInnerBoundsRatio,
    heightInnerBoundsRatio,
  ]);

  const retObj: UseLongPressResult = {
    registerAll,
    unregisterAll,
  };

  return retObj;
}
