import { ParentComponent, useContext } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import { ForwardRef } from "../HOCs/withHtmlElement/typeDefs";

export interface BsBtnProps extends ForwardRef<HTMLButtonElement> {
  btnCssClass?: string | null | undefined;
  btnHasNoBorder?: boolean | null | undefined;
  addBtnOutlinedAppTheme?: boolean | null | undefined;
  isDisabled?: boolean | null | undefined;
  onClick?: ((e: MouseEvent | TouchEvent) => void) | null | undefined;
}

const BsBtn: ParentComponent<BsBtnProps> = (props) => {
  const { appData } = useAppContext();

  const btnClassNamesArr = [
    "btn trmrk-bs-btn overflow-hidden",
    props.btnCssClass ?? "",
    props.addBtnOutlinedAppTheme ? ("btn-outline-" + appData.appLayout.isDarkMode ? "dark" : "light") : "",
    props.btnHasNoBorder ? "trmrk-btn-no-border" : ""
  ];

  return <button class={btnClassNamesArr.join(" ")} {...(props.isDisabled ? { disabled: true } : {})}
    {...(props.onClick ? { onClick: props.onClick } : {})}
    ref={props.ref}>
    {props.children}
  </button>
}

export default BsBtn;
