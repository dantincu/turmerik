import React from "react";
import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import Box from "@mui/material/Box";

import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../redux/appData";

import AppBarsPanel from "../../components/barsPanel/AppBarsPanel";

export interface DevModuleHomePageProps {
  urlPath: string;
  exitPath: string;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
}

export default function DevModuleHomePage(
  props: DevModuleHomePageProps
) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(props.appDataReducers.setCurrentUrlPath(props.urlPath));
    dispatch(props.appBarReducers.setShowAppHeader(true));
    dispatch(props.appBarReducers.setShowAppFooter(true));
  });

  return (<AppBarsPanel
      appBarSelectors={props.appBarSelectors}
      appBarReducers={props.appBarReducers}
      appDataSelectors={props.appDataSelectors}
      appDataReducers={props.appDataReducers}
      basePath={props.urlPath}>
    <Box>
      <ul className="trmrk-ul">
        <li><Link to={props.exitPath} className="trmrk-nav-link">Exit</Link></li>
        <li><Link to="indexeddb-browser" className="trmrk-nav-link">IndexedDB Browser</Link></li>
      </ul>
    </Box>
  </AppBarsPanel>);
}
