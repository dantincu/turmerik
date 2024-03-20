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
  headerHeight?: number | null | undefined;
  scrollableY?: boolean | null | undefined;
  scrollableX?: boolean | null | undefined;
  scrolling?: (data: AppPanelHeaderData, offset: AppPanelHeaderOffset) => void;
  lastRefreshTmStmp?: Date | number | null | undefined;
  bodyBottomPaddingFactor?: number | null | undefined;
}

export interface AppPanelHeaderData {
  headerEl: HTMLDivElement;
  bodyEl: HTMLDivElement;
  parentHeight: number;
  headerHeight: number;
  bodyElBeforeLastScrollTop: number;
  bodyElLastScrollTop: number;
  showHeaderNow: boolean;
  bodyBottomPaddingFactor: number;
}

export interface AppPanelHeaderOffset {
  headerElTopOffset: number;
  mainElTopOffset: number;
}

export default function AppPanel(props: AppPanelProps) {
  const parentRef = React.createRef<HTMLDivElement>();
  const headerRef = React.createRef<HTMLDivElement>();
  const bodyRef = React.createRef<HTMLDivElement>();

  const appPanelHeaderData = useRef({} as AppPanelHeaderData);

  const [ showHeader, setShowHeader]  = React.useState(props.showHeader);
  const [ headerHeight, setHeaderHeight ] = React.useState(props.headerHeight);

  const scrollHandler = (data: AppPanelHeaderData) => {
    const bodyEl = data.bodyEl;
    const headerEl = data.headerEl;
    const scrollTop = bodyEl.scrollTop;

    if (scrollTop <= 0 || data.showHeaderNow) { /* technically, the scrollTop should never be negative, but I've previously seen a negative value for
      this property on ios when using the document as main element and scrolling top and then dragging the top margin (like in a mobile refresh request) */
      data.bodyElLastScrollTop = 0;
      bodyEl.style.top = `${data.headerHeight}px`;
      headerEl.style.top = `0px`;
      
      if (data.bodyBottomPaddingFactor > 0) {
        bodyEl.style.paddingBottom = "0px";
      }

      if (props.scrolling) {
        props.scrolling(data, {
          headerElTopOffset: 0,
          mainElTopOffset: data.headerHeight,
        });
      }
    } else if (bodyEl.scrollHeight - bodyEl.scrollTop - bodyEl.clientHeight >= 1) {
      const prevScrollTop = data.bodyElLastScrollTop;
      data.bodyElLastScrollTop = scrollTop;

      const scrollTopDiff = scrollTop - prevScrollTop;
      let mainElTopOffset = data.bodyEl.offsetTop - scrollTopDiff;

      mainElTopOffset = Math.max(0, mainElTopOffset);
      mainElTopOffset = Math.min(mainElTopOffset, data.headerHeight);
      const headerElTopOffset = mainElTopOffset - data.headerHeight;

      bodyEl.style.top = `${mainElTopOffset}px`;
      headerEl.style.top = `${headerElTopOffset}px`;

      if (data.bodyBottomPaddingFactor > 0) {// This is needed to prevent the screen shaking upon scrolling to the bottom of the page on mobile devices
        bodyEl.style.paddingBottom = `${data.bodyBottomPaddingFactor * data.headerHeight}px`;
      }

      if (props.scrolling) {
        props.scrolling(data, {
          headerElTopOffset: headerElTopOffset,
          mainElTopOffset: mainElTopOffset,
        });
      }
    }
  }

  React.useEffect(() => {
    const onResize = (ev: UIEvent) => {
      const appBarDataValue = appPanelHeaderData.current;

      if (appBarDataValue) {
        appBarDataValue.parentHeight = (ev.target as HTMLElement).clientHeight;
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
    const mainEl = bodyRef.current;
    const headerEl = headerRef.current;
    const canAddListeners = !!(parentEl && mainEl && headerEl);
    const addListeners = canAddListeners && !props.pinHeader;

    const showHeaderToggled = showHeader !== props.showHeader;
    const headerHeightChanged = headerHeight !== props.headerHeight;

    if (addListeners) {
      if ((showHeaderToggled || headerHeightChanged) && props.headerHeight !== null){
        headerEl.style.height = `${props.headerHeight}px`;
      }

      appPanelHeaderData.current = {
        headerEl: headerEl,
        bodyEl: mainEl,
        headerHeight: headerEl.clientHeight,
        parentHeight: parentEl.clientHeight,
        bodyElBeforeLastScrollTop: mainEl.scrollTop,
        bodyElLastScrollTop: mainEl.scrollTop,
        showHeaderNow: showHeaderToggled && props.showHeader,
        bodyBottomPaddingFactor: props.bodyBottomPaddingFactor ?? 0
      };

      scrollHandler(appPanelHeaderData.current);

      parentEl.addEventListener("resize", onResize);
      mainEl.addEventListener("scroll", onScroll);
    } else if (mainEl) {
      if (headerEl) {
        if ((showHeaderToggled || headerHeightChanged) && props.headerHeight !== null){
          headerEl.style.height = `${props.headerHeight}px`;
          mainEl.style.top = `${props.headerHeight}px`;
        }
      } else {
        mainEl.style.top = "0px";
      }
    }

    if (showHeaderToggled) {
      setShowHeader(props.showHeader);
    }

    if (headerHeightChanged) {
      setHeaderHeight(props.headerHeight);
    }

    if (addListeners) {
      return () => {
        parentEl.removeEventListener("resize", onResize);
        mainEl.removeEventListener("scroll", onScroll);
      };
    }
  }, [
    props.showHeader,
    showHeader,
    props.pinHeader,
    props.lastRefreshTmStmp,
    props.headerHeight,
    appPanelHeaderData,
    parentRef,
    headerRef,
    bodyRef,
    props.bodyBottomPaddingFactor ]);

  return (<div className={["trmrk-app-panel", props.className].join(" ")} ref={parentRef}>
    { (props.headerContent && props.showHeader) ?
      <div className={["trmrk-app-panel-header", props.headerClassName ?? ""].join(" ")} ref={headerRef}>
      { props.headerContent }</div> : null }
    { (props.afterHeaderClassName && props.afterHeaderContent) ? 
      <div className={[props.afterHeaderClassName].join(" ")}>{props.afterHeaderContent}</div> : null }
    <div className={["trmrk-app-panel-body",
      typeof props.scrollableX === "boolean" ? props.scrollableX ? "trmrk-scrollableX" : "trmrk-overflowX-hidden" : "",
      typeof props.scrollableY === "boolean" ? props.scrollableY ? "trmrk-scrollableY" : "trmrk-overflowY-hidden" : "",
      (props.scrollableX || props.scrollableY) ? "trmrk-scrollable" : "",
      props.bodyClassName ?? ""].join(" ")} ref={bodyRef}>
      {props.bodyContent}</div>
  </div>);
}
