import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import './styles.scss';

import { setCurrentIdnf, setAppPage } from "../../store/appPagesSlice";
import { AppData, AppPage, AppPagesData } from "../../services/appData";
import { updateAppTitle } from "../../services/utils";

import NotFound from "../../components/notFound/NotFound";

export const appPage = AppPage.EditNoteItem;

const NoteEditorPage = () => {
  const { idnf } = useParams();
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

  if (trmrk.isNonEmptyStr(idnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container className="trmrk-note-editor-page" sx={{ position: "relative" }} maxWidth="xl">NoteEditorPage</Container>);
  }
}

export default NoteEditorPage;
