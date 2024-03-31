import React from "react";
import { useDispatch } from "react-redux";

import IndexedDbEditDb from "../../indexedDbBrowser/IndexedDbEditDb";

import { appDataReducers } from "../../../../store/appDataSlice";

import trmrk from "trmrk";
export interface IndexedDbBrowserCreateDbPageProps {
  headerRef: React.MutableRefObject<HTMLDivElement | undefined>;
  bodyRef: React.MutableRefObject<HTMLDivElement | undefined>;
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
  }, [ props.urlPath ]);

  return (<IndexedDbEditDb basePath={basePath} isNewDb={true} headerRef={props.headerRef} bodyRef={props.bodyRef} />);
}
