import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import { setCurrentIdnf, setAppPage } from "../../store/appDataSlice";
import { AppData, AppPage } from "../../services/appData";
import { updateAppTitle } from "../../services/utils";

import NotFound from "../../components/notFound/NotFound";

export const appPage = AppPage.ViewNoteItem;

const NoteViewerPage = () => {
  const { idnf } = useParams();
  const appData = useSelector<{ appData: AppData }, AppData>(state => state.appData);
  const dispatch = useDispatch();

  const appBarData = appData.appBarData;
  const appBarOpts = appBarData.appBarOpts;
  
  useEffect(() => {
    dispatch(setCurrentIdnf(null));
    updateAppTitle(appData, "");

    if (appBarOpts.appPage !== appPage) {
      dispatch(setAppPage(appPage));
    }
  }, []);

  if (trmrk.isNonEmptyStr(idnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container className="trmrk-note-viewer-page" sx={{ position: "relative" }} maxWidth="xl">NoteViewerPage</Container>);
  }
}

export default NoteViewerPage;
