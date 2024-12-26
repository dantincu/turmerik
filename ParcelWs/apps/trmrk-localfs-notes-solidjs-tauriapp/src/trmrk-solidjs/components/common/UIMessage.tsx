import { Component } from 'solid-js';

export interface UIMessageProps {
  message: string;
  paraCssClass?: string | null | undefined;
}

const UIMessage: Component<UIMessageProps> = (props: UIMessageProps) => {
  return (<p class={["mt-1 ml-1", props.paraCssClass, "mt-1 ml-1"].join(" ")}>
      {props.message}
    </p>);
}

export default UIMessage;
