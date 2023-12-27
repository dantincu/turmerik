import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import './styles.scss';

import { setCurrentIdnf, setAppPage } from "../../store/appDataSlice";
import { AppData, AppPage } from "../../services/appData";
import { updateAppTitle } from "../../services/utils";

export const appPage = AppPage.Home;

const HomePage = () => {
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

  return (<Container className="trmrk-home-page" sx={{ position: "relative" }} maxWidth="xl">HomePage</Container>);
}

export default HomePage;
