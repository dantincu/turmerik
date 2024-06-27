import React from "react";
import { Link } from "react-router-dom";

export interface AppModuleHomePageProps {
  basePath: string;
  rootPath: string;
}

import AppBarsPagePanel from "../../../trmrk-react/components/barsPanel/AppBarsPagePanel";

import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";

export default function AppModuleHomePage(props: AppModuleHomePageProps) {
  
  return (<AppBarsPagePanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}
      showDocEditUndoRedoButtons={true}
      showDocPositionNavButtons={true}>
    { null }
  </AppBarsPagePanel>);
}
