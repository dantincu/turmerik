import { Component, JSX } from "solid-js";

import Panel from "./Panel";

export interface SplitContainerProps {
  splitVertically: boolean;
  panel1Children: JSX.Element | JSX.Element[];
  panel2Children: JSX.Element | JSX.Element[];
  panel1Srollable?: boolean | null | undefined;
  panel2Srollable?: boolean | null | undefined;
}

const SplitContainer: Component<SplitContainerProps> = (props) => {
  return (<div class={["trmrk-spilt-container",
      props.splitVertically ? "trmrk-vertically-split-container" : "trmrk-horizontally-split-container"].join(" ")}>
      <Panel cssClass="trmrk-first-panel" isScrollable={props.panel1Srollable}>
        {props.panel1Children}
      </Panel>
      
      <Panel cssClass="trmrk-second-panel" isScrollable={props.panel2Srollable}>
        {props.panel2Children}
      </Panel>
    </div>);
}

export default SplitContainer;
