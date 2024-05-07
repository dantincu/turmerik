import React from "react";
import { useDispatch } from "react-redux";

import IndexedDbEditDb from "../../indexedDbBrowser/IndexedDbEditDb";

import { AppBarSelectors, AppBarReducers } from "../../../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../../../redux/appData";

import trmrk from "../../../../../trmrk";

export interface IndexedDbBrowserCreateDbPageProps {
  urlPath: string;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
}

export default function IndexedDbBrowserCreateDbPage(
  props: IndexedDbBrowserCreateDbPageProps) {
  const dispatch = useDispatch();

  const basePath = trmrk.trimStr(props.urlPath, {
    trimEnd: true, trimStr: "/"
  }).split('/').filter((_, idx, arr) => idx < arr.length - 1).join("/");
  
  React.useEffect(() => {
    dispatch(props.appDataReducers.setCurrentUrlPath(props.urlPath));
    dispatch(props.appBarReducers.setShowAppHeader(true));
    dispatch(props.appBarReducers.setShowAppFooter(true));
  }, [ props.urlPath ]);

  return (<IndexedDbEditDb
    appBarSelectors={props.appBarSelectors}
    appBarReducers={props.appBarReducers}
    appDataSelectors={props.appDataSelectors}
    appDataReducers={props.appDataReducers}
    basePath={basePath}
    isNewDb={true} />);
}
