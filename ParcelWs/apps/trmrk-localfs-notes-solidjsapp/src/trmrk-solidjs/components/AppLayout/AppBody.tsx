import { Component } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import AppBodyContent from "./AppBodyContent";

import AppExplorerPanel from "./AppExplorerPanel";

export interface AppBodyProps {

}

const AppBody: Component<AppBodyProps> = () => {
  const { appData } = useAppContext();

  const appLayout = appData.appLayout;
  const appHeader = appLayout.appHeader;
  const appFooter = appLayout.appFooter;
  const explorerPanel = appLayout.explorerPanel;

  return (<main class={["trmrk-app-body",
    appHeader.show ? "trmrk-after-header" : "",
    appFooter.show ? "trmrk-before-footer" : ""].join(" ")}>
      { explorerPanel.enabled ? <AppExplorerPanel></AppExplorerPanel> : null }
      <AppBodyContent></AppBodyContent>
    </main>);
}

export default AppBody;
