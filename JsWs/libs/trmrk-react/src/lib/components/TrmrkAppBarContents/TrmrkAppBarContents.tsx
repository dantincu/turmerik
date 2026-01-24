import React from "react";

import "./TrmrkAppBarContents.scss";
import { ComponentProps } from "../defs/common";

export interface TrmrkAppBarContentsProps extends ComponentProps {

}

export default function TrmrkAppBarContents({ children }: TrmrkAppBarContentsProps) {
  return <>{children}</>;
}
