import React from "react";
import { useDispatch } from "react-redux";

import IndexedDbBrowser from "../../indexedDbBrowser/IndexedDbBrowser";

import { appDataReducers } from "../../../../store/appDataSlice";
import { appBarReducers } from "../../../../store/appBarDataSlice";

export interface IndexedDbBrowserPageProps {
  urlPath: string
}

export default function IndexedDbBrowserPage(
  props: IndexedDbBrowserPageProps) {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
    dispatch(appBarReducers.setShowAppHeader(true));
    dispatch(appBarReducers.setShowAppFooter(true));
  });

  return (<IndexedDbBrowser basePath={props.urlPath} />);
}
