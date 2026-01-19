import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkSplitContainer.scss";

import { CommponentProps } from "../defs/common";

export interface TrmrkSplitContainerProps extends CommponentProps {}

export default function TrmrkSplitContainer({
  children,
  cssClass,
}: TrmrkSplitContainerProps) {
  return (
    <div className={['trmrk-split-container', cssClass ?? ''].join(' ')}>
      {children}
    </div>
  );
}
