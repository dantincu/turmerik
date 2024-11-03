import React from "react";
import { useDispatch } from "react-redux";

import IndexedDbBrowser from "../../indexedDbBrowser/IndexedDbBrowser";

import { AppBarSelectors, AppBarReducers } from "../../../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../../../redux/appData";

export interface IndexedDbBrowserPageProps {
  urlPath: string
  rootPath: string;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
}

export default function IndexedDbBrowserPage(
  props: IndexedDbBrowserPageProps) {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(props.appDataReducers.setCurrentUrlPath(props.urlPath));
    dispatch(props.appBarReducers.setShowAppHeader(true));
    dispatch(props.appBarReducers.setShowAppFooter(true));
  });

  return (<IndexedDbBrowser
    appBarSelectors={props.appBarSelectors}
    appBarReducers={props.appBarReducers}
    appDataSelectors={props.appDataSelectors}
    appDataReducers={props.appDataReducers}
    basePath={props.urlPath}
    rootPath={props.rootPath} />);
}
