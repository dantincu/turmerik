import React from "react";
import { Link } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import FolderIcon from "@mui/icons-material/Folder";

export interface AppModuleHomePageProps {
}

import AppBarsPagePanel from "../../../trmrk-react/components/barsPanel/AppBarsPagePanel";

import { appBarSelectors, appBarReducers } from "../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../store/appDataSlice";

export default function AppModuleHomePage(props: AppModuleHomePageProps) {
  
  return (<AppBarsPagePanel
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}
      appFooterMainRowChildren={<React.Fragment>
        <Link to="folders"><IconButton className="trmrk-icon-btn"><FolderIcon /></IconButton></Link>
      </React.Fragment>}>
    { null }
  </AppBarsPagePanel>);
}
