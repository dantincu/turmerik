import { ParentComponent } from "solid-js";

import BsBtn, { BsBtnProps } from "./BsBtn";

export interface BsIconBtnProps extends BsBtnProps {
  iconClassName: string;
}

const BsIconBtn: ParentComponent<BsIconBtnProps> = (props: BsIconBtnProps) => {
  return <BsBtn btnClassName="trmrk-bs-icon-btn">
    <i class={props.iconClassName}></i>
  </BsBtn>
}

export default BsIconBtn;
