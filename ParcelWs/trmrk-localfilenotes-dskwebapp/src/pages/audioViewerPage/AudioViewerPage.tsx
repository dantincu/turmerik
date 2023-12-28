import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useParams } from "react-router-dom";

import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import './styles.scss';

import { setCurrentIdnf, setAppPage } from "../../store/appDataSlice";
import { AppData, AppPage } from "../../services/appData";
import { updateAppTitle } from "../../services/utils";

import NotFound from "../../components/notFound/NotFound";

export const appPage = AppPage.ViewAudioFile;

const AudioViewerPage = () => {
  const { idnf } = useParams();
  const appConfig = useSelector((state: { appData: AppData }) => state.appData.appConfig);
  const appPages = useSelector((state: { appData: AppData }) => state.appData.appPages);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(setCurrentIdnf(null));
    updateAppTitle(appConfig, "");

    if (appPages.currentAppPage !== appPage) {
      dispatch(setAppPage(appPage));
    }
  }, []);

  if (trmrk.isNonEmptyStr(idnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container className="trmrk-audio-viewer-page" sx={{ position: "relative" }} maxWidth="xl">AudioViewerPage</Container>);
  }
}

export default AudioViewerPage;
