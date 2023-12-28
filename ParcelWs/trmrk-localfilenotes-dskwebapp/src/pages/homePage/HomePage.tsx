import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import './styles.scss';

import { setCurrentIdnf, setAppPage } from "../../store/appPagesSlice";
import { AppData, AppPage, AppPagesData } from "../../services/appData";
import { updateAppTitle } from "../../services/utils";

export const appPage = AppPage.Home;

const HomePage = () => {
  const appConfig = useSelector((state: { appData: AppData }) => state.appData.appConfig);
  const appPages = useSelector((state: { appPages: AppPagesData }) => state.appPages);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setCurrentIdnf(null));
    updateAppTitle(appConfig, "");

    if (appPages.currentAppPage !== appPage) {
      dispatch(setAppPage(appPage));
    }
  }, []);

  return (<Container className="trmrk-home-page" sx={{ position: "relative" }} maxWidth="xl">HomePage</Container>);
}

export default HomePage;
