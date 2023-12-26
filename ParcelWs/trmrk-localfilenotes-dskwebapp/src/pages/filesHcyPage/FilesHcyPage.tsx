import React from "react";
import { useParams } from "react-router-dom";

import Container from "@mui/material/Container";

import { AppPage } from "../../app/appData";
import { AppDataContext, AppBarDataContext, updateAppTitle } from "../../app/AppContext";
import './styles.scss';

export const appPage = AppPage.FilesHcy;

const FilesHcyPage = () => {
  const { idnf } = useParams();
  const appData = React.useContext(AppDataContext);
  
  const appBarData = React.useContext(AppBarDataContext);
  const appBarOpts = appBarData.appBarOpts;

  React.useEffect(() => {
    updateAppTitle(appData, idnf);

    if (appBarOpts.appPage !== appPage) {
      appBarData.setAppPage(appPage);
    }
  }, [])

  return (<Container className="trmrk-files-hcy-page" sx={{ position: "relative" }} maxWidth="xl">
  </Container>);
}

export default FilesHcyPage;
