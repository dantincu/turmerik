import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Paper from "@mui/material/Paper";

import { AppBarArgs } from "../appBar/AppBarArgs";
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

import { appRoutes } from "../../app/routes";

const MainEl = ({
  args
}: {
  args: AppBarArgs
}) => {
  return (
    <BrowserRouter>
      <Paper className="trmrk-app">
        <MainAppBar args={args} />
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
      </Paper>
    </BrowserRouter>);
}

export default MainEl;
