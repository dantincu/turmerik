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
export const AFTER_LONG_PRESS_LOOP_INTERVAL_MS = 100;
export const AFTER_LONG_PRESS_LOOP_TIMEOUT_MS = 30 * 1000;

export interface UseLongPressProps {
  btnElem: HTMLElement | null;
  requiredButton?: number | null | undefined;
  longPressIntervalMs?: number | null | undefined;
  afterLongPressLoopIntervalMs?: number | null | undefined;
  afterLongPressLoopTimeoutMs?: number | null | undefined;
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
    | ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void)
    | null
    | undefined;
  longPressStarted?: (() => void) | null | undefined;
  longPressEnded?:
    | ((
        ev: TouchEvent | MouseEvent | null,
        coords: TouchOrMouseCoords | null
      ) => void)
    | null
    | undefined;
  afterLongPressLoop?: (() => void) | null | undefined;
  afterLongPressLoopTimeout?: (() => void) | null | undefined;
}

export interface UseLongPressResult {
  clearAll: () => void;
}

export const normRequiredButton = (requiredButton: number | null | undefined) =>
  requiredButton ?? 0;

export const normLongPressIntervalMs = (
  longPressIntervalMs: number | null | undefined
) => longPressIntervalMs ?? LONG_PRESS_INTERVAL_MS;

export const normAfterLongPressLoopIntervalMs = (
  afterLongPressLoopIntervalMs: number | null | undefined
) => afterLongPressLoopIntervalMs ?? -1;

export const normAfterLongPressLoopTimeoutMs = (
  afterLongPressLoopTimeoutMs: number | null | undefined
) => afterLongPressLoopTimeoutMs ?? -1;

export const touchIsOutOfBounds = (
  elem: HTMLElement,
  ev: TouchEvent | MouseEvent,
  coords: TouchOrMouseCoords,
  innerBoundsRatio: number = 0.75
) => {
  const clientRectangle = elem.getBoundingClientRect();

  const innerRectangle = {
    width: Math.round(innerBoundsRatio * clientRectangle.width),
    height: Math.round(innerBoundsRatio * clientRectangle.height),
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

  const [propsBtnElem, setPropsBtnElem] = React.useState(props.btnElem);

  const [propsLongPressIntervalMs, setPropsLongPressIntervalMs] =
    React.useState(normLongPressIntervalMs(props.longPressIntervalMs));

  const [
    propsAfterLongPressLoopIntervalMs,
    setPropsAfterLongPressLoopIntervalMs,
  ] = React.useState(
    normAfterLongPressLoopIntervalMs(props.afterLongPressLoopIntervalMs)
  );

  const [
    propsAfterLongPressLoopTimeoutMs,
    setPropsAfterLongPressLoopTimeoutMs,
  ] = React.useState(
    normAfterLongPressLoopTimeoutMs(props.afterLongPressLoopTimeoutMs)
  );

  const [requiredButton, setRequiredButton] =
    React.useState(propsRequiredButton);

  const [btnElem, setBtnElem] = React.useState(props.btnElem);

  const [longPressIntervalMs, setLongPressIntervalMs] = React.useState(
    propsLongPressIntervalMs
  );

  const [afterLongPressLoopIntervalMs, setAfterLongPressLoopIntervalMs] =
    React.useState(propsAfterLongPressLoopIntervalMs);

  const [afterLongPressLoopTimeoutMs, setAfterLongPressLoopTimeoutMs] =
    React.useState(propsAfterLongPressLoopTimeoutMs);

  const longPressTimeoutIdRef = React.useRef<NodeJS.Timeout | null>(null);

  const afterLongPressLoopIntervalIdRef = React.useRef<NodeJS.Timeout | null>(
    null
  );

  const afterLongPressLoopTimeoutIdRef = React.useRef<NodeJS.Timeout | null>(
    null
  );

  const longPressIntervalPassedRef = React.useRef(false);

  const onTouchStartOrMouseDown = React.useCallback(
    (ev: TouchEvent | MouseEvent) => {
      clearAllCore();
      if (btnElem) {
        const coords = getSingleTouchOrClick(ev);

        if (coords) {
          let $continue: ValueOrAnyOrVoid<boolean> = null;

          if (props.touchStartOrMouseDown) {
            $continue = props.touchStartOrMouseDown(ev, coords);
          }

          if ($continue !== false) {
            btnElem.addEventListener("mouseup", onTouchEndOrMouseUp);
            btnElem.addEventListener("touchend", onTouchEndOrMouseUp);
            btnElem.addEventListener("mousemove", onTouchOrMouseMove);
            btnElem.addEventListener("touchmove", onTouchOrMouseMove);

            longPressTimeoutIdRef.current = setTimeout(
              onLongPressIntervalPassed,
              longPressIntervalMs
            );
          }
        }
      }
    },
    [
      props.requiredButton,
      props.btnElem,
      propsRequiredButton,
      propsBtnElem,
      propsLongPressIntervalMs,
      propsAfterLongPressLoopIntervalMs,
      propsAfterLongPressLoopTimeoutMs,
      requiredButton,
      btnElem,
      longPressIntervalMs,
      afterLongPressLoopIntervalMs,
      afterLongPressLoopTimeoutMs,
    ]
  );

  const onTouchEndOrMouseUpOrTouchOrMouseMove = React.useCallback(
    (ev: TouchEvent | MouseEvent, isMouseMove: boolean) => {
      if (btnElem) {
        const coords = getSingleTouchOrClick(ev);
        let $continue: boolean = !isMouseMove || !!coords;

        if (isMouseMove) {
          if (props.touchOrMouseMove) {
            props.touchOrMouseMove(ev, coords);
          }

          if (coords) {
            if (props.touchIsOutOfBoundsPredicate) {
              $continue = !props.touchIsOutOfBoundsPredicate(ev, coords);
            } else {
              $continue = touchIsOutOfBounds(btnElem, ev, coords);
            }
          }
        } else {
          if (props.touchEndOrMouseUp) {
            props.touchEndOrMouseUp(ev, coords);
          }
        }

        if ($continue) {
          if (longPressIntervalPassedRef.current) {
            if (props.longPressEnded) {
              props.longPressEnded(ev, coords);
            }
          } else {
            if (props.shortPressed) {
              props.shortPressed(ev, coords);
            }
          }

          clearAllCore();
        }
      }
    },
    [
      btnElem,
      requiredButton,
      longPressIntervalMs,
      afterLongPressLoopIntervalMs,
      longPressIntervalPassedRef,
    ]
  );

  const onTouchEndOrMouseUp = React.useCallback(
    (ev: TouchEvent | MouseEvent) => {
      onTouchEndOrMouseUpOrTouchOrMouseMove(ev, false);
    },
    [
      btnElem,
      requiredButton,
      longPressIntervalMs,
      afterLongPressLoopIntervalMs,
      longPressIntervalPassedRef,
    ]
  );

  const onTouchOrMouseMove = React.useCallback(
    (ev: TouchEvent | MouseEvent) => {
      onTouchEndOrMouseUpOrTouchOrMouseMove(ev, true);
    },
    [
      btnElem,
      requiredButton,
      longPressIntervalMs,
      afterLongPressLoopIntervalMs,
      longPressIntervalPassedRef,
    ]
  );

  const onLongPressIntervalPassed = React.useCallback(() => {
    clearTimeoutIfReq(longPressTimeoutIdRef);

    if (props.longPressStarted) {
      props.longPressStarted();
    }

    if (afterLongPressLoopIntervalMs > 0 && props.afterLongPressLoop) {
      afterLongPressLoopIntervalIdRef.current = setInterval(
        onAfterLongPressLoopInterval,
        afterLongPressLoopIntervalMs
      );
    }

    if (afterLongPressLoopTimeoutMs > 0) {
      afterLongPressLoopTimeoutIdRef.current = setTimeout(
        onAfterLongPressLoopTimeout,
        afterLongPressLoopTimeoutMs
      );
    }

    longPressIntervalPassedRef.current = true;
  }, [
    longPressTimeoutIdRef,
    afterLongPressLoopIntervalMs,
    afterLongPressLoopTimeoutMs,
    longPressIntervalPassedRef,
  ]);

  const onAfterLongPressLoopInterval = React.useCallback(() => {
    if (props.afterLongPressLoop) {
      props.afterLongPressLoop();
    }
  }, []);

  const onAfterLongPressLoopTimeout = React.useCallback(() => {
    clearAllCore();

    if (props.afterLongPressLoopTimeout) {
      props.afterLongPressLoopTimeout();
    }

    if (props.longPressEnded) {
      props.longPressEnded(null, null);
    }
  }, [afterLongPressLoopIntervalIdRef, afterLongPressLoopTimeoutIdRef]);

  const clearAll = React.useCallback(() => {
    if (btnElem) {
      clearAllCore();
      btnElem.removeEventListener("mousedown", onTouchStartOrMouseDown);
      btnElem.removeEventListener("touchstart", onTouchStartOrMouseDown);
    }
  }, [
    props.requiredButton,
    props.btnElem,
    propsRequiredButton,
    propsBtnElem,
    propsLongPressIntervalMs,
    propsAfterLongPressLoopIntervalMs,
    propsAfterLongPressLoopTimeoutMs,
    requiredButton,
    btnElem,
    longPressIntervalMs,
    afterLongPressLoopIntervalMs,
    afterLongPressLoopTimeoutMs,
  ]);

  const clearAllCore = React.useCallback(() => {
    if (btnElem) {
      clearTimeoutIfReq(longPressTimeoutIdRef);
      clearIntervalIfReq(afterLongPressLoopIntervalIdRef);
      clearTimeoutIfReq(afterLongPressLoopTimeoutIdRef);
      btnElem.removeEventListener("mouseup", onTouchEndOrMouseUp);
      btnElem.removeEventListener("touchend", onTouchEndOrMouseUp);
      btnElem.removeEventListener("mousemove", onTouchOrMouseMove);
      btnElem.removeEventListener("touchmove", onTouchOrMouseMove);
      longPressIntervalPassedRef.current = false;
    }
  }, [
    props.requiredButton,
    props.btnElem,
    propsRequiredButton,
    propsBtnElem,
    propsLongPressIntervalMs,
    propsAfterLongPressLoopIntervalMs,
    propsAfterLongPressLoopTimeoutMs,
    requiredButton,
    btnElem,
    longPressIntervalMs,
    afterLongPressLoopIntervalMs,
    afterLongPressLoopTimeoutMs,
  ]);

  React.useEffect(() => {
    const newPropsRequiredButtonVal = normRequiredButton(props.requiredButton);

    const newPropsBtnElemVal = props.btnElem;

    const newLongPressIntervalMsVal = normLongPressIntervalMs(
      props.longPressIntervalMs
    );

    const newAfterLongPressLoopIntervalMsVal = normAfterLongPressLoopIntervalMs(
      props.afterLongPressLoopIntervalMs
    );

    const newAfterLongPressLoopTimeoutMsVal = normAfterLongPressLoopIntervalMs(
      props.afterLongPressLoopTimeoutMs
    );

    const setNewPropsRequiredButtonVal =
      newPropsRequiredButtonVal !== propsRequiredButton;

    const setNewPropsBtnElemVal = newPropsBtnElemVal !== propsBtnElem;

    const setNewLongPressIntervalMsVal =
      newLongPressIntervalMsVal !== propsLongPressIntervalMs;

    const setNewAfterLongPressLoopIntervalMsVal =
      newAfterLongPressLoopIntervalMsVal !== propsAfterLongPressLoopIntervalMs;

    const setNewAfterLongPressLoopTimeoutMsVal =
      newAfterLongPressLoopTimeoutMsVal !== propsAfterLongPressLoopTimeoutMs;

    let attachHandlers = !(
      setNewPropsRequiredButtonVal ||
      setNewPropsBtnElemVal ||
      setNewLongPressIntervalMsVal ||
      setNewAfterLongPressLoopIntervalMsVal ||
      setNewAfterLongPressLoopTimeoutMsVal
    );

    if (attachHandlers) {
      if (btnElem) {
        btnElem.addEventListener("mousedown", onTouchStartOrMouseDown);
        btnElem.addEventListener("touchstart", onTouchStartOrMouseDown);
      }
    } else {
      if (setNewPropsBtnElemVal) {
        setPropsRequiredButton(newPropsRequiredButtonVal);
        setRequiredButton(newPropsRequiredButtonVal);
      }

      if (setNewPropsBtnElemVal) {
        setPropsBtnElem(newPropsBtnElemVal);
        setBtnElem(newPropsBtnElemVal);
      }

      if (setNewLongPressIntervalMsVal) {
        setPropsLongPressIntervalMs(newLongPressIntervalMsVal);
        setLongPressIntervalMs(newLongPressIntervalMsVal);
      }

      if (setNewAfterLongPressLoopIntervalMsVal) {
        setPropsAfterLongPressLoopIntervalMs(
          newAfterLongPressLoopIntervalMsVal
        );
        setAfterLongPressLoopIntervalMs(newAfterLongPressLoopIntervalMsVal);
      }

      if (setNewAfterLongPressLoopTimeoutMsVal) {
        setPropsAfterLongPressLoopTimeoutMs(newAfterLongPressLoopTimeoutMsVal);
        setAfterLongPressLoopTimeoutMs(newAfterLongPressLoopTimeoutMsVal);
      }
    }

    if (attachHandlers) {
      return () => {
        clearAll();
      };
    }
  }, [
    props.requiredButton,
    props.btnElem,
    propsRequiredButton,
    propsBtnElem,
    propsLongPressIntervalMs,
    propsAfterLongPressLoopIntervalMs,
    propsAfterLongPressLoopTimeoutMs,
    requiredButton,
    btnElem,
    longPressIntervalMs,
    afterLongPressLoopIntervalMs,
    afterLongPressLoopTimeoutMs,
  ]);

  const retObj: UseLongPressResult = {
    clearAll,
  };

  return retObj;
}
