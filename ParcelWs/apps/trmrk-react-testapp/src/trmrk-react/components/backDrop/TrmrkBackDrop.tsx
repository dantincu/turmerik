import React from "react";

import { TouchOrMouseCoords, getSingleTouchOrClick } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

export interface TrmrkBackDropProps {
  className?: string | null | undefined;
  preventDefaultOnTouchOrMouseEvts?: boolean | null | undefined;
  requiredButton?: number | null | undefined;
  children?: React.ReactNode | null | undefined;
  onElem?: ((elem: HTMLElement | null) => void) | null | undefined;
  onTouchStartOrMouseDown?: ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onTouchOrMouseMove?: ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => void) | null | undefined; 
  onTouchEndOrMouseUp?: ((ev: TouchEvent | MouseEvent, coords: TouchOrMouseCoords) => void) | null | undefined; 
}

export const normalizePreventDefaultOnTouchOrMouseEvts = (
  cancelDefaultOnTouchOrMouseEvts: boolean | null | undefined) => cancelDefaultOnTouchOrMouseEvts ?? false;

export const normalizeRequiredButton = (
  requiredButton: number | null | undefined) => requiredButton ?? 0;

export default function TrmrkBackDrop(props: TrmrkBackDropProps) {
  const elRef = React.useRef<HTMLElement | null>(null);

  const [ className, setClassName ] = React.useState(props.className ?? "");

  const [ preventDefaultOnTouchOrMouseEvts, setPreventDefaultOnTouchOrMouseEvts ] = React.useState(
    normalizePreventDefaultOnTouchOrMouseEvts(props.preventDefaultOnTouchOrMouseEvts));

  const [ requiredButton, setRequiredButton ] = React.useState(
    normalizeRequiredButton(props.requiredButton));

  React.useEffect(() => {
    const el = elRef.current;
    const newClassNamePropsVal = props.className ?? "";
    const newPreventDefaultOnTouchOrMouseEvtsPropsVal = normalizePreventDefaultOnTouchOrMouseEvts(props.preventDefaultOnTouchOrMouseEvts);
    const newRequiredButtonPropsVal = normalizeRequiredButton(props.requiredButton);

    if (newClassNamePropsVal !== className) {
      setClassName(newClassNamePropsVal);
    }

    if (newPreventDefaultOnTouchOrMouseEvtsPropsVal !== preventDefaultOnTouchOrMouseEvts) {
      setPreventDefaultOnTouchOrMouseEvts(preventDefaultOnTouchOrMouseEvts);
    }

    if (newRequiredButtonPropsVal !== requiredButton) {
      setRequiredButton(newRequiredButtonPropsVal);
    }

    if (props.onElem) {
      props.onElem(el);
    }

    const onTouchStartOrMouseDown = (ev: TouchEvent | MouseEvent) => {
      if (preventDefaultOnTouchOrMouseEvts) {
        ev.preventDefault();
      }

      const coords = getSingleTouchOrClick(ev, requiredButton);

      if (coords && props.onTouchStartOrMouseDown) {
        props.onTouchStartOrMouseDown(ev, coords);
      }
    };

    const onTouchOrMouseMove = (ev: TouchEvent | MouseEvent) => {
      if (preventDefaultOnTouchOrMouseEvts) {
        ev.preventDefault();
      }

      const coords = getSingleTouchOrClick(ev, requiredButton);

      if (coords && props.onTouchOrMouseMove) {
        props.onTouchOrMouseMove(ev, coords);
      }
    };

    const onTouchEndOrMouseUp = (ev: TouchEvent | MouseEvent) => {
      if (preventDefaultOnTouchOrMouseEvts) {
        ev.preventDefault();
      }

      const coords = getSingleTouchOrClick(ev, requiredButton);

      if (coords && props.onTouchEndOrMouseUp) {
        props.onTouchEndOrMouseUp(ev, coords);
      }
    };
    
    if (el) {
      el.addEventListener("touchstart", onTouchStartOrMouseDown, { capture: true });
      el.addEventListener("mousedown", onTouchStartOrMouseDown, { capture: true });
      el.addEventListener("touchmove", onTouchOrMouseMove, { capture: true });
      el.addEventListener("mousemove", onTouchOrMouseMove, { capture: true });
      el.addEventListener("touchend", onTouchEndOrMouseUp, { capture: true });
      el.addEventListener("mouseup", onTouchEndOrMouseUp, { capture: true });
    }
    
    if (el) {
      return () => {
        el.removeEventListener("touchstart", onTouchStartOrMouseDown, { capture: true });
        el.removeEventListener("mousedown", onTouchStartOrMouseDown, { capture: true });
        el.removeEventListener("touchmove", onTouchOrMouseMove, { capture: true });
        el.removeEventListener("mousemove", onTouchOrMouseMove, { capture: true });
        el.removeEventListener("touchend", onTouchEndOrMouseUp, { capture: true });
        el.removeEventListener("mouseup", onTouchEndOrMouseUp, { capture: true });
      };
    }
  }, [
    props.className,
    props.preventDefaultOnTouchOrMouseEvts,
    props.requiredButton,
    props.children,
    className,
    preventDefaultOnTouchOrMouseEvts,
    requiredButton
  ]);

  return (<div className={["trmrk-backdrop", className ?? ""].join(" ")} ref={el => elRef.current = el}>
    { props.children }
  </div>);
}
