'use client';

import React from "react";

import "./TrmrkBtn.scss";

import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";

import { ComponentProps } from "../defs/common";
import { HOCArgs } from "../defs/HOC";
import { clearRefVal } from "../../services/utils";

export interface TrmrkBtnProps<T extends React.ElementType = "button",
  TRootHtmlElement extends HTMLElement = HTMLButtonElement> extends ComponentProps {
  onClick?: ((event: PointerEvent) => void) | NullOrUndef;
  hoc?: HOCArgs<T, TRootHtmlElement> | NullOrUndef,
  borderWidth?: number | NullOrUndef;
}

export default function TrmrkBtn<T extends React.ElementType = "button",
  TRootHtmlElement extends HTMLElement = HTMLButtonElement>(
  { cssClass, children, onClick, hoc, borderWidth }: Readonly<TrmrkBtnProps<T, TRootHtmlElement>>
) {
  const rootElRef = hoc?.rootElRef ?? React.useRef<TRootHtmlElement | null>(null);

  const component = React.useMemo(() => hoc?.component ?? ((hocArgs: HOCArgs<T, TRootHtmlElement>) => (props: React.ComponentPropsWithRef<T>) => <button
    {...props} ref={hocArgs.rootElRef}>{props.children}</button>), [hoc?.component, hoc?.rootElRef]);

  const Button = React.useMemo(() => component({...(hoc ?? {}), component, rootElRef}) as React.ElementType, [hoc?.component, hoc?.rootElRef]);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const onPointerDown = (e: PointerEvent) => {
    const btnElem = e.currentTarget as TRootHtmlElement;
    btnElem.classList.add('trmrk-btn-pressed');

    timeoutRef.current = setTimeout(() => {
      btnElem.classList.remove('trmrk-btn-pressed');
      timeoutRef.current = null;
    }, 200);
  }

  React.useEffect(() => {
    const btnElem = rootElRef!.current;
    btnElem?.addEventListener("pointerdown", onPointerDown);
    actWithValIf(hoc?.rootElAvailable, f => f(btnElem));

    return () => {
      btnElem?.removeEventListener("pointerdown", onPointerDown);
      clearRefVal(timeoutRef, clearTimeout);
      btnElem?.classList.remove('trmrk-btn-pressed');
      actWithValIf(hoc?.rootElUnavailable, f => f(btnElem));
    };
  }, []);

  return (
    <Button className={['trmrk-btn', ((borderWidth ?? null) !== null ? `trmrk-border trmrk-border-${borderWidth}px` : ''), cssClass ?? ''].join(' ')}
      onPointerDown={onPointerDown} onClick={onClick}
    >{children}<div className="trmrk-btn-overlay"></div></Button>
  );
}
