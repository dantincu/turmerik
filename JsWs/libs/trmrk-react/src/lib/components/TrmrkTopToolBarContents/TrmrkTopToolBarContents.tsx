import React from "react";

import "./TrmrkTopToolBarContents.scss";
import { ComponentProps } from "../defs/common";

export interface TrmrkTopToolBarContentsProps extends ComponentProps {

}

export default function TrmrkTopToolBarContents({ children }: TrmrkTopToolBarContentsProps) {
  return <>{children}</>;
}
