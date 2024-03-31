import React, { useRef } from "react";

/* import trmrk_browser from "trmrk-browser";
const domUtils = trmrk_browser.domUtils.default; */

import "./FloatingBarsPanel.scss";

export interface FloatingBarsPanelProps {
  className?: string | null | undefined;
  headerClassName?: string | null | undefined;
  footerClassName?: string | null | undefined;
  bodyClassName?: string | null | undefined;
  headerRowsCount: number;
  footerRowsCount: number;
  panelScrollableY?: boolean | null | undefined;
  panelBodyScrollableX?: boolean | null | undefined;
  headerContent: React.ReactNode | Iterable<React.ReactNode> | null;
  footerContent: React.ReactNode | Iterable<React.ReactNode> | null;
  children: React.ReactNode | Iterable<React.ReactNode>;
  resized?: ((data: FloatingBarsPanelScrollData) => void) | null | undefined;
  scrolled?: ((data: FloatingBarsPanelScrollData) => void) | null | undefined;
}

export interface FloatingBarsPanelScrollData {
  lastPanelScrollTop: number;
  panelScrollTop: number;
  panelEl: HTMLDivElement | null;
  viewEl: HTMLDivElement | null;
  headerEl: HTMLDivElement | null;
  footerEl: HTMLDivElement | null;
  bodyEl: HTMLDivElement | null;
}

export default function FloatingBarsPanel(props: FloatingBarsPanelProps) {
  const panelElRef = React.createRef<HTMLDivElement>();
  const viewElRef = React.createRef<HTMLDivElement>();
  const panelHeaderElRef = React.createRef<HTMLDivElement>();
  const panelFooterElRef = React.createRef<HTMLDivElement>();
  const panelBodyElRef = React.createRef<HTMLDivElement>();

  const [ headerIsVisible, setHeaderIsVisible ] = React.useState(true);
  const [ footerIsVisible, setFooterIsVisible ] = React.useState(true);

  const lastPanelScrollTop = React.useRef(0);

  React.useEffect(() => {
    const panelEl = panelElRef.current;
    const viewEl = viewElRef.current;
    const bodyEl = panelBodyElRef.current;

    const resized = () => {
      if (panelEl && bodyEl && viewEl) {
        const panelHeight = panelEl.clientHeight;
        const bodyHeight = bodyEl.clientHeight;
        
        const headerHeight = panelHeaderElRef.current?.clientHeight ?? 0;
        const footerHeight = panelFooterElRef.current?.clientHeight ?? 0;

        if (headerHeight + footerHeight + bodyHeight < panelHeight) {
          panelEl.scrollTop = 0;
          setHeaderIsVisible(true);
          setFooterIsVisible(true);
          viewEl.style.top = `0px`;
          console.log("viewEl.style.top resized 0", viewEl.style.top);
        } else {
          viewEl.style.top = `${panelEl.scrollTop}px`;
          console.log("viewEl.style.top resized", viewEl.style.top, bodyHeight);
        }
      }

      if (props.resized) {
        props.resized({
          lastPanelScrollTop: lastPanelScrollTop.current,
          panelScrollTop: panelEl?.scrollTop ?? -1,
          panelEl: panelEl,
          viewEl: viewEl,
          bodyEl: bodyEl,
          headerEl: panelHeaderElRef.current,
          footerEl: panelFooterElRef.current
        });
      }
    }

    const scrolled = () => {
      let panelScrollTop = -1;
      let lastPanelScrollTopValue = -1;

      if (panelEl && viewEl) {
        panelScrollTop = panelEl.scrollTop;
        lastPanelScrollTopValue = lastPanelScrollTop.current;
        viewEl.style.top = `${panelScrollTop}px`;
        console.log("viewEl.style.top scrolled", viewEl.style.top);

        if (panelScrollTop < lastPanelScrollTopValue) {
          if (!headerIsVisible) {
            setHeaderIsVisible(true);
          }

          if (footerIsVisible) {
            setFooterIsVisible(false);
          }
        } else if (panelScrollTop > lastPanelScrollTopValue) {
          if (headerIsVisible) {
            setHeaderIsVisible(false);
          }

          if (!footerIsVisible) {
            setFooterIsVisible(true);
          }
        }

        lastPanelScrollTop.current = panelScrollTop;
      }

      if (props.scrolled) {
        props.scrolled({
          lastPanelScrollTop: lastPanelScrollTopValue,
          panelScrollTop: panelScrollTop,
          panelEl: panelEl,
          viewEl: viewEl,
          bodyEl: bodyEl,
          headerEl: panelHeaderElRef.current,
          footerEl: panelFooterElRef.current
        });
      }
    }

    if (panelEl) {
      window.addEventListener("resize", resized);
      panelEl.addEventListener("scroll", scrolled);
    }

    if (panelEl) {
      return () => {
        window.removeEventListener("resize", resized);
        panelEl.removeEventListener("scroll", scrolled);
      }
    }
  }, [props.headerRowsCount,
    props.footerRowsCount,
    props.resized,
    props.scrolled,
    props.panelScrollableY,
    props.panelBodyScrollableX,
    panelElRef,
    panelHeaderElRef,
    panelFooterElRef,
    panelBodyElRef,
    headerIsVisible,
    footerIsVisible,
    lastPanelScrollTop]);

  return (<div className={[
    "trmrk-ftbs-panel",
    props.className ?? "",
    `trmrk-padding-top-rows-x${headerIsVisible ? props.headerRowsCount : 0}`,
    `trmrk-padding-bottom-rows-x${footerIsVisible ? props.footerRowsCount : 0}`,
    props.panelScrollableY ? "trmrk-scrollable trmrk-scrollableY" : ""].join(" ")} ref={panelElRef}>
    <div className="trmrk-ftbs-panel-view" ref={viewElRef}>
      <div className={[
        "trmrk-ftbs-panel-header",
        props.headerClassName ?? "",
        `trmrk-height-rows-x${props.headerRowsCount}`,
        headerIsVisible ? "" : "trmrk-top-hidden"].join(" ")} ref={panelHeaderElRef}>
        { props.headerContent }
      </div>
      <div className={[
        "trmrk-ftbs-panel-footer",
        props.headerClassName ?? "",
        `trmrk-height-rows-x${props.footerRowsCount}`,
        footerIsVisible ? "" : "trmrk-bottom-hidden"].join(" ")} ref={panelFooterElRef}>
        { props.footerContent }
      </div>
    </div>
    <div className={[
      "trmrk-ftbs-panel-body",
      props.bodyClassName ?? "",
      props.panelBodyScrollableX ? "trmrk-scrollable trmrk-scrollableX" : ""].join(" ")} ref={panelBodyElRef}>
      { props.children }
    </div>
  </div>);
}
