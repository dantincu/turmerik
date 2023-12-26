import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import './styles.scss';

import { AppPage } from "../../app/appData";
import { AppDataContext, AppBarDataContext, updateAppTitle } from "../../app/AppContext";

export const appPage = AppPage.Home;

const HomePage = () => {
  const appData = React.useContext(AppDataContext);
  const appBarData = React.useContext(AppBarDataContext);
  const appBarOpts = appBarData.appBarOpts;

  useEffect(() => {
    updateAppTitle(appData, "");

    if (appBarOpts.appPage !== appPage) {
      appBarData.setAppPage(appPage);
    }
  }, []);

  return (<Container className="trmrk-home-page" sx={{ position: "relative" }} maxWidth="xl">HomePage</Container>);
}

export default HomePage;
