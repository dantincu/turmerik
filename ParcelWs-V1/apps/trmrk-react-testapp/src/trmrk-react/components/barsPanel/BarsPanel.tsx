import React from "react";

export interface BarsPanelProps {
  panelClassName?: string | null | undefined;
  showHeader: boolean;
  showFooter: boolean;
  headerChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  footerChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  afterBodyChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode>;
  scrollableX?: boolean | null | undefined;
  scrollableY?: boolean | null | undefined;
  onPanelElems?: ((elems: BarsPanelElems) => void) | null | undefined;
}

export interface BarsPanelElems {
  panelEl: HTMLDivElement | null;
  panelHeaderEl: HTMLDivElement | null;
  panelFooterEl: HTMLDivElement | null;
  panelBodyEl: HTMLDivElement | null;
}

export default function BarsPanel(props: BarsPanelProps) {  
  const panelEl = React.createRef<HTMLDivElement>();
  const panelHeaderEl = React.createRef<HTMLDivElement>();
  const panelFooterEl = React.createRef<HTMLDivElement>();
  const panelBodyEl = React.createRef<HTMLDivElement>();

  React.useEffect(() => {
    if (props.onPanelElems) {
      props.onPanelElems({
        panelEl: panelEl.current,
        panelHeaderEl: panelHeaderEl.current,
        panelFooterEl: panelFooterEl.current,
        panelBodyEl: panelBodyEl.current
      });
    }
  }, [
    props.onPanelElems,
    props.panelClassName,
    props.showHeader,
    props.showFooter,
    props.headerChildren,
    props.footerChildren,
    props.children,
    props.scrollableX,
    props.scrollableY,
    panelEl,
    panelHeaderEl,
    panelFooterEl,
    panelBodyEl]);

  return (<div ref={panelEl} className={[ props.panelClassName ?? "", "trmrk-bars-panel",
      props.showHeader ? "trmrk-has-header" : "",
      props.showFooter ? "trmrk-has-footer" : "",].join(" ")}>
    <div ref={panelBodyEl} className={["trmrk-panel-body",
      props.scrollableX ? "trmrk-scrollable trmrk-scrollableX" : "",
      props.scrollableY ? "trmrk-scrollable trmrk-scrollableY" : ""].join(" ")}>
      { props.children }
    </div>

    { props.showHeader ? <div ref={panelHeaderEl} className={["trmrk-panel-header"].join(" ")}>
          { props.headerChildren }
        </div> : null }

    { props.showFooter ? <div ref={panelFooterEl} className={["trmrk-panel-footer"].join(" ")}>
          { props.footerChildren }
        </div> : null }

    { props.afterBodyChildren }
  </div>)
}
