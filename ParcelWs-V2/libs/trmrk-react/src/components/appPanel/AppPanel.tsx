import React, { useRef } from "react";

import "./AppPanel.scss";

export interface AppPanelProps {
  className: string,
  headerClassName?: string | null | undefined,
  headerContent?: React.ReactNode | Iterable<React.ReactNode> | null | undefined,
  bodyClassName?: string | null | undefined;
  bodyContent: React.ReactNode | Iterable<React.ReactNode>;
  afterHeaderClassName?: string | null | undefined;
  afterHeaderContent?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  showHeader: boolean;
  pinHeader: boolean;
  scrollableY?: boolean | null | undefined;
  scrollableX?: boolean | null | undefined;
  lastRefreshTmStmp?: Date | number | null | undefined
}

interface AppPanelHeaderData {
  headerEl: HTMLDivElement;
  mainEl: HTMLDivElement;
  headerHeight: number;
  mainElLastScrollTop: number;
}

export default function AppPanel(props: AppPanelProps) {
  const parentRef = React.createRef<HTMLDivElement>();
  const headerRef = React.createRef<HTMLDivElement>();
  const mainRef = React.createRef<HTMLDivElement>();

  const appPanelHeaderData = useRef({} as AppPanelHeaderData);

  const scrollHandler = (data: AppPanelHeaderData) => {
    const scrollTop = data.mainEl.scrollTop;

    if (scrollTop <= 0) { /* technically, the scrollTop should never be negative, but I've previously seen a negative value for
      this property on ios when using the document as main element and scrolling top and then dragging the top margin (like in a mobile refresh request) */
      data.mainEl.style.top = `${data.headerHeight}px`;
      data.headerEl.style.top = `0px`;
    } else {
      const prevScrollTop = data.mainElLastScrollTop;
      data.mainElLastScrollTop = scrollTop;

      const scrollTopDiff = scrollTop - prevScrollTop;
      let mainElTopOffset = data.mainEl.offsetTop - scrollTopDiff;

      mainElTopOffset = Math.max(0, mainElTopOffset);
      mainElTopOffset = Math.min(mainElTopOffset, data.headerHeight);
      const headerElTopOffset = mainElTopOffset - data.headerHeight;

      data.mainEl.style.top = `${mainElTopOffset}px`;
      data.headerEl.style.top = `${headerElTopOffset}px`;
    }
  }

  React.useEffect(() => {
    const onResize = () => {
      const appBarDataValue = appPanelHeaderData.current;

      if (appBarDataValue) {
        scrollHandler(appBarDataValue);
      }
    }

    const onScroll = () => {
      const appBarDataValue = appPanelHeaderData.current;

      if (appBarDataValue) {
        scrollHandler(appBarDataValue);
      }
    }

    const parentEl = parentRef.current;
    const mainEl = mainRef.current;
    const headerEl = headerRef.current;
    const canAddListeners = !!(parentEl && mainEl && headerEl);
    const addListeners = canAddListeners && !props.pinHeader;

    if (addListeners) {
      appPanelHeaderData.current = {
        headerEl: headerEl,
        mainEl: mainEl,
        headerHeight: headerEl.clientHeight,
        mainElLastScrollTop: mainEl.scrollTop
      };

      console.log("appBarData.current", appPanelHeaderData.current);

      scrollHandler(appPanelHeaderData.current);

      parentEl.addEventListener("resize", onResize);
      mainEl.addEventListener("scroll", onScroll);
    } else if (mainEl) {
      mainEl.style.top = "0px";
    }

    if (addListeners) {
      return () => {
        parentEl.removeEventListener("resize", onResize);
        mainEl.removeEventListener("scroll", onScroll);
      };
    }
  }, [ props.showHeader, props.pinHeader, props.lastRefreshTmStmp, appPanelHeaderData, parentRef, headerRef, mainRef ]);

  return (<div className={["trmrk-app-panel", props.className].join(" ")} ref={parentRef}>
    { (props.headerContent && (props.showHeader || props.pinHeader)) ?
      <div className={["trmrk-app-panel-header", props.headerClassName ?? ""].join(" ")} ref={headerRef}>
      { props.headerContent }</div> : null }
    { (props.afterHeaderClassName && props.afterHeaderContent) ? 
      <div className={[props.afterHeaderClassName].join(" ")}>{props.afterHeaderContent}</div> : null }
    <div className={["trmrk-app-panel-body",
      props.scrollableX ? "trmrk-scrollableX" : "",
      props.scrollableY ? "trmrk-scrollableY" : "",
      (props.scrollableX || props.scrollableY) ? "trmrk-scrollable" : "",
      props.bodyClassName ?? ""].join(" ")} ref={mainRef}>
      {props.bodyContent}</div>
  </div>);
}
