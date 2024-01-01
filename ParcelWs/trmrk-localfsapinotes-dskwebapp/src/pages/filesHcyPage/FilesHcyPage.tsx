import React from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import { setCurrentIdnf, setAppPage } from "../../store/appPagesSlice";
import { AppData, AppPage, AppPagesData } from "../../services/appData";
import { updateAppTitle } from "../../services/utils";

import './styles.scss';

export const appPage = AppPage.FilesHcy;

const FilesHcyPage = () => {
  const { idnf } = useParams();
  const appPages = useSelector((state: { appPages: AppPagesData }) => state.appPages);
  const appConfig = useSelector((state: { appData: AppData }) => state.appData.appConfig);
  const dispatch = useDispatch();

  const nextIdnf = idnf ?? "";

  React.useEffect(() => {
    updateAppTitle(appConfig, idnf);

    if (appPages.currentIdnf !== nextIdnf) {
      dispatch(setCurrentIdnf(nextIdnf));
    }

    if (appPages.currentAppPage !== appPage) {
      dispatch(setAppPage(appPage));
    }
  }, [ idnf ])

  return (<Container className="trmrk-files-hcy-page" sx={{ position: "relative" }} maxWidth="xl">
  </Container>);
}

export default FilesHcyPage;
