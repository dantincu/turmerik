import { Component, createMemo } from "solid-js";

import { SplitPanelOrientation, useAppContext } from "../../dataStore/core";

import PanelsContainer from "./PanelsContainer";
import Panel from "./Panel";

import { appBodyPanel1Content, appBodyPanel2Content, appBodyPanel3Content, appBodyPanel4Content } from "../../signals/core";

export interface AppBodyContentProps {

}

const AppBodyContent: Component<AppBodyContentProps> = () => {
  const { appData } = useAppContext();

  const appLayout = appData.appLayout;
  const appBody = appLayout.appBody;

  const oppositeSplitOrientation = createMemo(
    () => appBody.splitOrientation === SplitPanelOrientation.Vertical ? SplitPanelOrientation.Horizontal : SplitPanelOrientation.Vertical);

  return (appLayout.isCompactMode ? <Panel isScrollable={
    appBody.secondContainerIsFocused ?
    appBody.secondPanelIsFocused ? appBody.appBodyPanel4Scrollable : appBody.appBodyPanel3Scrollable : 
    appBody.secondPanelIsFocused ? appBody.appBodyPanel2Scrollable : appBody.appBodyPanel1Scrollable
  }>
      { appBody.secondContainerIsFocused ?
        appBody.secondPanelIsFocused ? appBodyPanel4Content() : appBodyPanel3Content() :
        appBody.secondPanelIsFocused ? appBodyPanel2Content() : appBodyPanel1Content() }
    </Panel> : <PanelsContainer splitOrientation={ appBody.splitOrientation }
    altPanelChildren={
      () => <PanelsContainer
          splitOrientation={ appBody.secondContainerIsFurtherSplit ? oppositeSplitOrientation() : SplitPanelOrientation.None }
          altPanelChildren={ () => appBodyPanel4Content() }
          panel1Srollable={ appBody.appBodyPanel3Scrollable }
          panel2Srollable={ appBody.appBodyPanel4Scrollable }>
        { appBodyPanel3Content() }</PanelsContainer>
    }>
      <PanelsContainer
        splitOrientation={ appBody.firstContainerIsFurtherSplit ? oppositeSplitOrientation() : SplitPanelOrientation.None }
        altPanelChildren={ () => appBodyPanel2Content() }
        panel1Srollable={ appBody.appBodyPanel1Scrollable }
        panel2Srollable={ appBody.appBodyPanel2Scrollable }>
        { appBodyPanel1Content() }
      </PanelsContainer>
    </PanelsContainer>);
}

export default AppBodyContent;
