import React from "react";

export interface BarsPanelProps {
  panelClassName?: string | null | undefined;
  headerRowsCount: number;
  footerRowsCount: number;
  headerChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  footerChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  viewChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
}

import "./BarsPanel.scss";

export default function BarsPanel(props: BarsPanelProps) {
  return (<div className={[ props.panelClassName ?? "", "trmrk-bars-panel",
      `trmrk-padding-top-rows-x${props.headerRowsCount}`,
      `trmrk-padding-bottom-rows-x${props.footerRowsCount * 2}` ].join(" ")}>
    <div className="trmrk-panel-view">
      { props.viewChildren }
      <div className={["trmrk-panel-header", `trmrk-height-rows-x${props.headerRowsCount}`].join(" ")}>
        { props.headerChildren }
      </div>
      <div className={["trmrk-panel-footer", `trmrk-height-rows-x${props.footerRowsCount}`].join(" ")}>
        { props.footerChildren }
      </div>
    </div>
    <div className="trmrk-panel-body">
      { props.children }
    </div>
  </div>)
}
