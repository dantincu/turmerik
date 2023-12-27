import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import './styles.scss';

import { AppPage } from "../../app/appData";
import { AppDataContext, AppBarDataContext, updateAppTitle } from "../../app/AppContext";
import NotFound from "../../components/notFound/NotFound";

export const appPage = AppPage.PicturesExplorer;

const PicturesExplorerPage = () => {
  const { idnf } = useParams();
  const appData = React.useContext(AppDataContext);
  const appBarData = React.useContext(AppBarDataContext);
  const appBarOpts = appBarData.appBarOpts;
  
  useEffect(() => {
    appData.setCurrentIdnf(idnf ?? null);
    updateAppTitle(appData, idnf);

    if (appBarOpts.appPage !== appPage) {
      appBarData.setAppPage(appPage);
    }
  }, []);

  if (trmrk.isNonEmptyStr(idnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container className="trmrk-pictures-explorer-page" sx={{ position: "relative" }} maxWidth="xl">PicturesExplorerPage</Container>);
  }
}

export default PicturesExplorerPage;
