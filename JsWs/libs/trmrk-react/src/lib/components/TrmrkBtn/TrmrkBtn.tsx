'use client';

import React from "react";

import "./TrmrkBtn.scss";

import { NullOrUndef } from "@/src/trmrk/core";

import { CommponentProps } from "../defs/common";
import { HOCArgs, normalizeHoc } from "../defs/HOC";
import { clearRefVal } from "../defs/utils";

export interface TrmrkBtnProps<T extends React.ElementType = "button",
  TRootHtmlElement extends HTMLElement = HTMLButtonElement> extends CommponentProps {
  hoc?: HOCArgs<T, TRootHtmlElement> | NullOrUndef,
  borderWidth?: number | NullOrUndef;
}

export default function TrmrkBtn<T extends React.ElementType = "button",
  TRootHtmlElement extends HTMLElement = HTMLButtonElement>(
  { cssClass, children, hoc, borderWidth }: Readonly<TrmrkBtnProps<T, TRootHtmlElement>>
) {
  const hocArgs = normalizeHoc(hoc, () => (props) => <button
    {...props} ref={hocArgs.rootElRef}>{props.children}</button>);

  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const onPointerDown = (e: PointerEvent) => {
    const btnElem = e.currentTarget as TRootHtmlElement;
    btnElem.classList.add('trmrk-btn-pressed');

    timeoutRef.current = setTimeout(() => {
      btnElem.classList.remove('trmrk-btn-pressed');
      timeoutRef.current = null;
    }, 200);
  }

  const Button = hocArgs.component(hocArgs) as React.ElementType;

  React.useEffect(() => {
    const btnElem = hocArgs.rootElRef.current;
    btnElem?.addEventListener("pointerdown", onPointerDown);

    return () => {
      btnElem?.removeEventListener("pointerdown", onPointerDown);
      clearRefVal(timeoutRef, clearTimeout);
    };
  });

  return (
    <Button className={['trmrk-btn', ((borderWidth ?? null) !== null ? `trmrk-border trmrk-border-${borderWidth}px` : ''), cssClass ?? ''].join(' ')}
      onPointerDown={onPointerDown}
    >{children}<div className="trmrk-btn-overlay"></div></Button>
  );
}
