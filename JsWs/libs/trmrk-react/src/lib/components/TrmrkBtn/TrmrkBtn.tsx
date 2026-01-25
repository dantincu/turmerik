'use client';

import React from "react";

import "./TrmrkBtn.scss";

import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";

import { ComponentProps } from "../defs/common";
import { HOCArgs } from "../defs/HOC";
import { clearRefVal } from "../../services/utils";

export interface TrmrkBtnProps<T extends React.ElementType = "button",
  TRootHtmlElement extends HTMLElement = HTMLButtonElement> extends ComponentProps, React.HTMLAttributes<TRootHtmlElement> {
  hoc?: HOCArgs<T, TRootHtmlElement> | NullOrUndef,
  borderWidth?: number | NullOrUndef;
}

export default function TrmrkBtn<T extends React.ElementType = "button",
  TRootHtmlElement extends HTMLElement = HTMLButtonElement>(
  { cssClass, children, onClick, onContextMenu, hoc, borderWidth, onPointerDown, ...props }: Readonly<TrmrkBtnProps<T, TRootHtmlElement>>
) {
  const rootElRef = hoc?.rootElRef ?? React.useRef<TRootHtmlElement | null>(null);
  
  const component = React.useMemo(() => hoc?.node ?? ((hocArgs: HOCArgs<T, TRootHtmlElement>) => (props: React.ComponentPropsWithRef<T>) => <button
    {...props} ref={hocArgs.rootElRef}>{props.children}</button>), [hoc?.node, hoc?.rootElRef]);

  const Button = React.useMemo(() => component({...(hoc ?? {}), node: component, rootElRef}) as React.ElementType, [hoc?.node, hoc?.rootElRef]);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleOnPointerDown = React.useCallback((e: React.PointerEvent<TRootHtmlElement>) => {
    const btnElem = e.currentTarget as TRootHtmlElement;
    btnElem.classList.add('trmrk-btn-pressed');

    timeoutRef.current = setTimeout(() => {
      btnElem.classList.remove('trmrk-btn-pressed');
      timeoutRef.current = null;
    }, 200);

    actWithValIf(onPointerDown, f => f(e));
  }, []);

  React.useEffect(() => {
    const btnElem = rootElRef!.current;
    actWithValIf(hoc?.rootElAvailable, f => f(btnElem));

    return () => {
      clearRefVal(timeoutRef, clearTimeout);
      btnElem?.classList.remove('trmrk-btn-pressed');
      actWithValIf(hoc?.rootElUnavailable, f => f(btnElem));
    };
  }, []);

  return (
    <Button {...props} className={['trmrk-btn', ((borderWidth ?? null) !== null ? `trmrk-border trmrk-border-${borderWidth}px` : ''), cssClass ?? ''].join(' ')}
      onPointerDown={handleOnPointerDown} onClick={onClick} onContextMenu={onContextMenu}
    >{children}<div className="trmrk-btn-overlay"></div></Button>
  );
}
