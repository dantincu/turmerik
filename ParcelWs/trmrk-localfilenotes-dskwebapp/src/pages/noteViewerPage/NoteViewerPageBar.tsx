import React from "react";

import Grid from "@mui/material/Grid";

import { AppBarData, appBarCtxReducer, AppPage } from "../../app/appData";
import { AppBarDataContext, isDocEditMode, createAppBarContext } from "../../app/AppContext";

export default function NoteViewerPageBar() {
  return (<Grid gridRow={1}  className="trmrk-app-page-bar trmrk-note-viewer-page-bar"></Grid>)
}
