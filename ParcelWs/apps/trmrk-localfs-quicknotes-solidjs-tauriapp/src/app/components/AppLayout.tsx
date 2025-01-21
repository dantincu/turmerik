import { ParentComponent, createEffect, onMount } from 'solid-js';
import { useLocation } from "@solidjs/router";
import { produce } from "solid-js/store";
import { exists, BaseDirectory, stat, create } from '@tauri-apps/plugin-fs';
import * as path from '@tauri-apps/api/path';

import { AppData } from "../dataStore/core";
import { useAppContext } from "../dataStore/AppContext";

import AppLayoutCore from "../../trmrk-solidjs/components/AppLayout/AppLayout";
import AppBodyContent from "../../trmrk-solidjs/components/AppLayout/AppBodyContent";
import AppHiddenContent from "../../trmrk-solidjs/components/AppLayout/AppHiddenContent";

import { setAppHiddenContent, setAppBodyPanel1Content } from "../../trmrk-solidjs/signals/core";

const AppLayout: ParentComponent = (props) => {
  const { appData, setAppDataFull, setAppData } = useAppContext();
  const location = useLocation();

  onMount(async () => {
    setAppHiddenContent(<AppHiddenContent />);
    setAppBodyPanel1Content(props.children);

    /* const home = await path.homeDir();
    console.log("home", home);

    const existsResult = await exists("asdfasdf.txt", {
      baseDir: BaseDirectory.AppData
    });

    console.log("exists", existsResult);

    const file = await create('bar.txt', { baseDir: BaseDirectory.AppData });

    try {
      await file.write(new TextEncoder().encode('Hello world'));
    }
    finally {
      await file.close();
    } */
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
      <AppBodyContent />
    </AppLayoutCore>);
}

export default AppLayout;
