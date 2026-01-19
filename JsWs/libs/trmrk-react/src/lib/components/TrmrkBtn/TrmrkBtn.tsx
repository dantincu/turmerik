import React from "react";

import "./TrmrkBtn.scss";

import { CommponentProps } from "../defs/common";
import { NullOrUndef } from "@/src/trmrk/core";

export interface TrmrkBtnProps extends CommponentProps<HTMLButtonElement> {
  borderWidth?: number | NullOrUndef;
  onClick?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | NullOrUndef;
  onClickCapture?: ((event: React.MouseEvent<HTMLButtonElement>) => void) | NullOrUndef;
}

export default function TrmrkBtn(
  { cssClass, rootElRef, onClick, onClickCapture, children, borderWidth }: Readonly<TrmrkBtnProps>
) {
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const btnElem = e.currentTarget;
    btnElem.classList.add('trmrk-btn-pressed');

    setTimeout(() => {
      btnElem.classList.remove('trmrk-btn-pressed');
    }, 200);
  }

  return (
    <button ref={rootElRef ?? undefined}
      className={['trmrk-btn', ((borderWidth ?? null) !== null ? `trmrk-border trmrk-border-${borderWidth}px` : ''), cssClass ?? ''].join(' ')}
      onClick={onClick ?? undefined}
      onClickCapture={onClickCapture ?? undefined}
      onPointerDown={onPointerDown}
    ><div className="trmrk-btn-overlay"></div>{children}</button>
  );
}
