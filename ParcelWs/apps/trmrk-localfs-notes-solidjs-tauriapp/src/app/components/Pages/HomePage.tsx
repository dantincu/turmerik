import { Component, onMount } from 'solid-js';

import AppBodyContent from "../../../trmrk-solidjs/components/AppLayout/AppBodyContent";

import { setAppBodyPanel1Content, setAppBodyPanel2Content, setAppBodyPanel3Content, setAppBodyPanel4Content } from "../../../trmrk-solidjs/signals/core";

const HomePage: Component = () => {
  onMount(() => {
    setAppBodyPanel1Content(<p>panel 1 <a href="https://google.com" target="_new">google</a></p>);
  });

  return (<AppBodyContent />);
};

export default HomePage;
