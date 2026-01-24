import React from "react";

import "./TrmrkBottomToolBarContents.scss";
import { ComponentProps } from "../defs/common";

export interface TrmrkBottomToolBarContentsProps extends ComponentProps {

}

export default function TrmrkBottomToolBarContents({ children }: TrmrkBottomToolBarContentsProps) {
  return <>{children}</>;
}
