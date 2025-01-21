import { Component } from 'solid-js';

export interface CaptionProps {
  caption: string;
  headerCssClass?: string | null | undefined;
}

const Caption: Component<CaptionProps> = (props: CaptionProps) => {
  return (<h2 class={["trmrk-caption text-2xl", props.headerCssClass, "mt-1 ml-1"].join(" ")}>
      {props.caption}
    </h2>);
}

export default Caption;
