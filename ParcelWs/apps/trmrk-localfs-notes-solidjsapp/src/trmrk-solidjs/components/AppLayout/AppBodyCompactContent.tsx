import { Component } from "solid-js";

import { useAppContext } from "../../dataStore/core";

import AppExplorerPanel from "./AppExplorerPanel";
import PanelsContainer from "./PanelsContainer";

import { appBodyPanel1Content, appBodyPanel2Content, appBodyPanel3Content, appBodyPanel4Content } from "../../signals/core";

export interface AppBodyCompactContentProps {

}

const AppBodyCompactContent: Component<AppBodyCompactContentProps> = (props: AppBodyCompactContentProps) => {
  const { appData } = useAppContext();

  const appLayout = appData.appLayout;
  const appBody = appLayout.appBody;
  const explorerPanel = appLayout.explorerPanel;

  if (explorerPanel.enabled && explorerPanel.show) {
    return (<AppExplorerPanel />);
  } else {
    return (<PanelsContainer>
      { appBody.secondContainerIsFocused ?
          appBody.secondPanelIsFocused ? appBodyPanel4Content() : appBodyPanel3Content() :
          appBody.secondPanelIsFocused ? appBodyPanel2Content() : appBodyPanel1Content() }
    </PanelsContainer>)
  }
}

export default AppBodyCompactContent;
