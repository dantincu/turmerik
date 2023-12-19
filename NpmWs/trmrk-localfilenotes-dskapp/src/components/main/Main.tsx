import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";

import Paper from "@mui/material/Paper";

import { AppBarArgs } from "../appBar/AppBarArgs";
import MainAppBar from "../appBar/MainAppBar";

import Home from "../../pages/home/Home";
import FilesHcy from "../filesHcy/FilesHcy";
import NotesHcy from "../notesHcy/NotesHcy";
import PicturesExplorer from "../../pages/picturesExplorer/PicturesExplorer";
import NoteViewer from "../../pages/noteViewer/NoteViewer";
import NoteEditor from "../../pages/noteEditor/NoteEditor";
import TextFileViewer from "../../pages/textFileViewer/TextFileViewer";
import TextFileEditor from "../../pages/textFileEditor/TextFileEditor";
import PictureViewer from "../../pages/textFileViewer/TextFileViewer";
import VideoViewer from "../../pages/textFileViewer/TextFileViewer";
import AudioViewer from "../../pages/textFileViewer/TextFileViewer";
import FileDownloader from "../../pages/fileDownloader/FileDownloader";

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
          <Route path={appRoutes.home} Component={Home} />
          <Route path={appRoutes.filesRoot} element={<FilesHcy />} />
          <Route path={appRoutes.notesRoot} element={<NotesHcy />} />
          <Route path={appRoutes.files} element={<FilesHcy parentDirPath={idnf} />} />
          <Route path={appRoutes.notes} element={<NotesHcy crntNoteIdnf={idnf} />} />
          <Route path={appRoutes.pics} element={<PicturesExplorer parentDirIdnf={idnf} />} />
          <Route path={appRoutes.viewTextFile} element={<TextFileViewer fileIdnf={idnf} />} />
          <Route path={appRoutes.editTextFile} element={<TextFileEditor fileIdnf={idnf} />} />
          <Route path={appRoutes.viewNote} element={<NoteViewer noteIdnf={idnf} />} />
          <Route path={appRoutes.editNote} element={<NoteEditor noteIdnf={idnf} />} />
          <Route path={appRoutes.viewPicture} element={<PictureViewer fileIdnf={idnf} />} />
          <Route path={appRoutes.viewVideo} element={<VideoViewer fileIdnf={idnf} />} />
          <Route path={appRoutes.viewAudio} element={<AudioViewer fileIdnf={idnf} />} />
          <Route path={appRoutes.downloadFile} element={<FileDownloader fileIdnf={idnf} />} />
          <Route path="*" Component={NotFound} />
        </Routes>
      </Paper>
    </BrowserRouter>);
}

export default MainEl;
