import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";

import Paper from "@mui/material/Paper";

import { AppBarArgs } from "../appBar/AppBarArgs";
import MainAppBar from "../appBar/MainAppBar";

import HomePage from "../../pages/homePage/HomePage";
import FilesHcy from "../filesHcy/FilesHcy";
import NotesHcy from "../notesHcy/NotesHcy";
import NoteFilesHcy from "../noteFilesHcy/NoteFilesHcy";
import PicturesExplorerPage from "../../pages/picturesExplorerPage/PicturesExplorerPage";
import NoteViewerPage from "../../pages/noteViewerPage/NoteViewerPage";
import NoteEditorPage from "../../pages/noteEditorPage/NoteEditorPage";
import TextFileViewerPage from "../../pages/textFileViewerPage/TextFileViewerPage";
import TextFileEditorPage from "../../pages/textFileEditorPage/TextFileEditorPage";
import PictureViewer from "../../pages/textFileViewerPage/TextFileViewerPage";
import VideoViewer from "../../pages/textFileViewerPage/TextFileViewerPage";
import AudioViewer from "../../pages/textFileViewerPage/TextFileViewerPage";
import FileDownloaderPage from "../../pages/fileDownloaderPage/FileDownloaderPage";

import NotFound from "../notFound/NotFound";

import { appRoutes } from "../../app/routes";

const MainEl = ({
  args
}: {
  args: AppBarArgs
}) => {
  const { idnf } = useParams();

  return (
    <BrowserRouter>
      <Paper className="trmrk-app">
        <MainAppBar args={args} />
        <Routes>
          <Route path="" element={<Navigate to="/home" />} />
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path={appRoutes.home} Component={HomePage} />
          <Route path={appRoutes.filesRoot} element={<FilesHcy />} />
          <Route path={appRoutes.notesRoot} element={<NotesHcy />} />
          <Route path={appRoutes.files} element={<FilesHcy crntDirPath={idnf} />} />
          <Route path={appRoutes.notes} element={<NotesHcy crntNoteIdnf={idnf} />} />
          <Route path={appRoutes.noteFiles} element={<NoteFilesHcy noteIdnf={idnf} />} />
          <Route path={appRoutes.pics} element={<PicturesExplorerPage parentDirIdnf={idnf} />} />
          <Route path={appRoutes.viewTextFile} element={<TextFileViewerPage fileIdnf={idnf} />} />
          <Route path={appRoutes.editTextFile} element={<TextFileEditorPage fileIdnf={idnf} />} />
          <Route path={appRoutes.viewNote} element={<NoteViewerPage noteIdnf={idnf} />} />
          <Route path={appRoutes.editNote} element={<NoteEditorPage noteIdnf={idnf} />} />
          <Route path={appRoutes.viewPicture} element={<PictureViewer fileIdnf={idnf} />} />
          <Route path={appRoutes.viewVideo} element={<VideoViewer fileIdnf={idnf} />} />
          <Route path={appRoutes.viewAudio} element={<AudioViewer fileIdnf={idnf} />} />
          <Route path={appRoutes.downloadFile} element={<FileDownloaderPage fileIdnf={idnf} />} />
          <Route path="*" Component={NotFound} />
        </Routes>
      </Paper>
    </BrowserRouter>);
}

export default MainEl;
