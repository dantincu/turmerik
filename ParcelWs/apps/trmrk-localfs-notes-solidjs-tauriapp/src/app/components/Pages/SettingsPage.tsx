import { Component, onMount } from 'solid-js';

import { produce } from "solid-js/store";

import { AppData } from "../../dataStore/core";

import { useAppContext } from "../../dataStore/AppContext";

import AppBodyContent from "../../../trmrk-solidjs/components/AppLayout/AppBodyContent";

import { setAppBodyPanel1Content, setAppHeaderOptionsContent } from "../../../trmrk-solidjs/signals/core";

const SettingsPage: Component = () => {
  const { appData, setAppDataFull, setAppData } = useAppContext();

  onMount(() => {
    setAppBodyPanel1Content(<div class="container">panel 1 <a href="https://google.com" target="_new">google</a></div>);

    setAppDataFull(produce((draft: AppData) => {
      draft.appLayout.appHeader.show = true;
      draft.appLayout.appHeader.goToParentBtn.isVisible = false;
      draft.appLayout.appFooter.show = true;
      draft.appLayout.appFooter.showUndoRedoBtns = false;
      draft.appLayout.explorerPanel.isEnabled = false;
    }));
  });

  return (<AppBodyContent />);
};

export default SettingsPage;
