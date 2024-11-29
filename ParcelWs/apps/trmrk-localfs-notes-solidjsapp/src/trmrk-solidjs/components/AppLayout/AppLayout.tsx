import { Component, useContext, createEffect } from 'solid-js';

import {
  updateHtmlDocTitle,
  getAppThemeCssClassName,
  getAppModeCssClassName,
} from "../../../trmrk-browser/domUtils/core";

import { AppContext } from "../../dataStore/core";

export interface AppLayoutProps {
  appLayoutClassName?: string | null | undefined;
}

const AppLayout: Component<AppLayoutProps> = (props: AppLayoutProps) => {
  const appData = useContext(AppContext);

  createEffect(() => {
    updateHtmlDocTitle([
        appData.docTitle,
        appData.defaultDocTitle,
        appData.appTitle,
        appData.defaultAppTitle,
      ].find((str) => str) ?? "");
  });

  return (<div class={["trmrk-app-layout", getAppThemeCssClassName(
    appData.appLayout.isDarkMode), getAppModeCssClassName(
      appData.appLayout.isCompactMode), props.appLayoutClassName ?? ""].join(" ")}>
    
  </div>);
}

export default AppLayout;
