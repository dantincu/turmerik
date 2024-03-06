import React from "react";

import { getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-react/src/utils";

import "./AppModule.scss";

export interface AppModuleProps {
  className: string,
  headerClassName: string,
  headerContent: React.ReactNode | Iterable<React.ReactNode>,
  mainClassName?: string | null | undefined;
  mainContent: React.ReactNode | Iterable<React.ReactNode>;
  afterHeaderClassName?: string | null | undefined;
  afterHeaderContent?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  showHeader: boolean;
  isCompactMode: boolean;
  isDarkMode: boolean;
  lastRefreshTmStmp?: Date | number | null | undefined
}

interface AppBarData {
  headerEl: HTMLDivElement;
  mainEl: HTMLDivElement;
  headerHeight: number;
  mainElLastScrollTop: number;
}

export default function AppModule(props: AppModuleProps) {
  const parentRef = React.createRef<HTMLDivElement>();
  const headerRef = React.createRef<HTMLDivElement>();
  const mainRef = React.createRef<HTMLDivElement>();

  const appBarData = React.useRef({} as AppBarData);

  const scrollHandler = (data: AppBarData) => {
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

  const appTheme = getAppTheme({
    isDarkMode: props.isDarkMode
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(props.isCompactMode);

  React.useEffect(() => {
    const onResize = () => {
      const appBarDataValue = appBarData.current;

      if (appBarDataValue) {
        scrollHandler(appBarDataValue);
      }
    }

    const onScroll = () => {
      const appBarDataValue = appBarData.current;

      if (appBarDataValue) {
        scrollHandler(appBarDataValue);
      }
    }

    const parentEl = parentRef.current;
    const mainEl = mainRef.current;
    const headerEl = headerRef.current;
    const addListeners = props.isCompactMode && !!(parentEl && mainEl && headerEl);

    if (addListeners) {
      appBarData.current = {
        headerEl: headerEl,
        mainEl: mainEl,
        headerHeight: headerEl.clientHeight,
        mainElLastScrollTop: mainEl.scrollTop
      };

      console.log("appBarData.current", appBarData.current);

      scrollHandler(appBarData.current);

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
  }, [ props.showHeader, props.isCompactMode, props.lastRefreshTmStmp, appBarData, parentRef, headerRef, mainRef ]);

  return (<div className={["trmrk-app-module", appThemeClassName, appModeCssClass.value, props.className].join(" ")} ref={parentRef}>
    { props.showHeader ? <div className={["trmrk-app-module-header", props.headerClassName].join(" ")} ref={headerRef}>
      { props.headerContent }</div> : null }
    { (props.afterHeaderClassName && props.afterHeaderContent) ? 
      <div className={[props.afterHeaderClassName].join(" ")}>{props.afterHeaderContent}</div> : null }
    <main className={["trmrk-app-module-main-content", props.isCompactMode ? "trmrk-scrollable" : "", props.mainClassName ?? ""].join(" ")} ref={mainRef}>
      {props.mainContent}</main>
  </div>);
}
