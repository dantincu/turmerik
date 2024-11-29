import { ParentComponent, useContext } from "solid-js";

import { BasicComponentProps } from "../../components/HOCs/withHtmlElement/typeDefs";

import { AppContext } from "../../dataStore/core";

export interface BsBtnProps {
  btnClassName?: string | null | undefined;
  btnHasNoBorder?: boolean | null | undefined;
  addBtnOutlinedAppTheme?: boolean | null | undefined;
}

const BsBtn: ParentComponent<BsBtnProps> = (props: BsBtnProps & BasicComponentProps) => {
  const appData = useContext(AppContext);

  const btnClassNamesArr = [
    "btn trmrk-bs-btn overflow-hidden",
    props.btnClassName ?? "",
    props.addBtnOutlinedAppTheme ? ("btn-outline-" + appData.appLayout.isDarkMode ? "dark" : "light") : "",
    props.btnHasNoBorder ? "trmrk-btn-no-border" : ""
  ];

  return <button class={btnClassNamesArr.join(" ")}>
    {props.children}
  </button>
}

export default BsBtn;
