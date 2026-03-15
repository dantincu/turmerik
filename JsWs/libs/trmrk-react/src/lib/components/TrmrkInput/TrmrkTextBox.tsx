import React from "react";

import { updateFwdRef } from "../../services/utils";

import "./TrmrkInput.scss";
import { NullOrUndef } from "@/src/trmrk/core";

export interface TrmrkTextBoxProps extends React.ComponentPropsWithRef<'input'> {
  showSpinners?: boolean | NullOrUndef;
}

const TrmrkTextBox = React.forwardRef(({ className, showSpinners, type, ...props }: TrmrkTextBoxProps, ref) => {
  const isNumeric = type === "number";

  return <input type={type} {...props} ref={el => updateFwdRef(ref, el)}
    className={[
      "trmrk-textbox",
      className ?? "",
      (isNumeric && (showSpinners ?? false)) ? "trmrk-show-spinners" : "" ].join(" ")} />;
});

export default TrmrkTextBox;
