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
  const appData = useSelector<{ appData: AppData }, AppData>(state => state.appData);
  const dispatch = useDispatch();

  const appBarData = appData.appBarData;
  const appBarOpts = appBarData.appBarOpts;

  const currentIdnf = appData.appPages.currentIdnf ?? "";

  React.useEffect(() => {
    if (appData.appPages.currentIdnf !== currentIdnf) {
      dispatch(setCurrentIdnf(currentIdnf));
    }
    
    updateAppTitle(appData, idnf);

    if (appBarOpts.appPage !== appPage) {
      dispatch(setAppPage(appPage));
    }
  }, [])

  return (<Container className="trmrk-files-hcy-page" sx={{ position: "relative" }} maxWidth="xl">
  </Container>);
}

export default FilesHcyPage;
