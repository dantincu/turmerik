import React from "react";

import "./ResizablePanel.scss";

export interface ResizablePanelOpts {
  className?: string | null | undefined;
  resizableFromTop?: boolean | null | undefined;
  resizableFromBottom?: boolean | null | undefined;
  resizableFromLeft?: boolean | null | undefined;
  resizableFromRight?: boolean | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode>;
}

export default function ResizablePanel(props: ResizablePanelOpts) {
  return (<div className={["trmrk-resizable-panel",
    props.className ?? "",
    props.resizableFromTop ? "trmrk-resizable-from-top" : "",
    props.resizableFromBottom ? "trmrk-resizable-from-bottom" : "",
    props.resizableFromLeft ? "trmrk-resizable-from-left" : "",
    props.resizableFromRight ? "trmrk-resizable-from-right" : ""].join(" ")}>
      { props.resizableFromTop ? <div className="trmrk-draggable-margin trmrk-draggable-from-top"></div> : null }
      { props.resizableFromLeft ? <div className="trmrk-draggable-margin trmrk-draggable-from-left"></div> : null }
      <div className="trmrk-resizable-content">
        {props.children}
      </div>
      { props.resizableFromBottom ? <div className="trmrk-draggable-margin trmrk-draggable-from-bottom"></div> : null }
      { props.resizableFromRight ? <div className="trmrk-draggable-margin trmrk-draggable-from-right"></div> : null }
    </div>);
}
