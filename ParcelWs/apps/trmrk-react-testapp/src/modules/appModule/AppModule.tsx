import React from "react";

import Input from "@mui/material/Input";

export interface AppModuleProps {
  basePath: string;
  rootPath: string;
}

import AppBarsPanel from "../../components/barsPanel/AppBarsPanel";

import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";

export default function AppModule(props: AppModuleProps) {
  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
        <Input sx={{ margin: "auto", top: "500px", position: "relative" }} />
  </AppBarsPanel>);
}
