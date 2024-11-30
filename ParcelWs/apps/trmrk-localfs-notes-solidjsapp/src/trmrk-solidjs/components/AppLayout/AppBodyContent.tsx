import { Component, createMemo } from "solid-js";

import { SplitPanelOrientation, useAppContext } from "../../dataStore/core";

import PanelsContainer from "./PanelsContainer";

import { appBodyPanel1Content, appBodyPanel2Content, appBodyPanel3Content, appBodyPanel4Content } from "../../signals/core";

export interface AppBodyContentProps {

}

const AppBodyContent: Component<AppBodyContentProps> = (props: AppBodyContentProps) => {
  const { appData } = useAppContext();

  const appLayout = appData.appLayout;
  const appBody = appLayout.appBody;

  const oppositeSplitOrientation = createMemo(
    () => appBody.splitOrientation === SplitPanelOrientation.Vertical ? SplitPanelOrientation.Horizontal : SplitPanelOrientation.Vertical)

  if (appBody.splitOrientation) {
    return (<PanelsContainer splitOrientation={appBody.splitOrientation} altPanelChildren={
      () => appBody.secondContainerIsFurtherSplit ? <PanelsContainer
          splitOrientation={oppositeSplitOrientation()}
          altPanelChildren={() => appBodyPanel4Content()}>
          { appBodyPanel3Content() }</PanelsContainer> : <PanelsContainer>
          { appBodyPanel3Content() }
        </PanelsContainer>
    }>
        { appBody.firstContainerIsFurtherSplit ? <PanelsContainer
            splitOrientation={oppositeSplitOrientation()}
            altPanelChildren={() => appBodyPanel2Content()}>
            { appBodyPanel1Content() }
          </PanelsContainer> : <PanelsContainer>
            { appBodyPanel1Content() }
          </PanelsContainer> }
      </PanelsContainer>);
  } else {
    return (<PanelsContainer>
        { appBody.secondContainerIsFocused ?
          appBody.secondPanelIsFocused ? appBodyPanel4Content() : appBodyPanel3Content() :
          appBody.secondPanelIsFocused ? appBodyPanel2Content() : appBodyPanel1Content() }
      </PanelsContainer>);
  }
}

export default AppBodyContent;
