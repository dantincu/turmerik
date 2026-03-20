import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";

import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";
import { PointerDragEvent } from "@/src/trmrk-browser/domUtils/PointerDragService";

import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkResizeObservable, { ResizeCallbackArgs } from "../TrmrkResizeObservable/TrmrkResizeObservable";
import TrmrkPointerDraggable from "../TrmrkPointerDraggable/TrmrkPointerDraggable";
import { updateFwdRef, updateRef } from "../../services/utils";

import "./TrmrkScrollBar.scss";
import { TouchOrMouseCoords } from "@/src/trmrk-browser/domUtils/touchAndMouseEvents";

export interface TrmrkScrollbarThumbPosition {
  ratio: number;
  px: number;
  trackLengthPx: number;
}

export interface TrmrkScrollBarProps {
  cssClass?: string | NullOrUndef;
  isHorizontal?: boolean | NullOrUndef;
  position: PrimitiveAtom<TrmrkScrollbarThumbPosition>;
  onThumbDragStart?: ((pos: TouchOrMouseCoords) => void) | NullOrUndef;
  onThumbDrag?: ((pos: TrmrkScrollbarThumbPosition) => void) | NullOrUndef;
  onThumbDragEnd?: ((pos: TrmrkScrollbarThumbPosition) => void) | NullOrUndef;
}

export default function TrmrkScrollBar({
  cssClass,
  isHorizontal,
  position,
  onThumbDragStart,
  onThumbDrag,
  onThumbDragEnd
}: TrmrkScrollBarProps) {
  const [positionVal, setPositionVal] = useAtom(position);
  const positionRef = React.useRef(positionVal);

  const trackElRef = React.useRef<HTMLElement>(null);
  const thumbElRef = React.useRef<HTMLButtonElement>(null);
  const thumbElPosRef = React.useRef<TrmrkScrollbarThumbPosition>(positionVal);

  const updatePositionCore = React.useCallback((diffPx?: number | NullOrUndef) => {
    const trackEl = trackElRef.current;
    const thumbEl = thumbElRef.current;
    let thumbPos: TrmrkScrollbarThumbPosition = {...positionRef.current};

    if (trackEl && thumbEl) {
      thumbPos.trackLengthPx = (isHorizontal ? trackEl.offsetWidth : trackEl.offsetHeight) - (isHorizontal ? thumbEl.offsetWidth : thumbEl.offsetHeight);

      if (thumbPos.trackLengthPx > 0) {
        const normalizePx = () => thumbPos.px = Math.max(
          0, Math.min(thumbPos.trackLengthPx, thumbPos.px));

        if ((diffPx ?? null) !== null) {
          thumbPos.px = thumbPos.px + diffPx!;
          normalizePx();
          thumbPos.ratio = thumbPos.px / thumbPos.trackLengthPx;
        } else {
          thumbPos.px = Math.round(thumbPos.ratio * thumbPos.trackLengthPx);
          normalizePx();
        }

        thumbElPosRef.current = thumbPos;

        if (isHorizontal) {
          thumbEl.style.left = `${thumbPos.px}px`;
        } else {
          thumbEl.style.top = `${thumbPos.px}px`;
        }
      }
    }

    return thumbPos;
  }, [isHorizontal, positionVal]);

  const updatePosition = React.useCallback(() => {
    const thumbPos = updatePositionCore();
    setPositionVal(thumbPos);
  }, [isHorizontal]);
  
  const thumbBtnNode = React.useCallback((
    props: {}, ref: React.ForwardedRef<HTMLButtonElement>) => <TrmrkBtn
      {...props} ref={el => {
        updateRef(thumbElRef, el);
        updateFwdRef(ref, el);
      }} className="trmrk-scrollbar-thumb" style={isHorizontal ? {
        left: `${positionVal.px}px`,
        top: "",
      } : {
        left: "",
        top: `${positionVal.px}px`
      }}>&nbsp;</TrmrkBtn>, [isHorizontal, positionVal]);

  const onThumbElDragStart = React.useCallback((event: TouchOrMouseCoords) => {
    actWithValIf(onThumbDragStart, f => f(event));
  }, []);

  const onThumbElDrag = React.useCallback((event: PointerDragEvent) => {
    const diffPx = isHorizontal ? event.coords.screenX - event.pointerDownCoords.screenX : event.coords.screenY - event.pointerDownCoords.screenY;
    const thumbPos = updatePositionCore(diffPx);
    actWithValIf(onThumbDrag, f => f(thumbPos));
    return thumbPos;
  }, [isHorizontal]);

  const onThumbElDragEnd = React.useCallback((event: PointerDragEvent) => {
    const thumbElPos = thumbElPosRef.current;

    if (thumbElPos) {
      setPositionVal(thumbElPos);
      actWithValIf(onThumbDragEnd, f => f(thumbElPos));
    }
  }, []);

  React.useEffect(() => {
    updatePosition();
  }, [isHorizontal]);

  React.useEffect(() => {
    positionRef.current = positionVal;
  }, [positionVal]);

  return <div className={
      ["trmrk-scrollbar-container",
        isHorizontal ? "trmrk-is-horizontal" : "trmrk-is-vertical",
        cssClass ?? ""].join(" ")}>
    <TrmrkResizeObservable ref={trackElRef} className="trmrk-scrollbar-track" resized={updatePosition}>
      <TrmrkPointerDraggable args={{
          drag: onThumbElDrag,
          dragEnd: onThumbElDragEnd,
          dragStart: onThumbElDragStart,
        }} hoc={{node: thumbBtnNode, props: {}}} />
    </TrmrkResizeObservable>
  </div>;
}
