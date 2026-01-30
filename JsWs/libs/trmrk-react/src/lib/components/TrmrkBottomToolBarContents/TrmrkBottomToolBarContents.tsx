import React from "react";
import { useAtom } from "jotai";

import "./TrmrkBottomToolBarContents.scss";
import { ComponentProps } from "../defs/common";
import { trmrk3PanelsAppLayoutAtoms } from "../Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

export interface TrmrkBottomToolBarContentsProps extends ComponentProps {

}

export default function TrmrkBottomToolBarContents({ children }: TrmrkBottomToolBarContentsProps) {
  const [ isResizingPanels ] = useAtom(trmrk3PanelsAppLayoutAtoms.isResizingPanels);

  return isResizingPanels ? <></> : children;
}
