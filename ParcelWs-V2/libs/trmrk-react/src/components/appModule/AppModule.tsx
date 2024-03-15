import React from "react";

import AppPanel, { AppPanelProps } from "../appPanel/AppPanel";

import { isIPadOrIphone, isAndroid, isMobile } from "../../constants";

import { getAppTheme, currentAppTheme } from "../../app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "../../utils";

import "./AppModule.scss";

export interface AppModuleProps extends AppPanelProps {
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

export default function AppModule(
  props: AppModuleProps
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

  retProps.className = ["trmrk-app-module", appThemeClassName, appModeCssClass.value, retProps.className].join(" ");
  retProps.headerClassName = ["trmrk-app-module-header", retProps.headerClassName].join(" ");
  retProps.bodyClassName = ["trmrk-app-module-body", retProps.bodyClassName].join(" ");
  retProps.bodyBottomPaddingFactor ??= bodyBottomPaddingFactor;

  return (<AppPanel {...retProps}></AppPanel>);
}
