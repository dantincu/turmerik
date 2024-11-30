import { ParentComponent, JSX } from "solid-js";

import { SplitPanelOrientation } from "../../dataStore/core";

import SplitContainer from "./SplitContainer";
import Panel from "./Panel";

export interface PanelsContainerProps {
  splitOrientation?: SplitPanelOrientation | null | undefined;
  altPanelChildren?: (() => JSX.Element | JSX.Element[] | null | undefined) | null | undefined;
}

const PanelsContainer: ParentComponent<PanelsContainerProps> = (props) => {
  return (<div class="trmrk-panels-container">
    { props.splitOrientation ? <SplitContainer
      splitVertically={props.splitOrientation == SplitPanelOrientation.Vertical }
      panel1Children={props.children}
      panel2Children={(props.altPanelChildren ?? (() => null))()} /> : <Panel cssClass="trmrk-single-panel">{props.children}</Panel> }
  </div>);
}

export default PanelsContainer;
