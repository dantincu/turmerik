import React from "react";

import "./TrmrkMinimizedModalStacksView.scss";
import { NullOrUndef } from "@/src/trmrk/core";

export interface TrmrkMinimizedModalStacksViewProps {
  cssClass?: string | NullOrUndef;
}

export default function TrmrkMinimizedModalStacksView(
  {
    cssClass
  }: TrmrkMinimizedModalStacksViewProps
) {
  return <div className={["trmrk-minimized-modal-stacks-view", cssClass ?? ""].join(" ")}></div>;
}
