import { ParentComponent, JSX } from "solid-js";

export interface PanelProps {
  cssClass?: string | null | undefined;
}

const Panel: ParentComponent<PanelProps> = (props) => {
  return (<div class={["trmrk-panel", props.cssClass ?? ""].join(" ")}>
    {props.children}
  </div>);
}

export default Panel;
