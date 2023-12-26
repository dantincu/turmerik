import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import './styles.scss';

import { appCtxReducer, appCtxActions, AppData } from "../../app/appData";
import { AppDataContext, updateAppTitle } from "../../app/AppContext";

const HomePage = () => {
  const appData = React.useContext(AppDataContext);

  useEffect(() => {
    updateAppTitle(appData, "");
  }, []);

  return (<Container className="trmrk-home-page" sx={{ position: "relative" }} maxWidth="xl">HomePage</Container>);
}

export default HomePage;