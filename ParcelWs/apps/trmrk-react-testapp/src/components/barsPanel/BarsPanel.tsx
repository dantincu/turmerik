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
      props.showFooter ? "trmrk-has-footer" : "",].join(" ")}>
    { props.showHeader ? <React.Fragment>
        <div className={["trmrk-panel-header"].join(" ")}>
          { props.headerChildren }
        </div>
        { /* <div className="trmrk-panel-body-top-spacing">Turmerik</div> */ }
      </React.Fragment> : null }

    { props.showFooter ? <React.Fragment>
        <div className={["trmrk-panel-footer"].join(" ")}>
          { props.footerChildren }
        </div>
        { /* <div className="trmrk-panel-body-bottom-spacing">Turmerik</div> */ }
      </React.Fragment> : null }

    <div className={["trmrk-panel-body",
      props.scrollableX ? "trmrk-scrollable trmrk-scrollableX" : "",
      props.scrollableY ? "trmrk-scrollable trmrk-scrollableY" : ""].join(" ")}>
      { props.children }
    </div>
  </div>)
}
