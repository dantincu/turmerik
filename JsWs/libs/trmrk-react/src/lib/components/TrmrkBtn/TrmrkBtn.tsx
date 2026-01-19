import "./TrmrkButton.scss";

import { CommponentProps } from "../defs/common";

export interface TrmrkBtnProps extends CommponentProps {
  onClick?: () => void;
}

export default function TrmrkBtn(
  { cssClass, onClick, children }: Readonly<TrmrkBtnProps>
) {
  return (
    <button
      className={['trmrk-btn', cssClass ?? ''].join(' ')}
      onClick={onClick}
    >{children}</button>
  );
}
