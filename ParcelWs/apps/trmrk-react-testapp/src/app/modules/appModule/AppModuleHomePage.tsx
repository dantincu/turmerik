import React from "react";
import { Link } from "react-router-dom";

import Button from "@mui/material/Button";

export interface AppModuleHomePageProps {
  basePath: string;
  rootPath: string;
}

import AppBarsPagePanel from "../../../trmrk-react/components/barsPanel/AppBarsPagePanel";

import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";

import ClickableElement from "../../../trmrk-react/components/clickableElement/ClickableElement";

export default function AppModuleHomePage(props: AppModuleHomePageProps) {
  const [ text, setText ] = React.useState("");
  
  return (<AppBarsPagePanel basePath={props.basePath}
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}>
    <ClickableElement
        component={Button}
        componentProps={{ className: "trmrk-button" }}
        onSinglePress={(ev, coords) => {
          setText("single press");
        }} onDoublePress={(ev, coords) => {
          setText("double press");
        }} onLongPress={(ev, coords) => {
          setText("long press");
        }} onMouseDownOrTouchStart={(ev, coords) => {
          setText("");
        }}>PRESS</ClickableElement>

    <p>{ text }</p>
  </AppBarsPagePanel>);
}
