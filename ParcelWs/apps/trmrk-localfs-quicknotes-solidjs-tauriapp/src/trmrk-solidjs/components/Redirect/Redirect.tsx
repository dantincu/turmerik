import { Component, onMount } from 'solid-js';

export interface RedirectProps {
  redirectTo: string;
}

const Redirect: Component<RedirectProps> = (props: RedirectProps) => {
  onMount(() => {
    window.history.pushState({}, "", props.redirectTo);
  });

  return (<div class="trmrk-redirect"></div>);
}

export default Redirect;
