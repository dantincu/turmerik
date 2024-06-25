import React from "react";
import { Link } from "react-router-dom";

export interface AppModuleHomePageProps {
  basePath: string;
  rootPath: string;
}

import AppBarsPanel from "../../../trmrk-react/components/barsPanel/AppBarsPanel";

import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";

export default function AppModuleHomePage(props: AppModuleHomePageProps) {
  
  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    { null }
  </AppBarsPanel>);
}
