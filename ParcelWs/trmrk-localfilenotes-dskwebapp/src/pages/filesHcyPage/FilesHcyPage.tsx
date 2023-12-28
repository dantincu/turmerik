import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import { setCurrentIdnf, setAppPage } from "../../store/appDataSlice";
import { AppData, AppPage } from "../../services/appData";
import { updateAppTitle } from "../../services/utils";

import './styles.scss';

export const appPage = AppPage.FilesHcy;

const FilesHcyPage = () => {
  const { idnf } = useParams();
  const appPages = useSelector((state: { appData: AppData }) => state.appData.appPages);
  const appConfig = useSelector((state: { appData: AppData }) => state.appData.appConfig);
  const dispatch = useDispatch();

  const currentIdnf = appPages.currentIdnf ?? "";

  React.useEffect(() => {
    if (appPages.currentIdnf !== currentIdnf) {
      dispatch(setCurrentIdnf(currentIdnf));
    }
    
    updateAppTitle(appConfig, idnf);

    if (appPages.currentAppPage !== appPage) {
      dispatch(setAppPage(appPage));
    }
  }, [])

  return (<Container className="trmrk-files-hcy-page" sx={{ position: "relative" }} maxWidth="xl">
  </Container>);
}

export default FilesHcyPage;
