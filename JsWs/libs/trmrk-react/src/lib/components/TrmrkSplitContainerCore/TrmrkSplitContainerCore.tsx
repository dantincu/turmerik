import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkSplitContainerCore.scss";

import { ComponentProps } from "../defs/common";

export interface TrmrkSplitContainerProps extends ComponentProps {
  panel1WidthPercent?: number | NullOrUndef;
  showPanel1?: boolean | NullOrUndef;
  showPanel2?: boolean | NullOrUndef;
  panel1Content?: (() => React.ReactNode) | NullOrUndef;
  panel2Content?: (() => React.ReactNode) | NullOrUndef;
}

export default function TrmrkSplitContainerCore({
  cssClass,
  panel1WidthPercent,
  showPanel1,
  showPanel2,
  panel1Content,
  panel2Content,
}: TrmrkSplitContainerProps) {
  return (
    <div className={['trmrk-split-container', showPanel1 && showPanel2 ? "trmrk-has-both-panels" : "", cssClass ?? ''].join(' ')}>
      {showPanel1 && panel1Content && <div className="trmrk-split-panel1"
        style={ showPanel2 && panel2Content && (panel1WidthPercent ?? null) !== null ? {
          flexBasis: `${panel1WidthPercent}%`,
          minWidth: `${panel1WidthPercent}%` } : {}}>{panel1Content()}</div>}
      { showPanel1 && panel1Content && showPanel2 && panel2Content && <div className="trmrk-splitter" /> }
      {showPanel2 && panel2Content && <div className="trmrk-split-panel2">{panel2Content()}</div>}
    </div>
  );
}
