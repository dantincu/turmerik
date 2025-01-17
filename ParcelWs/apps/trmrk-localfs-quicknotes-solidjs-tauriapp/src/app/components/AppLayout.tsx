import { ParentComponent, createEffect, onMount } from 'solid-js';

import { useLocation } from "@solidjs/router";

import { produce } from "solid-js/store";

import { AppData } from "../dataStore/core";
import { useAppContext } from "../dataStore/AppContext";

import AppLayoutCore from "../../trmrk-solidjs/components/AppLayout/AppLayout";
import Panel from "../../trmrk-solidjs/components/AppLayout/Panel";
import AppHiddenContent from "../../trmrk-solidjs/components/AppLayout/AppHiddenContent";

import { setAppHiddenContent } from "../../trmrk-solidjs/signals/core";

const AppLayout: ParentComponent = (props) => {
  const { appData, setAppDataFull, setAppData } = useAppContext();
  const location = useLocation();

  onMount(() => {
    setAppHiddenContent(<AppHiddenContent />);
  });

  createEffect(() => {
    switch (location.pathname) {
      case "/app":
        setAppDataFull(produce((draft: AppData) => {
          draft.appLayout.appHeader.show = true;
          draft.appLayout.appHeader.goToParentBtn.isVisible = true;
          draft.appLayout.appFooter.show = true;
          draft.appLayout.appFooter.showUndoRedoBtns = true;
          draft.appLayout.explorerPanel.isEnabled = true;
        }));
        break;
      case "/app/settings":
        setAppDataFull(produce((draft: AppData) => {
          draft.appLayout.appHeader.show = true;
          draft.appLayout.appHeader.goToParentBtn.isVisible = false;
          draft.appLayout.appFooter.show = true;
          draft.appLayout.appFooter.showUndoRedoBtns = false;
          draft.appLayout.explorerPanel.isEnabled = false;
        }));
        break;
      default:
        setAppDataFull(produce((draft: AppData) => {
          draft.appLayout.appHeader.show = false;
          draft.appLayout.appFooter.show = false;
        }));
        break;
    }
  });

  return (<AppLayoutCore>
      <Panel isScrollable={true}>
        {props.children}
      </Panel>
    </AppLayoutCore>);
}

export default AppLayout;
