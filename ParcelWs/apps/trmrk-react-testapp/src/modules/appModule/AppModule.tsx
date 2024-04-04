import React from "react";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";

import Input from "@mui/material/Input";

export interface AppModuleProps {
  basePath: string;
  rootPath: string;
}

import AppBarsPanel from "../../components/barsPanel/AppBarsPanel";

import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";

const Ul = styled.ul({
  margin: "1em",
  padding: "1em",
  marginTop: "0px"
});

export default function AppModule(props: AppModuleProps) {
  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <Ul>
      <li><Link to={`${props.rootPath}dev`} className="trmrk-nav-link">Development Module</Link></li>
    </Ul>
  </AppBarsPanel>);
}
