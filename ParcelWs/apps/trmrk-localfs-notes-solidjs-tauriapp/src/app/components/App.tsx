import { Component } from 'solid-js';
import { produce } from "solid-js/store";

import AppLayout from "../../trmrk-solidjs/components/AppLayout/AppLayout";

import { AppData } from "../dataStore/core";

import { useAppContext } from "../dataStore/AppContext";

import { setAppBodyPanel1Content, setAppBodyPanel2Content, setAppBodyPanel3Content, setAppBodyPanel4Content } from "../../trmrk-solidjs/signals/core";
import { SplitPanelOrientation } from '../../trmrk-solidjs/dataStore/core';

const App: Component = () => {
  setAppBodyPanel1Content(<p>asdfasdf</p>);
  setAppBodyPanel2Content(<p>qwerqwer</p>);
  setAppBodyPanel3Content(<p>zxczxvcz</p>);
  setAppBodyPanel4Content(<p>tyuityui</p>);

  const { appData, setAppDataFull, setAppData } = useAppContext();

  const updateDraft = produce((draft: AppData) => {
    draft.appLayout.isCompactMode = false;
    const appBody = draft.appLayout.appBody;
    appBody.splitOrientation = SplitPanelOrientation.Horizontal;
    appBody.firstContainerIsFurtherSplit = true;
    appBody.secondContainerIsFurtherSplit = true;
  });

  setAppDataFull(updateDraft);

  return (<AppLayout />);
};

export default App;
