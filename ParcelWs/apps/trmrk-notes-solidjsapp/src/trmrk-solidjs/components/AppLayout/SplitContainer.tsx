import { Component, JSX } from "solid-js";

import Panel from "./Panel";
import ScrollablePanel from "./ScrollablePanel";

export interface SplitContainerProps {
  splitVertically: boolean;
  panel1Children: JSX.Element | JSX.Element[];
  panel2Children: JSX.Element | JSX.Element[];
}

const SplitContainer: Component<SplitContainerProps> = (props: SplitContainerProps) => {
  return (<footer class={["trmrk-spilt-container",
      props.splitVertically ? "trmrk-vertically-split-container" : "trmrk-horizontally-split-container"].join(" ")}>
      <Panel cssClass="trmrk-first-panel">
        {props.panel1Children}
      </Panel>
      
      <Panel cssClass="trmrk-second-panel">
        {props.panel2Children}
      </Panel>
    </footer>);
}

export default SplitContainer;
