import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import './styles.scss';

import { AppPage } from "../../app/appData";
import { AppDataContext, AppBarDataContext, updateAppTitle } from "../../app/AppContext";
import NotFound from "../../components/notFound/NotFound";

export const appPage = AppPage.NoteFilesHcy;

const NoteFilesHcyPage = () => {
  const { idnf } = useParams();
  const appData = React.useContext(AppDataContext);
  const appBarData = React.useContext(AppBarDataContext);
  const appBarOpts = appBarData.appBarOpts;
  
  useEffect(() => {
    updateAppTitle(appData, idnf);

    if (appBarOpts.appPage !== appPage) {
      appBarData.setAppPage(appPage);
    }
  }, []);

  if (trmrk.isNonEmptyStr(idnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container className="trmrk-note-files-hcy-page" sx={{ position: "relative" }} maxWidth="xl">NoteFilesHcyPage</Container>);
  }
}

export default NoteFilesHcyPage;
