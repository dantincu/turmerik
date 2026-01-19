import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkSplitContainer.scss";

import { CommponentProps } from "../defs/common";

export interface TrmrkSplitContainerProps extends CommponentProps {
  showPanel1?: boolean | NullOrUndef;
  showPanel2?: boolean | NullOrUndef;
  panel1Content?: (() => React.ReactNode) | NullOrUndef;
  panel2Content?: (() => React.ReactNode) | NullOrUndef;
}

export default function TrmrkSplitContainer({
  cssClass,
  showPanel1,
  showPanel2,
  panel1Content,
  panel2Content,
}: TrmrkSplitContainerProps) {
  return (
    <div className={['trmrk-split-container', showPanel1 && showPanel2 ? "trmrk-has-both-panels" : "", cssClass ?? ''].join(' ')}>
      {showPanel1 && panel1Content && <div className="trmrk-split-panel1">{panel1Content()}</div>}
      {showPanel2 && panel2Content && <div className="trmrk-split-panel2">{panel2Content()}</div>}
    </div>
  );
}
