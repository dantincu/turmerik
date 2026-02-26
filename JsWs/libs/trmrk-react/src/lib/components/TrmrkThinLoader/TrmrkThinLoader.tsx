import React from "react";

import "./TrmrkThinLoader.scss";
import { NullOrUndef } from "@/src/trmrk/core";

export interface TrmrkThinLoaderProps {
  cssClass?: string | NullOrUndef;
}

export default function TrmrkThinLoader(
  {
    cssClass
  }: TrmrkThinLoaderProps
) {
  return <div className={["trmrk-thin-loader-container", cssClass ?? ""].join(" ")}>
    <div className="trmrk-thin-loader"></div>
  </div>;
}
