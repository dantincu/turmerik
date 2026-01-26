'use client';

import React from "react";

import "./TrmrkBtn.scss";

import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";

import { clearRefVal, updateRef } from "../../services/utils";
import { ComponentProps } from "../defs/common";

export interface TrmrkBtnProps extends React.ComponentPropsWithRef<'button'>, ComponentProps {
  borderWidth?: number | NullOrUndef;
}

const TrmrkBtn = React.memo(React.forwardRef<HTMLButtonElement, TrmrkBtnProps>(({ className, children, borderWidth, onPointerDown, ...props }, ref) => {
  const rootElRef = React.useRef<HTMLButtonElement | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOnPointerDown = React.useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const btnElem = e.currentTarget;
    btnElem.classList.add('trmrk-btn-pressed');

    timeoutRef.current = setTimeout(() => {
      btnElem.classList.remove('trmrk-btn-pressed');
      timeoutRef.current = null;
    }, 200);

    actWithValIf(onPointerDown, f => f(e));
  }, []);

  const refElAvailable = React.useCallback((el: HTMLButtonElement | null) => {
    rootElRef.current = el;
    actWithValIf(ref, r => updateRef(r, el));
  }, []);

  React.useEffect(() => {
    const btnElem = rootElRef!.current;

    return () => {
      clearRefVal(timeoutRef, clearTimeout);
      btnElem?.classList.remove('trmrk-btn-pressed');
    };
  }, []);

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
