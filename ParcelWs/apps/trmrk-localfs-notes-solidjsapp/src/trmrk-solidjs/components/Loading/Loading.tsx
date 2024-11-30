import { Component, onMount } from 'solid-js';

export interface LoadingProps {
  cssClass?: string | null | undefined;
}

const Loading: Component<LoadingProps> = (props: LoadingProps) => {
  return (<div class={["trmrk-loading-el", props.cssClass ?? ""].join(" ")}>
    <div class="trmrk-loading-el-dot-pulse"></div>
  </div>);
}

export default Loading;
