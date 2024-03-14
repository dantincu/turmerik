import React from "react";
import { useDispatch } from "react-redux";

import IndexDbCreateDb from "../../../components/indexedDbBrowser/IndexDbCreateDb";

import { appDataReducers } from "../../../store/appDataSlice";

export interface IndexedDbDemoCreateDbProps {
  urlPath: string
}

export default function IndexedDbDemoCreateDb(
  props: IndexedDbDemoCreateDbProps) {
  const dispatch = useDispatch();
  
  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
  });

  return (<IndexDbCreateDb />);
}
