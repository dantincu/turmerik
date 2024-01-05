import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Paper from "@mui/material/Paper";

import "./styles.scss";

import MainAppBar from "../appBar/MainAppBar";

import HomePage from "../../pages/homePage/HomePage";
import FilesHcyPage from "../../pages/filesHcyPage/FilesHcyPage";
import NotesHcyPage from "../../pages/notesHcyPage/NotesHcyPage";
import NoteFilesHcy from "../noteFilesHcy/NoteFilesHcy";
import PicturesExplorerPage from "../../pages/picturesExplorerPage/PicturesExplorerPage";
import NoteViewerPage from "../../pages/noteViewerPage/NoteViewerPage";
import NoteEditorPage from "../../pages/noteEditorPage/NoteEditorPage";
import TextFileViewerPage from "../../pages/textFileViewerPage/TextFileViewerPage";
import TextFileEditorPage from "../../pages/textFileEditorPage/TextFileEditorPage";
import PictureViewerPage from "../../pages/pictureViewerPage/PictureViewerPage";
import VideoViewerPage from "../../pages/textFileViewerPage/TextFileViewerPage";
import AudioViewerPage from "../../pages/audioViewerPage/AudioViewerPage";
import FileDownloaderPage from "../../pages/fileDownloaderPage/FileDownloaderPage";

import NotFoundPage from "../../pages/notFoundPage/NotFoundPage";
import { AppBarData, AppPagesData } from "../../services/appData";
import { getAppThemeCssClassName } from "../../services/utils";
import { appRoutes } from "../../services/routes";
import { FloatingBarTopOffset, updateFloatingBarTopOffset } from "./floatingBarTopOffsetUpdater";
import { setUpdateFloatingBarTopOffset } from "../../store/appBarDataSlice";

const MainEl = () => {
  const appPages = useSelector((state: { appPages: AppPagesData }) => state.appPages);
  const appBar = useSelector((state: { appBar: AppBarData }) => state.appBar);
  const dispatch = useDispatch();

  const appThemeClassName = getAppThemeCssClassName(appPages);
  const appModeClassName = appPages.isCompactMode ? "trmrk-full-mode" : "trmrk-compact-mode";
  
  const appHeaderEl = useRef<HTMLDivElement>(null);
  const appBodyEl = useRef<HTMLDivElement>(null);

  const offset: FloatingBarTopOffset = {
    lastBodyScrollTop: 0,
    lastHeaderTopOffset: 0
  }

  const onUpdateFloatingBarTopOffset = () => {
    updateFloatingBarTopOffset(
      offset, appHeaderEl, appBodyEl);
  }

  const onUserScroll = (ev: Event) => {
    onUpdateFloatingBarTopOffset();
  }

  useEffect(() => {
    const bodyEl = appBodyEl.current!;
    offset.lastBodyScrollTop = 0;

    bodyEl.addEventListener("scroll", onUserScroll);
    window.addEventListener("resize", onUserScroll);

    if (appBar.updateFloatingBarTopOffset) {
      onUpdateFloatingBarTopOffset();
      dispatch(setUpdateFloatingBarTopOffset(false));
    }

    return () => {
      bodyEl.removeEventListener("scroll", onUserScroll);
      window.removeEventListener("resize", onUserScroll);
    };
  }, []);

  return (
    <BrowserRouter>
        <Paper className={["trmrk-app", appThemeClassName, appModeClassName].join(" ")}>
          <div className={["trmrk-app-nav-bar", `trmrk-height-x${appBar.floatingAppBarHeightEm}`].join(" ")} ref={appHeaderEl}>
            <MainAppBar />
          </div>
          <div className="trmrk-app-main" ref={appBodyEl}>
            <Routes>
              <Route path="" element={<Navigate to="/home" />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path={appRoutes.home} Component={HomePage} />
              <Route path={appRoutes.filesRoot} Component={FilesHcyPage} />
              <Route path={appRoutes.notesRoot} Component={NotesHcyPage} />
              <Route path={appRoutes.files} Component={FilesHcyPage} />
              <Route path={appRoutes.notes} Component={NotesHcyPage}  />
              <Route path={appRoutes.noteFiles} Component={NoteFilesHcy}  />
              <Route path={appRoutes.pics} Component={PicturesExplorerPage}  />
              <Route path={appRoutes.viewTextFile} Component={TextFileViewerPage} />
              <Route path={appRoutes.editTextFile} Component={TextFileEditorPage} />
              <Route path={appRoutes.viewNote} Component={NoteViewerPage} />
              <Route path={appRoutes.editNote} Component={NoteEditorPage} />
              <Route path={appRoutes.viewPicture} Component={PictureViewerPage} />
              <Route path={appRoutes.viewVideo} Component={VideoViewerPage} />
              <Route path={appRoutes.viewAudio} Component={AudioViewerPage} />
              <Route path={appRoutes.downloadFile} Component={FileDownloaderPage} />
              <Route path="*" Component={NotFoundPage} />
            </Routes>
          </div>
        </Paper>
    </BrowserRouter>);
}

export default MainEl;
