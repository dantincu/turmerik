import { ParentComponent, createEffect } from 'solid-js';

import {
  updateHtmlDocTitle,
  getAppThemeCssClassName,
  getAppModeCssClassName,
} from "../../../trmrk-browser/domUtils/core";

import { useAppContext } from "../../dataStore/core";

import { appHiddenContent } from "../../signals/core";

import AppBody from "./AppBody";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";

export interface AppLayoutProps {
}

const AppLayout: ParentComponent<AppLayoutProps> = (props) => {
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
      appLayout.isCompactMode),
      appHeader.show ? "trmrk-has-header" : "",
      appFooter.show ? "trmrk-has-footer" : "",
      appLayout.appLayoutCssClass ?? ""].join(" ")}>
    { appHeader.show ? <AppHeader /> : null }
    <AppBody>{props.children}</AppBody>
    { appFooter.show ? <AppFooter /> : null }
    <div class="absolute hidden block">{appHiddenContent()}</div>
  </div>);
}

export default AppLayout;
