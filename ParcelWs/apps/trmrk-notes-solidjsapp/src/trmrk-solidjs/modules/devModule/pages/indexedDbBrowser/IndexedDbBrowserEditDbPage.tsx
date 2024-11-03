import React from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import trmrk from "../../../../../trmrk";

import { jsonBool } from "../../../../../trmrk/core";

import { searchQuery } from "../../indexedDbBrowser/data";

import IndexedDbEditDb from "../../indexedDbBrowser/IndexedDbEditDb";

import { AppBarSelectors, AppBarReducers } from "../../../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../../../redux/appData";

export interface IndexedDbBrowserEditDbPageProps {
  urlPath: string;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
}

export default function IndexedDbBrowserEditDbPage(
  props: IndexedDbBrowserEditDbPageProps) {
  const dispatch = useDispatch();

  const basePath = trmrk.trimStr(props.urlPath, {
    trimEnd: true, trimStr: "/"
  }).split('/').filter((_, idx, arr) => idx < arr.length - 1).join("/");

  const [ searchParams, setSearchParams ] = useSearchParams();

  const [ dbName, setDbName ] = React.useState(
    searchParams.get(searchQuery.dbName));

  const [ showCreateSuccessMsgValue, setShowCreateSuccessMsgValue ] = React.useState(
    searchParams.get(searchQuery.showCreateSuccessMsg));

  const [ showCreateSuccessMsg, setShowCreateSuccessMsg ] = React.useState(
    showCreateSuccessMsgValue === jsonBool.true
  );
  
  React.useEffect(() => {
    dispatch(props.appDataReducers.setCurrentUrlPath(props.urlPath));
    dispatch(props.appBarReducers.setShowAppHeader(true));
    dispatch(props.appBarReducers.setShowAppFooter(true));

    if ((showCreateSuccessMsgValue ?? null) !== null) {
      searchParams.delete(searchQuery.showCreateSuccessMsg);
      setSearchParams(searchParams);
    }
  }, [ props.urlPath,
    searchParams,
    dbName,
    showCreateSuccessMsgValue,
    showCreateSuccessMsg ]);

  return (<IndexedDbEditDb
    appBarSelectors={props.appBarSelectors}
    appBarReducers={props.appBarReducers}
    appDataSelectors={props.appDataSelectors}
    appDataReducers={props.appDataReducers}
    basePath={basePath}
    isNewDb={false}
    dbName={dbName}
    showCreateSuccessMsg={showCreateSuccessMsg} />);
}
