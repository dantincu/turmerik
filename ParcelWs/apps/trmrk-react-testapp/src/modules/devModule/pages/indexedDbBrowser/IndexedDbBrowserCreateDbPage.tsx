import React from "react";
import { useDispatch } from "react-redux";

import IndexedDbEditDb from "../../indexedDbBrowser/IndexedDbEditDb";

import { appDataReducers } from "../../../../store/appDataSlice";
import { appBarReducers } from "../../../../store/appBarDataSlice";

import trmrk from "trmrk";
export interface IndexedDbBrowserCreateDbPageProps {
  urlPath: string;
}

export default function IndexedDbBrowserCreateDbPage(
  props: IndexedDbBrowserCreateDbPageProps) {
  const dispatch = useDispatch();

  const basePath = trmrk.trimStr(props.urlPath, {
    trimEnd: true, trimStr: "/"
  }).split('/').filter((_, idx, arr) => idx < arr.length - 1).join("/");
  
  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
    dispatch(appBarReducers.setShowAppHeader(true));
    dispatch(appBarReducers.setShowAppFooter(true));
  }, [ props.urlPath ]);

  return (<IndexedDbEditDb basePath={basePath} isNewDb={true} />);
}
