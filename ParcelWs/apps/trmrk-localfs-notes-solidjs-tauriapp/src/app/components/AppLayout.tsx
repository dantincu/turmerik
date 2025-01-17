import { ParentComponent, createEffect, onMount } from 'solid-js';

import { useSearchParams, useLocation } from "@solidjs/router";

import { produce } from "solid-js/store";

import { AppData } from "../dataStore/core";
import { useAppContext } from "../dataStore/AppContext";

import { setAppBodyPanel1Content } from "../../trmrk-solidjs/signals/core";

import AppLayoutCore from "../../trmrk-solidjs/components/AppLayout/AppLayout";
import AppBodyContent from "../../trmrk-solidjs/components/AppLayout/AppBodyContent";
import AppHiddenContent from "../../trmrk-solidjs/components/AppLayout/AppHiddenContent";

import NotFoundPage from "../../trmrk-solidjs/components/Error/NotFoundPage";

import HomePage from "./Pages/HomePage";
import SettingsPage from "./Pages/SettingsPage";

import { setAppHiddenContent } from "../../trmrk-solidjs/signals/core";

const AppLayout: ParentComponent = () => {
  const { appData, setAppDataFull, setAppData } = useAppContext();
  const location = useLocation();

  const getComponent = (pathname: string, search: string) => {
    console.log("getComponent", pathname, search);
    switch (pathname) {
      case "/app":
        return <HomePage />;
      case "/app/settings":
        return <SettingsPage />;
      default:
        return <NotFoundPage />;
    }
  };

  onMount(() => {
    setAppHiddenContent(<AppHiddenContent />);
  });

  createEffect(() => {
    setAppBodyPanel1Content(getComponent(location.pathname, location.search));
    
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

  return <AppLayoutCore><AppBodyContent /></AppLayoutCore>;
}

export default AppLayout;
