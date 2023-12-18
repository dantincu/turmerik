import React, { useEffect, useState } from "react";

import { BrowserRouter, Routes, Route, useParams, Navigate } from "react-router-dom";

import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";

import { AppBarArgs } from "../appBar/AppBarArgs";
import MainAppBar from "../appBar/MainAppBar";

import Home from "../home/Home";
import FilesHcy from "../filesHcy/FilesHcy";
import NotesHcy from "../notesHcy/NotesHcy";
import PicturesExplorer from "../picturesExplorer/PicturesExplorer";
import NoteViewer from "../noteViewer/NoteViewer";
import NoteEditor from "../noteEditor/NoteEditor";
import TextFileViewer from "../textFileViewer/TextFileViewer";
import TextFileEditor from "../textFileEditor/TextFileEditor";
import PictureViewer from "../textFileViewer/TextFileViewer";
import VideoViewer from "../textFileViewer/TextFileViewer";
import AudioViewer from "../textFileViewer/TextFileViewer";

import NotFound from "../notFound/NotFound";

const MainEl = ({
  args
}: {
  args: AppBarArgs
}) => {
  const { idnf } = useParams();

  return (<Paper className="trmrk-app">
    <MainAppBar args={args} />
    <Container sx={{ position: "relative" }} maxWidth="xl">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" Component={Home} />
          <Route path="/files" element={<FilesHcy />} />
          <Route path="/notes" element={<NotesHcy />} />
          <Route path="/files/:idnf" element={<FilesHcy parentDirPath={idnf} />} />
          <Route path="/notes/:idnf" element={<NotesHcy crntNoteIdnf={idnf} />} />
          <Route path="/pics/:idnf" element={<PicturesExplorer parentDirIdnf={idnf} />} />
          <Route path="/view-text-file/:idnf" element={<TextFileViewer fileIdnf={idnf} />} />
          <Route path="/edit-text-file/:idnf" element={<TextFileEditor fileIdnf={idnf} />} />
          <Route path="/view-note/:idnf" element={<NoteViewer noteIdnf={idnf} />} />
          <Route path="/edit-note/:idnf" element={<NoteEditor noteIdnf={idnf} />} />
          <Route path="/view-picture/:idnf" element={<PictureViewer fileIdnf={idnf} />} />
          <Route path="/view-video/:idnf" element={<VideoViewer fileIdnf={idnf} />} />
          <Route path="/view-audio/:idnf" element={<AudioViewer fileIdnf={idnf} />} />
          <Route path="*" Component={NotFound} />
        </Routes>
      </BrowserRouter>
    </Container>
  </Paper>);
}

export default MainEl;
