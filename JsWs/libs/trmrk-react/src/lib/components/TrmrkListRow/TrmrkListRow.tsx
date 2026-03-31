'use client';

import React from "react";

import "./TrmrkListRow.scss";

import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";

import { clearRefVal, updateRef } from "../../services/utils";

export interface TrmrkListRowProps extends React.ComponentPropsWithRef<'div'> {
  borderWidth?: number | NullOrUndef;
  tagName?: React.ElementType | NullOrUndef;
}

const TrmrkListRow = (React.forwardRef<HTMLDivElement, TrmrkListRowProps>(({ className, children, borderWidth, onPointerDown, tagName, ...props }, ref) => {
  const rootElRef = React.useRef<HTMLDivElement | null>(null);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const [ showIsPressedCssClass, setShowIsPressedCssClass ] = React.useState(false);

  const handleOnPointerDown = React.useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    setShowIsPressedCssClass(true);
  
    timeoutRef.current = setTimeout(() => {
      setShowIsPressedCssClass(false);
      timeoutRef.current = null;
    }, 200);
  
    actWithValIf(onPointerDown, (f) => f(e));
  }, []);

  const refElAvailable = React.useCallback((el: HTMLDivElement | null) => {
    rootElRef.current = el;
    actWithValIf(ref, (r) => updateRef(r, el));
  }, []);

  React.useEffect(() => {
    return () => {
      clearRefVal(timeoutRef, clearTimeout);
    };
  }, []);

  const Component = tagName ?? 'li';

  return (
    <Component {...props} ref={refElAvailable} className={[
        'trmrk-list-row',
        showIsPressedCssClass ? 'trmrk-row-pressed' : '',
        ((borderWidth ?? null) !== null ? `trmrk-border trmrk-border-${borderWidth}px` : ''),
        className ?? ''
      ].join(' ')}
      onPointerDown={handleOnPointerDown}
    ><div className="trmrk-btn-content">{children}</div><div className="trmrk-btn-overlay"></div></Component>
  );
}));

export default TrmrkListRow;
export const TrmrkListRowMM = React.memo(TrmrkListRow);
