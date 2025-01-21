import { Component } from "solid-js";

import Panel from "./Panel";

export interface AppExplorerPanelProps {

}

const AppExplorerPanel: Component<AppExplorerPanelProps> = () => {
  return (<Panel cssClass="trmrk-app-explorer-panel" isScrollable={true}>

  </Panel>);
}

export default AppExplorerPanel;
