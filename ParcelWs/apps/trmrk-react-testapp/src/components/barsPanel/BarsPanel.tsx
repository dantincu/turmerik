import React from "react";

export interface BarsPanelProps {
  panelClassName?: string | null | undefined;
  showHeader: boolean;
  showFooter: boolean;
  headerChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  footerChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode>;
  scrollableX?: boolean | null | undefined;
  scrollableY?: boolean | null | undefined;
}

import "./BarsPanel.scss";

export default function BarsPanel(props: BarsPanelProps) {
  return (<div className={[ props.panelClassName ?? "", "trmrk-bars-panel",
      props.showHeader ? "trmrk-has-header" : "",
      props.showFooter ? "trmrk-has-footer" : "",
      props.scrollableX ? "trmrk-scrollable trmrk-scrollableX" : "",
      props.scrollableY ? "trmrk-scrollable trmrk-scrollableY" : ""].join(" ")}>
    { props.showHeader ? <div className={["trmrk-panel-header"].join(" ")}>
      { props.headerChildren }
    </div> : null }

    { props.showFooter ? <div className={["trmrk-panel-footer"].join(" ")}>
      { props.footerChildren }
    </div> : null }

    <div className={["trmrk-panel-body"].join(" ")}>
      { props.children }
    </div>
  </div>)
}
