import React from "react";
import { PrimitiveAtom, useAtom } from "jotai";

import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";
import { PointerDragEvent } from "@/src/trmrk-browser/domUtils/PointerDragService";

import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import TrmrkResizeObservable, { ResizeCallbackArgs } from "../TrmrkResizeObservable/TrmrkResizeObservable";
import TrmrkPointerDraggable from "../TrmrkPointerDraggable/TrmrkPointerDraggable";
import { updateFwdRef, updateRef } from "../../services/utils";

import "./TrmrkScrollBar.scss";

export interface TrmrkScrollbarThumbPosition {
  ratio: number;
  px: number;
  trackLengthPx: number;
}

export interface TrmrkScrollBarProps {
  cssClass?: string | NullOrUndef;
  isHorizontal?: boolean | NullOrUndef;
  position: PrimitiveAtom<TrmrkScrollbarThumbPosition>;
  onThumbDrag?: ((pos: TrmrkScrollbarThumbPosition) => void) | NullOrUndef;
  onThumbDragEnd?: ((pos: TrmrkScrollbarThumbPosition) => void) | NullOrUndef;
}

export default function TrmrkScrollBar({
  cssClass,
  isHorizontal,
  position,
  onThumbDrag,
  onThumbDragEnd
}: TrmrkScrollBarProps) {
  const [positionVal, setPositionVal] = useAtom(position);

  const trackElRef = React.useRef<HTMLElement>(null);
  const thumbElRef = React.useRef<HTMLButtonElement>(null);
  const thumbElPosRef = React.useRef<TrmrkScrollbarThumbPosition>(null);

  const containerElSizeChanged = React.useCallback((scrollbarTrackEl: HTMLElement | null, rszArgs: ResizeCallbackArgs | null) => {
  }, [isHorizontal]);
  
  const thumbBtnNode = React.useCallback((
    props: {}, ref: React.ForwardedRef<HTMLButtonElement>) => <TrmrkBtn
      {...props} ref={el => {
        updateRef(thumbElRef, el);
        updateFwdRef(ref, el);
      }} className="trmrk-scrollbar-thumb" style={isHorizontal ? {
        left: `${positionVal.px}px`
      } : {
        top: `${positionVal.px}px`
      }}></TrmrkBtn>, []);

  const onThumbElDrag = React.useCallback((event: PointerDragEvent) => {
    const trackEl = trackElRef.current;
    const thumbEl = thumbElRef.current;

    if (trackEl && thumbEl) {
      const thumbPos = {
        px: isHorizontal ? event.event.screenX - event.pointerDownEvent.screenX : event.event.screenY - event.event.screenY,
        trackLengthPx: isHorizontal ? trackEl.offsetWidth : trackEl.offsetHeight
      } as TrmrkScrollbarThumbPosition;

      thumbPos.px = Math.max(0, Math.min(thumbPos.trackLengthPx - thumbEl.offsetWidth));
      thumbPos.ratio = thumbPos.px / thumbPos.trackLengthPx;

      if (isHorizontal) {
        thumbEl.style.left = `${thumbPos.px}px`;
      } else {
        thumbEl.style.top = `${thumbPos.px}px`;
      }

      thumbElPosRef.current = thumbPos;
      actWithValIf(onThumbDrag, f => f(thumbPos));
    }
  }, []);

  const onThumbElDragEnd = React.useCallback((event: PointerDragEvent) => {
    const thumbEl = thumbElRef.current;
    const thumbElPos = thumbElPosRef.current;

    if (thumbEl && thumbElPos) {
      setPositionVal(thumbElPos);
      actWithValIf(onThumbDragEnd, f => f(thumbElPos));
    }
  }, []);

  return <div className={
      ["trmrk-scrollbar-container",
        isHorizontal ? "trmrk-is-horizontal" : "trmrk-is-vertical",
        cssClass ?? ""].join(" ")}>
    <TrmrkBtn><TrmrkIcon icon="" /></TrmrkBtn>
    <TrmrkResizeObservable className="trmrk-scrollbar-track" resized={containerElSizeChanged}>
      <TrmrkPointerDraggable args={{
          drag: onThumbElDrag,
          dragEnd: onThumbElDragEnd
        }} hoc={{node: thumbBtnNode, props: {}}} />
    </TrmrkResizeObservable>
    <TrmrkBtn><TrmrkIcon icon="" /></TrmrkBtn>
  </div>;
}
