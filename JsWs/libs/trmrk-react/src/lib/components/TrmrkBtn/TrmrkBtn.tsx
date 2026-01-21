import React from "react";

import "./TrmrkBtn.scss";

import { CommponentProps } from "../defs/common";
import { NullOrUndef } from "@/src/trmrk/core";

export interface TrmrkBtnProps extends CommponentProps {
  btnFactory?: React.ComponentType<React.ComponentPropsWithRef<React.ElementType>> | NullOrUndef,
  borderWidth?: number | NullOrUndef;
}

export default function TrmrkBtn(
  { cssClass, children, btnFactory, borderWidth }: Readonly<TrmrkBtnProps>
) {
  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const btnElem = e.currentTarget;
    btnElem.classList.add('trmrk-btn-pressed');

    setTimeout(() => {
      btnElem.classList.remove('trmrk-btn-pressed');
    }, 200);
  }

  const Button = (btnFactory ?? ((props: React.ComponentProps<'button'>) => <button {...props}>{props.children}</button>));

  return (
    <Button className={['trmrk-btn', ((borderWidth ?? null) !== null ? `trmrk-border trmrk-border-${borderWidth}px` : ''), cssClass ?? ''].join(' ')}
      onPointerDown={onPointerDown}
    >{children}<div className="trmrk-btn-overlay"></div></Button>
  );
}
