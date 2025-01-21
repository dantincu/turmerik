import { Component } from 'solid-js';

import { produce } from "solid-js/store";

import ErrorPage, { ErrorProps } from "./ErrorPage";

import { useAppContext, AppDataCore } from "../../dataStore/core";

const AppErrorPage: Component<ErrorProps> = (props) => {
  const { appData, setAppDataFull, setAppData } = useAppContext();

  setAppDataFull(produce(draft => {
    draft.appLayout.appHeader.show = false;
    draft.appLayout.appFooter.show = false;
  }));

  return (<ErrorPage {...props} />);
}

export default AppErrorPage;
