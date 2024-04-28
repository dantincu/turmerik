import React from "react";
import { useDispatch } from "react-redux";

import { Link } from "react-router-dom";

import Box from "@mui/material/Box";

import { appDataReducers, appDataSelectors } from "../../store/appDataSlice";
import { appBarReducers, appBarSelectors } from "../../store/appBarDataSlice";

import AppBarsPanel from "../../components/barsPanel/AppBarsPanel";

export interface DevModuleHomePageProps {
  urlPath: string;
  exitPath: string;
}

export default function DevModuleHomePage(
  props: DevModuleHomePageProps
) {
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(appDataReducers.setCurrentUrlPath(props.urlPath));
    dispatch(appBarReducers.setShowAppHeader(true));
    dispatch(appBarReducers.setShowAppFooter(true));
  });

  return (<AppBarsPanel
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}
      basePath={props.urlPath}>
    <Box>
      <ul className="trmrk-ul">
        <li><Link to={props.exitPath} className="trmrk-nav-link">Exit</Link></li>
        <li><Link to="indexeddb-browser" className="trmrk-nav-link">IndexedDB Browser</Link></li>
      </ul>
    </Box>
  </AppBarsPanel>);
}
