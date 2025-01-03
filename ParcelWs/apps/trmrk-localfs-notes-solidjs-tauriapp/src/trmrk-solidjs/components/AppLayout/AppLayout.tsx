import { ParentComponent, createEffect } from 'solid-js';

import {
  updateHtmlDocTitle,
  getAppThemeCssClassName,
  getAppModeCssClassName,
} from "../../../trmrk-browser/domUtils/core";

import { useAppContext } from "../../dataStore/core";

import AppBody from "./AppBody";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

export interface AppLayoutProps {
}

const AppLayout: ParentComponent<AppLayoutProps> = () => {
  const { appData } = useAppContext();

  const appLayout = appData.appLayout;
  const appHeader = appLayout.appHeader;
  const appFooter = appLayout.appFooter;

  createEffect(() => {
    updateHtmlDocTitle([
        appData.docTitle,
        appData.defaultDocTitle,
        appData.appTitle,
        appData.defaultAppTitle,
      ].find((str) => str) ?? "");
  });

  return (<div class={["trmrk-app-layout", getAppThemeCssClassName(
    appLayout.isDarkMode), getAppModeCssClassName(
      appLayout.isCompactMode), appLayout.appLayoutCssClass ?? ""].join(" ")}>
    { appHeader.show ? <AppHeader /> : null }
    <AppBody />
    { appFooter.show ? <AppFooter /> : null }
  </div>);
}

export default AppLayout;
