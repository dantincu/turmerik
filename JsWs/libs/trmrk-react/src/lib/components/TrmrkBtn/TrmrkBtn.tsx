'use client';

import React from "react";

import "./TrmrkBtn.scss";

import { NullOrUndef } from "@/src/trmrk/core";

import { effectCallback, handleOnPointerDownFunc, refElAvailableFunc } from "./TrmrkBtnService";
import { ComponentProps } from "../defs/common";

export interface TrmrkBtnProps extends React.ComponentPropsWithRef<'button'>, ComponentProps {
  borderWidth?: number | NullOrUndef;
}

const TrmrkBtn = React.memo(React.forwardRef<HTMLButtonElement, TrmrkBtnProps>(({ className, children, borderWidth, onPointerDown, ...props }, ref) => {
  const rootElRef = React.useRef<HTMLButtonElement | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOnPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => handleOnPointerDownFunc(e, timeoutRef, onPointerDown), []);

  const refElAvailable = React.useCallback(
    (el: HTMLButtonElement | null) => refElAvailableFunc(el, rootElRef, ref), []);

  React.useEffect(() => effectCallback(rootElRef, timeoutRef), []);

  return (
    <button {...props} ref={refElAvailable} className={[
        'trmrk-btn',
        ((borderWidth ?? null) !== null ? `trmrk-border trmrk-border-${borderWidth}px` : ''),
        className ?? ''
      ].join(' ')}
      onPointerDown={handleOnPointerDown}
    >{children}<div className="trmrk-btn-overlay"></div></button>
  );
}));

export default TrmrkBtn;
