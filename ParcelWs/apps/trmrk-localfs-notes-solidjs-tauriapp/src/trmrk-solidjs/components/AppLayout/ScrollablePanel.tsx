import { ParentComponent } from "solid-js";

import Panel from "./Panel";

export interface ScrollablePanelProps {
  cssClass?: string | null | undefined;
}

const ScrollablePanel: ParentComponent<ScrollablePanelProps> = (props) => {
  return (<Panel cssClass={["trmrk-scrollable-panel trmrk-scrollable overflow-scrollable", props.cssClass ?? ""].join(" ")}>
    {props.children}
  </Panel>);
}

export default ScrollablePanel;
