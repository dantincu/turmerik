import React from "react";

import FloatingTopBarPanel, { FloatingTopBarPanelProps } from "../floatingTopBarPanel/FloatingTopBarPanel";

import { isIPadOrIphone, isAndroid, isMobile } from "trmrk-browser/src/domUtils/constants";

import { getAppTheme, currentAppTheme } from "../../app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-browser/src/domUtils/core";

import "./FloatingTopBarModule.scss";

export interface FloatingTopBarModuleProps extends FloatingTopBarPanelProps {
  isDarkMode?: boolean | null | undefined;
  isCompactMode?: boolean | null | undefined;
}

export const getBodyBottomPaddingFactor = () => {
  let bodyBottomPaddingFactor: number | null = null;

  if (isMobile) {
    if (isIPadOrIphone) {
      bodyBottomPaddingFactor = 2;
    } else if (isAndroid) {
      bodyBottomPaddingFactor = 1;
    }
  }

  return bodyBottomPaddingFactor;
}

export const bodyBottomPaddingFactor = getBodyBottomPaddingFactor();

export default function FloatingTopBarModule(
  props: FloatingTopBarModuleProps
) {
  let appThemeClassName = "";

  if (typeof props.isDarkMode === "boolean") {
    const appTheme = getAppTheme({
      isDarkMode: props.isDarkMode
    });

    currentAppTheme.value = appTheme;
    appThemeClassName = appTheme.cssClassName;
  }

  if (typeof props.isCompactMode === "boolean") {
    appModeCssClass.value = getAppModeCssClassName(props.isCompactMode);
  }

  const retProps = {...props};
  retProps.className ??= "";
  retProps.headerClassName ??= "";
  retProps.bodyClassName ??= "";

  retProps.className = ["trmrk-ftb-module", appThemeClassName, appModeCssClass.value, retProps.className].join(" ");
  retProps.headerClassName = ["trmrk-ftb-module-header", retProps.headerClassName].join(" ");
  retProps.bodyClassName = ["trmrk-ftb-module-body", retProps.bodyClassName].join(" ");
  retProps.bodyBottomPaddingFactor ??= bodyBottomPaddingFactor;

  return (<FloatingTopBarPanel {...retProps}></FloatingTopBarPanel>);
}
