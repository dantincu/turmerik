import React from "react";
import { Link } from "react-router-dom";

export interface FoldersPageProps {
  basePath: string;
  rootPath: string;
}

import AppBarsPagePanel from "../../../../../trmrk-react/components/barsPanel/AppBarsPagePanel";

import { appBarSelectors, appBarReducers } from "../../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../../store/appDataSlice";

export default function FoldersPage(props: FoldersPageProps) {
  
  return (<AppBarsPagePanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    { null }
  </AppBarsPagePanel>);
}
