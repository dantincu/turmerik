import React from "react";
import { useDispatch } from "react-redux";

import IndexedDbBrowser from "../../../components/indexedDbBrowser/IndexedDbBrowserV2";

import { appDataReducers } from "../../../store/appDataSlice";

export interface IndexedDbDemoProps {
  urlPath: string
}

export default function IndexedDbDemo(
  props: IndexedDbDemoProps) {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
  });

  return (<IndexedDbBrowser />);
}
