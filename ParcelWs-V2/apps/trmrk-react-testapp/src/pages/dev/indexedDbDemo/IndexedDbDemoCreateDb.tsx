import React from "react";
import { useDispatch } from "react-redux";

import IndexedDbCreateDb from "../../../components/indexedDbBrowser/IndexedDbCreateDb";

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

  return (<IndexedDbCreateDb />);
}
