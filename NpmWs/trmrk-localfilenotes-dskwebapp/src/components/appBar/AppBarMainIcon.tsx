import React, { useEffect, useState } from "react";

import './styles.scss';

import AudioViewerAppBarMainIcon from "../../pages/audioViewerPage/AudioViewerAppBarMainIcon";
import FileDownloaderAppBarMainIcon from "../../pages/fileDownloaderPage/FileDownloaderAppBarMainIcon";
import FilesHcyAppBarMainIcon from "../../pages/filesHcyPage/FilesHcyAppBarMainIcon";
import HomeAppBarMainIcon from "../../pages/homePage/HomeAppBarMainIcon";
import NoteEditorAppBarMainIcon from "../../pages/noteEditorPage/NoteEditorAppBarMainIcon";
import NoteFilesHcyAppBarMainIcon from "../../pages/noteFilesHcyPage/NoteFilesHcyAppBarMainIcon";
import NotesHcyAppBarMainIcon from "../../pages/notesHcyPage/NotesHcyAppBarMainIcon";
import NoteViewerAppBarMainIcon from "../../pages/noteViewerPage/NoteViewerAppBarMainIcon";
import PicturesExplorerAppBarMainIcon from "../../pages/picturesExplorerPage/PicturesExplorerAppBarMainIcon";
import PictureViewerAppBarMainIcon from "../../pages/pictureViewerPage/PictureViewerAppBarMainIcon";
import TextFileEditorAppBarMainIcon from "../../pages/textFileEditorPage/TextFileEditorAppBarMainIcon";
import TextFileViewerAppBarMainIcon from "../../pages/textFileViewerPage/TextFileViewerAppBarMainIcon";
import VideoViewerAppBarMainIcon from "../../pages/videoViewerPage/VideoViewerAppBarMainIcon";

import { AppPage } from "../../app/appData";

export default function AppBarMainIcon({
    appPage
  }: {
    appPage: AppPage
  }) {
  switch (appPage) {
    case AppPage.Home:
      return <HomeAppBarMainIcon />
    case AppPage.ViewNoteItem:
      return <NoteViewerAppBarMainIcon />
    case AppPage.EditNoteItem:
      return <NoteEditorAppBarMainIcon />
    case AppPage.NotesHcy:
      return <NotesHcyAppBarMainIcon />
    case AppPage.NoteFilesHcy:
      return <NoteFilesHcyAppBarMainIcon />
    case AppPage.FilesHcy:
      return <FilesHcyAppBarMainIcon />
    case AppPage.PicturesExplorer:
      return <PicturesExplorerAppBarMainIcon />
    case AppPage.ViewTextFile:
      return <TextFileViewerAppBarMainIcon />
    case AppPage.EditTextFile:
      return <TextFileEditorAppBarMainIcon />
    case AppPage.ViewPictureFile:
      return <PictureViewerAppBarMainIcon />
    case AppPage.ViewVideoFile:
      return <VideoViewerAppBarMainIcon />
    case AppPage.ViewAudioFile:
      return <AudioViewerAppBarMainIcon />
    case AppPage.DownloadMiscFile:
      return <FileDownloaderAppBarMainIcon />
  }
}
