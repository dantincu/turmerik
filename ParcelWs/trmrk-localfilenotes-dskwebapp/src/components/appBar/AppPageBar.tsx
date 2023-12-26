import React, { useEffect, useState } from "react";

import './styles.scss';

import AudioViewerPageBar from "../../pages/audioViewerPage/AudioViewerPageBar";
import FileDownloaderPageBar from "../../pages/fileDownloaderPage/FileDownloaderPageBar";
import FilesHcyPageBar from "../../pages/filesHcyPage/FilesHcyPageBar";
import HomePageBar from "../../pages/homePage/HomePageBar";
import NoteEditorPageBar from "../../pages/noteEditorPage/NoteEditorPageBar";
import NoteFilesHcyPageBar from "../../pages/noteFilesHcyPage/NoteFilesHcyPageBar";
import NotesHcyPageBar from "../../pages/notesHcyPage/NotesHcyPageBar";
import NoteViewerPageBar from "../../pages/noteViewerPage/NoteViewerPageBar";
import PicturesExplorerPageBar from "../../pages/picturesExplorerPage/PicturesExplorerPageBar";
import PictureViewerPageBar from "../../pages/pictureViewerPage/PictureViewerPageBar";
import TextFileEditorPageBar from "../../pages/textFileEditorPage/TextFileEditorPageBar";
import TextFileViewerPageBar from "../../pages/textFileViewerPage/TextFileViewerPageBar";
import VideoViewerPageBar from "../../pages/videoViewerPage/VideoViewerPageBar";

import { AppPage } from "../../app/appData";

export default function AppOptionsMenu({
    appPage,
  }: {
    appPage: AppPage,
  }) {
  switch (appPage) {
    case AppPage.ViewNoteItem:
      return <NoteViewerPageBar />
    case AppPage.EditNoteItem:
      return <NoteEditorPageBar />
    case AppPage.NotesHcy:
      return <NotesHcyPageBar />
    case AppPage.NoteFilesHcy:
      return <NoteFilesHcyPageBar />
    case AppPage.FilesHcy:
      return <FilesHcyPageBar />
    case AppPage.PicturesExplorer:
      return <PicturesExplorerPageBar />
    case AppPage.ViewTextFile:
      return <TextFileViewerPageBar />
    case AppPage.EditTextFile:
      return <TextFileEditorPageBar />
    case AppPage.ViewPictureFile:
      return <PictureViewerPageBar />
    case AppPage.ViewVideoFile:
      return <VideoViewerPageBar />
    case AppPage.ViewAudioFile:
      return <AudioViewerPageBar />
    case AppPage.DownloadMiscFile:
      return <FileDownloaderPageBar />
    default:
      return <HomePageBar />
  }
}
