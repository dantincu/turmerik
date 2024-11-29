import { Component, onMount } from 'solid-js';

export interface LoadingProps {
  className?: string | null | undefined;
}

const Loading: Component<LoadingProps> = (props: LoadingProps) => {
  return (<div class={["trmrk-loading-el", props.className ?? ""].join(" ")}>
    <div class="trmrk-loading-el-dot-pulse"></div>
  </div>);
}

export default Loading;
