import { ParentComponent, JSX } from "solid-js";

import { SplitPanelOrientation } from "../../dataStore/core";

import SplitContainer from "./SplitContainer";
import Panel from "./Panel";

export interface PanelsContainerProps {
  cssClass?: string | null | undefined;
  splitOrientation?: SplitPanelOrientation | null | undefined;
  altPanelChildren?: (() => JSX.Element | JSX.Element[] | null | undefined) | null | undefined;
  panel1Srollable?: boolean | null | undefined;
  panel2Srollable?: boolean | null | undefined;
}

const PanelsContainer: ParentComponent<PanelsContainerProps> = (props) => {
  return (<div class={["trmrk-panels-container", props.cssClass ?? ""].join(" ")}>
    { props.splitOrientation ? <SplitContainer
      splitVertically={props.splitOrientation == SplitPanelOrientation.Vertical }
      panel1Children={props.children}
      panel2Children={(props.altPanelChildren ?? (() => null))()}
      panel1Srollable={props.panel1Srollable}
      panel2Srollable={props.panel2Srollable} /> : <Panel cssClass="trmrk-single-panel"
        isScrollable={props.panel1Srollable}>{props.children}</Panel> }
  </div>);
}

export default PanelsContainer;
