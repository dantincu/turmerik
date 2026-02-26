import React from "react";
import { useAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import { defaultTrmrkAppModalService } from "../TrmrkBasicAppLayout/TrmrkAppModalService";

import "./TrmrkMinimizedModalStacksView.scss";

export interface TrmrkMinimizedModalStacksViewProps {
  cssClass?: string | NullOrUndef;
}

export default function TrmrkMinimizedModalStacksView(
  {
    cssClass
  }: TrmrkMinimizedModalStacksViewProps
) {
  const restorableMinimizedModalStacks = defaultTrmrkAppModalService.value.restorableMinimizedStacks;

  return <div className={["trmrk-minimized-modal-stacks-view", cssClass ?? ""].join(" ")}>
    { restorableMinimizedModalStacks.map(stack => <div className="trmrk-modals-stack"></div>) }
  </div>;
}
