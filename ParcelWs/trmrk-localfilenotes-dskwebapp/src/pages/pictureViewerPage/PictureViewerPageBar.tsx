import React from "react";

import Grid from "@mui/material/Grid";

import { AppBarData, appBarCtxReducer, AppPage } from "../../app/appData";
import { AppBarDataContext, isDocEditMode, createAppBarContext } from "../../app/AppContext";

export default function PictureViewerPageBar() {
  return (<Grid gridRow={1}  className="trmrk-app-page-bar trmrk-picture-viewer-page-bar"></Grid>)
}
