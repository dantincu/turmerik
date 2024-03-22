import React from "react";
import { useDispatch } from "react-redux";

import trmrk from "trmrk";

import IndexedDbCreateDb from "../../indexedDbBrowser/IndexedDbCreateDb";

import { appDataReducers } from "../../../../store/appDataSlice";

export interface IndexedDbDemoCreateDbProps {
  urlPath: string;
}

export default function IndexedDbDemoCreateDb(
  props: IndexedDbDemoCreateDbProps) {
  const dispatch = useDispatch();

  const basePath = trmrk.trimStr(props.urlPath, {
    trimEnd: true, trimStr: "/"
  }).split('/').filter((_, idx, arr) => idx < arr.length - 1).join("/");
  
  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
  }, [ props.urlPath ]);

  return (<IndexedDbCreateDb basePath={basePath} />);
}
