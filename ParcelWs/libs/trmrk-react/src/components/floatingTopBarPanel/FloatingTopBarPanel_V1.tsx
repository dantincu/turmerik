import React, { useRef } from "react";

import trmrk_browser from "trmrk-browser";
const domUtils = trmrk_browser.domUtils.default;

import "./FloatingTopBarPanel_V1.scss";

export interface FloatingTopBarPanelProps {
  className: string,
  headerClassName?: string | null | undefined,
  headerContent?: React.ReactNode | Iterable<React.ReactNode> | null | undefined,
  bodyClassName?: string | null | undefined;
  bodyContent: React.ReactNode | Iterable<React.ReactNode>;
  afterHeaderClassName?: string | null | undefined;
  afterHeaderContent?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  showHeader: boolean;
  pinHeader: boolean;
  floatingVariable: FloatingVariable;
  headerHeight?: number | null | undefined;
  scrollableY?: boolean | null | undefined;
  scrollableX?: boolean | null | undefined;
  beforeScrolling?: (data: FloatingTopBarPanelHeaderData) => boolean | null | undefined | void;
  scrolling?: (data: FloatingTopBarPanelHeaderData, offset: FloatingTopBarPanelHeaderOffset) => void;
  topBarRefreshReqsCount?: number | null | undefined;
  bodyBottomPaddingFactor?: number | null | undefined;
  scrollRefreshReqsCount?: number | null | undefined;
}

export interface FloatingTopBarPanelHeaderData {
  parentEl: HTMLDivElement;
  headerEl: HTMLDivElement;
  bodyEl: HTMLDivElement;
  parentHeight: number;
  headerHeight: number;
  // bodyElBeforeLastScrollTop: number;
  bodyElLastScrollTop: number;
  showHeaderNow: boolean;
  bodyBottomPaddingFactor: number;
  floatingVariable: FloatingVariable;
  floatingVariableValue: number;
}

export interface FloatingTopBarPanelHeaderOffset {
  headerElTopOffset: number;
  mainElTopOffset: number;
}

export enum FloatingVariable {
  BodyTop,
  BodyTopPadding,
}

export const updateFloatingVariableValue = (
  bodyEl: HTMLDivElement,
  bodyTopOffset: number,
  floatingVariable: FloatingVariable | null | undefined
) => {
  switch (floatingVariable) {
    case FloatingVariable.BodyTop:
      bodyEl.style.top = `${bodyTopOffset}px`;
      break;
    default:
      // console.log("updateFloatingVariable bodyTopOffset", bodyTopOffset);
      bodyEl.style.paddingTop = `${bodyTopOffset}px`;
      break;
  }

  return bodyTopOffset;
}

export const getFloatingVariableValue = (
  bodyEl: HTMLDivElement,
  floatingVariable: FloatingVariable | null | undefined) => {
  switch (floatingVariable) {
    case FloatingVariable.BodyTop:
      return bodyEl.offsetTop;
    default:
      return domUtils.extractFloatNumber(bodyEl.style.paddingTop) as number;
  }
}

export default function FloatingTopBarPanel(props: FloatingTopBarPanelProps) {
  const parentRef = React.createRef<HTMLDivElement>();
  const headerRef = React.createRef<HTMLDivElement>();
  const bodyRef = React.createRef<HTMLDivElement>();

  const appPanelHeaderData = useRef({} as FloatingTopBarPanelHeaderData);

  const [ scrollRefreshReqsCount, setScrollRefreshReqsCount ] = React.useState(props.scrollRefreshReqsCount ?? 0);

  const [ showHeader, setShowHeader]  = React.useState(props.showHeader);
  const [ headerHeight, setHeaderHeight ] = React.useState(props.headerHeight);

  const scrollHandler = React.useCallback((data: FloatingTopBarPanelHeaderData) => {
    const bodyEl = data.bodyEl;
    const headerEl = data.headerEl;
    const scrollTop = bodyEl.scrollTop;

    let handle = true;

    if (props.beforeScrolling) {
      handle = props.beforeScrolling(data) ?? true;
    }

    if (handle) {
      if (scrollTop <= 0 || data.showHeaderNow) { /* technically, the scrollTop should never be negative, but I've previously seen a negative value for
        this property on ios when using the document as main element and scrolling top and then dragging the top margin (like in a mobile refresh request) */

        data.bodyElLastScrollTop = scrollTop;
        headerEl.style.top = `0px`;

        data.floatingVariableValue = updateFloatingVariableValue(bodyEl, data.headerHeight, data.floatingVariable);
        
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
        // const floatingVariableValue = getFloatingVariableValue(data.bodyEl, data.floatingVariable);
        const floatingVariableValue = data.floatingVariableValue;
        let mainElTopOffset = floatingVariableValue - scrollTopDiff;

        mainElTopOffset = Math.max(0, mainElTopOffset);
        mainElTopOffset = Math.min(mainElTopOffset, data.headerHeight);
        const headerElTopOffset = mainElTopOffset - data.headerHeight;

        headerEl.style.top = `${headerElTopOffset}px`;
        // console.log("headerElTopOffset", headerElTopOffset, mainElTopOffset, data.headerHeight);
        data.floatingVariableValue = updateFloatingVariableValue(bodyEl, mainElTopOffset, data.floatingVariable);
        
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
  }, [])

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

      // console.log("headerEl.clientHeight", headerEl.clientHeight);

      appPanelHeaderData.current = {
        parentEl: parentEl,
        headerEl: headerEl,
        bodyEl: mainEl,
        headerHeight: headerEl.clientHeight,
        parentHeight: parentEl.clientHeight,
        floatingVariable: props.floatingVariable,
        floatingVariableValue: getFloatingVariableValue(mainEl, props.floatingVariable),
        // bodyElBeforeLastScrollTop: mainEl.scrollTop,
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
          appPanelHeaderData.current.floatingVariableValue = updateFloatingVariableValue(mainEl, props.headerHeight!, props.floatingVariable);
        }
      } else {
        appPanelHeaderData.current.floatingVariableValue = updateFloatingVariableValue(mainEl, 0, props.floatingVariable);
      }
    }

    if (showHeaderToggled) {
      setShowHeader(props.showHeader);
    }

    if (headerHeightChanged) {
      setHeaderHeight(props.headerHeight);
    }

    if (scrollRefreshReqsCount !== (props.scrollRefreshReqsCount ?? 0)) {
      setScrollRefreshReqsCount(props.scrollRefreshReqsCount ?? 0);
      onScroll();
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
    props.headerHeight,
    props.showHeader,
    props.headerContent,
    appPanelHeaderData,
    parentRef,
    headerRef,
    bodyRef,
    props.bodyBottomPaddingFactor,
    scrollRefreshReqsCount,
    props.scrollRefreshReqsCount ]);

  return (<div className={["trmrk-ftb-panel", props.className].join(" ")} ref={parentRef}>
    { (props.headerContent && props.showHeader) ?
      <div className={["trmrk-ftb-panel-header", props.headerClassName ?? ""].join(" ")} ref={headerRef}>
      { props.headerContent }</div> : null }
    { (props.afterHeaderClassName && props.afterHeaderContent) ? 
      <div className={[props.afterHeaderClassName].join(" ")}>{props.afterHeaderContent}</div> : null }
    <div className={["trmrk-ftb-panel-body",
      (props.scrollableX ?? null) !== null ? props.scrollableX ? "trmrk-scrollableX" : "trmrk-overflowX-hidden" : "",
      (props.scrollableY ?? null) !== null ? props.scrollableY ? "trmrk-scrollableY" : "trmrk-overflowY-hidden" : "",
      (props.scrollableX || props.scrollableY) ? "trmrk-scrollable" : "",
      props.bodyClassName ?? ""].join(" ")} ref={bodyRef}>
      {props.bodyContent}</div>
  </div>);
}
