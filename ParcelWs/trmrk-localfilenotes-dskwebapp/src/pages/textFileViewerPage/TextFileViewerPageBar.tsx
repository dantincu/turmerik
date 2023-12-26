import React from "react";

import Grid from "@mui/material/Grid";

import { AppBarData, appBarCtxReducer, AppPage } from "../../app/appData";
import { AppBarDataContext, isDocEditMode, createAppBarContext } from "../../app/AppContext";

export default function TextFileViewerPageBar() {
  return (<Grid gridRow={1}  className="trmrk-app-page-bar trmrk-text-file-viewer-page-bar"></Grid>)
}
