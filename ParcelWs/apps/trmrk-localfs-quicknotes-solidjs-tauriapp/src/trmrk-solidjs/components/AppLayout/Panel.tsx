import { ParentComponent } from "solid-js";

export interface PanelProps {
  cssClass?: string | null | undefined;
  isScrollable?: boolean | null | undefined;
}

const Panel: ParentComponent<PanelProps> = (props) => {
  // console.log("props.isScrollable", props.isScrollable);

  return (<div class={["trmrk-panel", props.isScrollable ? "trmrk-scrollable overflow-scroll" : "", props.cssClass ?? ""].join(" ")}>
    {props.children}
  </div>);
}

export default Panel;
