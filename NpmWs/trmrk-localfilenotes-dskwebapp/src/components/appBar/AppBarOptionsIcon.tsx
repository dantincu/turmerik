import React, { useEffect, useState } from "react";

import './styles.scss';

import AudioViewerAppBarOptionsIcon from "../../pages/audioViewerPage/AudioViewerAppBarOptionsIcon";
import FileDownloaderAppBarOptionsIcon from "../../pages/fileDownloaderPage/FileDownloaderAppBarOptionsIcon";
import FilesHcyAppBarOptionsIcon from "../../pages/filesHcyPage/FilesHcyAppBarOptionsIcon";
import HomeAppBarOptionsIcon from "../../pages/homePage/HomeAppBarOptionsIcon";
import NoteEditorAppBarOptionsIcon from "../../pages/noteEditorPage/NoteEditorAppBarOptionsIcon";
import NoteFilesHcyAppBarOptionsIcon from "../../pages/noteFilesHcyPage/NoteFilesHcyAppBarOptionsIcon";
import NotesHcyAppBarOptionsIcon from "../../pages/notesHcyPage/NotesHcyAppBarOptionsIcon";
import NoteViewerAppBarOptionsIcon from "../../pages/noteViewerPage/NoteViewerAppBarOptionsIcon";
import PicturesExplorerAppBarOptionsIcon from "../../pages/picturesExplorerPage/PicturesExplorerAppBarOptionsIcon";
import PictureViewerAppBarOptionsIcon from "../../pages/pictureViewerPage/PictureViewerAppBarOptionsIcon";
import TextFileEditorAppBarOptionsIcon from "../../pages/textFileEditorPage/TextFileEditorAppBarOptionsIcon";
import TextFileViewerAppBarOptionsIcon from "../../pages/textFileViewerPage/TextFileViewerAppBarOptionsIcon";
import VideoViewerAppBarOptionsIcon from "../../pages/videoViewerPage/VideoViewerAppBarOptionsIcon";

import { AppPage } from "../../app/appData";

export default function AppBarOptionsIcon({
    appPage
  }: {
    appPage: AppPage
  }) {
  switch (appPage) {
    case AppPage.Home:
      return <HomeAppBarOptionsIcon />
    case AppPage.ViewNoteItem:
      return <NoteViewerAppBarOptionsIcon />
    case AppPage.EditNoteItem:
      return <NoteEditorAppBarOptionsIcon />
    case AppPage.NotesHcy:
      return <NotesHcyAppBarOptionsIcon />
    case AppPage.NoteFilesHcy:
      return <NoteFilesHcyAppBarOptionsIcon />
    case AppPage.FilesHcy:
      return <FilesHcyAppBarOptionsIcon />
    case AppPage.PicturesExplorer:
      return <PicturesExplorerAppBarOptionsIcon />
    case AppPage.ViewTextFile:
      return <TextFileViewerAppBarOptionsIcon />
    case AppPage.EditTextFile:
      return <TextFileEditorAppBarOptionsIcon />
    case AppPage.ViewPictureFile:
      return <PictureViewerAppBarOptionsIcon />
    case AppPage.ViewVideoFile:
      return <VideoViewerAppBarOptionsIcon />
    case AppPage.ViewAudioFile:
      return <AudioViewerAppBarOptionsIcon />
    case AppPage.DownloadMiscFile:
      return <FileDownloaderAppBarOptionsIcon />
  }
}
