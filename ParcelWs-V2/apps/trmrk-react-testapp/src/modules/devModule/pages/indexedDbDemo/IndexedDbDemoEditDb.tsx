import React from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";

import trmrk from "trmrk";

import { jsonBool } from "trmrk/src/core";

import { searchQuery } from "../../indexedDbBrowser/data";

import IndexedDbEditDb from "../../indexedDbBrowser/IndexedDbEditDb";

import { appDataReducers } from "../../../../store/appDataSlice";

export interface IndexedDbDemoEditDbProps {
  urlPath: string;
}

export default function IndexedDbDemoEditDb(
  props: IndexedDbDemoEditDbProps) {
  const dispatch = useDispatch();

  const basePath = trmrk.trimStr(props.urlPath, {
    trimEnd: true, trimStr: "/"
  }).split('/').filter((_, idx, arr) => idx < arr.length - 1).join("/");

  const [ searchParams, setSearchParams ] = useSearchParams();

  const [ showCreateSuccessMsgValue, setShowCreateSuccessMsgValue ] = React.useState(
    searchParams.get(searchQuery.showCreateSuccessMsg));

  const [ showCreateSuccessMsg, setShowCreateSuccessMsg ] = React.useState(
    showCreateSuccessMsgValue === jsonBool.true
  );
  
  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));

    if ((showCreateSuccessMsgValue ?? null) !== null) {
      searchParams.delete(searchQuery.showCreateSuccessMsg);
      setSearchParams(searchParams);
    }
  }, [ props.urlPath,
    searchParams,
    showCreateSuccessMsgValue,
    showCreateSuccessMsg ]);

  return (<IndexedDbEditDb basePath={basePath} showCreateSuccessMsg={showCreateSuccessMsg} />);
}
