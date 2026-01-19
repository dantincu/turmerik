import "./TrmrkBtn.scss";

import { CommponentProps } from "../defs/common";
import { NullOrUndef } from "@/src/trmrk/core";

export interface TrmrkBtnProps extends CommponentProps {
  borderWidth?: number | NullOrUndef;
  onClick?: () => void;
}

export default function TrmrkBtn(
  { cssClass, onClick, children, borderWidth }: Readonly<TrmrkBtnProps>
) {
  return (
    <button
      className={['trmrk-btn', ((borderWidth ?? null) !== null ? `trmrk-border trmrk-border-${borderWidth}px` : ''), cssClass ?? ''].join(' ')}
      onClick={onClick}
    >{children}</button>
  );
}
