import React from "react";
import { useDispatch } from "react-redux";

import IndexedDbEditDb from "../../indexedDbBrowser/IndexedDbEditDb";

import { appDataReducers } from "../../../../store/appDataSlice";

import trmrk from "trmrk";
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

  return (<IndexedDbEditDb basePath={basePath} isNewDb={true} />);
}
