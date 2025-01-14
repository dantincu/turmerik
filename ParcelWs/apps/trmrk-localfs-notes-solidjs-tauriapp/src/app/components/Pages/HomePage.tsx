import { Component, onMount } from 'solid-js';

import { produce } from "solid-js/store";

import { AppData } from "../../dataStore/core";

import { useAppContext } from "../../dataStore/AppContext";

import AppBodyContent from "../../../trmrk-solidjs/components/AppLayout/AppBodyContent";

import { setAppBodyPanel1Content, setAppHeaderOptionsContent } from "../../../trmrk-solidjs/signals/core";

const HomePage: Component = () => {
  const { appData, setAppDataFull, setAppData } = useAppContext();

  onMount(() => {
    setAppBodyPanel1Content(<p>panel 1 <a href="https://google.com" target="_new">google</a></p>);

    setAppHeaderOptionsContent(<p>asdfasdfasdf</p>);

    setAppDataFull(produce((draft: AppData) => {
      draft.appLayout.appHeader.show = true;
      draft.appLayout.appHeader.goToParentBtn.isVisible = true;
      draft.appLayout.appFooter.show = true;
      draft.appLayout.appFooter.showUndoRedoBtns = true;
    }));
  });

  return (<AppBodyContent />);
};

export default HomePage;
