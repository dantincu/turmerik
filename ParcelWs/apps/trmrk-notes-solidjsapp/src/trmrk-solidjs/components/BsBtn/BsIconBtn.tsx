import { ParentComponent } from "solid-js";

import BsBtn, { BsBtnProps } from "./BsBtn";

export interface BsIconBtnProps extends BsBtnProps {
  iconCssClass: string;
}

const BsIconBtn: ParentComponent<BsIconBtnProps> = (props: BsIconBtnProps) => {
  return <BsBtn {...props} btnCssClass={["trmrk-bs-icon-btn", props.btnCssClass ?? ""].join(" ")}>
    <i class={props.iconCssClass}></i>
  </BsBtn>
}

export default BsIconBtn;
