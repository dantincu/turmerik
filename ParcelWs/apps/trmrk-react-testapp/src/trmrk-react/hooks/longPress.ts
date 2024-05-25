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
    | ((
        ev: TouchEvent | MouseEvent,
        coords: TouchOrMouseCoords | null
      ) => ValueOrAnyOrVoid<boolean>)
    | null
    | undefined;
  shortPressed?:
    | ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void)
    | null
    | undefined;
  longPressStarted?: (() => void) | null | undefined;
  longPressEnded?:
    | ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords | null) => void)
    | null
    | undefined;
  afterLongPressLoop?: (() => void) | null | undefined;
  afterLongPressLoopTimeout?: (() => void) | null | undefined;
}

export interface UseLongPressResult {
  dispose: () => void;
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
    [btnElem, requiredButton, longPressIntervalMs, longPressTimeoutIdRef]
  );

  const onTouchEndOrMouseUpOrTouchOrMouseMove = React.useCallback(
    (ev: TouchEvent | MouseEvent, isMouseMove: boolean) => {
      if (btnElem) {
        const coords = getSingleTouchOrClick(ev);
        let $continue: ValueOrAnyOrVoid<boolean> = null;

        if (isMouseMove) {
          if (props.touchOrMouseMove) {
            $continue = props.touchOrMouseMove(ev, coords);
          }
        } else {
          if (props.touchEndOrMouseUp) {
            props.touchEndOrMouseUp(ev, coords);
          }
        }

        if ($continue !== false) {
          clearTimeoutIfReq(longPressTimeoutIdRef);
          clearIntervalIfReq(afterLongPressLoopIntervalIdRef);
          clearTimeoutIfReq(afterLongPressLoopTimeoutIdRef);

          btnElem.removeEventListener("mouseup", onTouchEndOrMouseUp);
          btnElem.removeEventListener("touchend", onTouchEndOrMouseUp);
          btnElem.removeEventListener("mousemove", onTouchOrMouseMove);
          btnElem.removeEventListener("touchmove", onTouchOrMouseMove);

          if ((!isMouseMove && coords) || $continue === true) {
            if (longPressIntervalPassedRef.current) {
              if (props.longPressEnded) {
                props.longPressEnded(ev, coords);
              }
            } else {
              if (props.shortPressed) {
                props.shortPressed(ev, coords);
              }
            }
          }

          longPressIntervalPassedRef.current = false;
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

      if (afterLongPressLoopTimeoutMs > 0) {
        afterLongPressLoopTimeoutIdRef.current = setTimeout(
          onAfterLongPressLoopTimeout,
          afterLongPressLoopTimeoutMs
        );
      }
    }

    longPressIntervalPassedRef.current = true;
  }, [
    longPressTimeoutIdRef,
    afterLongPressLoopIntervalMs,
    longPressIntervalPassedRef,
  ]);

  const onAfterLongPressLoopInterval = React.useCallback(() => {
    if (props.afterLongPressLoop) {
      props.afterLongPressLoop();
    }
  }, []);

  const onAfterLongPressLoopTimeout = React.useCallback(() => {
    if (btnElem) {
      clearIntervalIfReq(afterLongPressLoopIntervalIdRef);
      clearTimeoutIfReq(afterLongPressLoopTimeoutIdRef);

      btnElem.removeEventListener("mouseup", onTouchEndOrMouseUp);
      btnElem.removeEventListener("touchend", onTouchEndOrMouseUp);
      btnElem.removeEventListener("mousemove", onTouchOrMouseMove);
      btnElem.removeEventListener("touchmove", onTouchOrMouseMove);

      if (props.afterLongPressLoopTimeout) {
        props.afterLongPressLoopTimeout();
      }

      longPressIntervalPassedRef.current = false;
    }
  }, [afterLongPressLoopIntervalIdRef, afterLongPressLoopTimeoutIdRef]);

  const dispose = React.useCallback(() => {
    if (btnElem) {
      btnElem.removeEventListener("mousedown", onTouchStartOrMouseDown);
      btnElem.removeEventListener("touchstart", onTouchStartOrMouseDown);
      btnElem.removeEventListener("mouseup", onTouchEndOrMouseUp);
      btnElem.removeEventListener("touchend", onTouchEndOrMouseUp);
      btnElem.removeEventListener("mousemove", onTouchOrMouseMove);
      btnElem.removeEventListener("touchmove", onTouchOrMouseMove);
    }
  }, [
    props.requiredButton,
    props.btnElem,
    propsRequiredButton,
    propsBtnElem,
    propsLongPressIntervalMs,
    propsAfterLongPressLoopIntervalMs,
    requiredButton,
    btnElem,
    longPressIntervalMs,
    afterLongPressLoopIntervalMs,
    longPressIntervalPassedRef,
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
        dispose();
      };
    }
  }, [
    props.requiredButton,
    props.btnElem,
    propsRequiredButton,
    propsBtnElem,
    propsLongPressIntervalMs,
    propsAfterLongPressLoopIntervalMs,
    requiredButton,
    btnElem,
    longPressIntervalMs,
    afterLongPressLoopIntervalMs,
    longPressIntervalPassedRef,
  ]);

  const retObj: UseLongPressResult = {
    dispose,
  };

  return retObj;
}
