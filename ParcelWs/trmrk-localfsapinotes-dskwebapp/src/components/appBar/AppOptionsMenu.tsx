import React from "react";

import './styles.scss';

import AudioViewerAppBarOptionsMenu from "../../pages/audioViewerPage/AudioViewerAppBarOptionsMenu";
import FileDownloaderAppBarOptionsMenu from "../../pages/fileDownloaderPage/FileDownloaderAppBarOptionsMenu";
import FilesHcyAppBarOptionsMenu from "../../pages/filesHcyPage/FilesHcyAppBarOptionsMenu";
import HomeAppBarOptionsMenu from "../../pages/homePage/HomeAppBarOptionsMenu";
import NoteEditorAppBarOptionsMenu from "../../pages/noteEditorPage/NoteEditorAppBarOptionsMenu";
import NoteFilesHcyAppBarOptionsMenu from "../../pages/noteFilesHcyPage/NoteFilesHcyAppBarOptionsMenu";
import NotesHcyAppBarOptionsMenu from "../../pages/notesHcyPage/NotesHcyAppBarOptionsMenu";
import NoteViewerAppBarOptionsMenu from "../../pages/noteViewerPage/NoteViewerAppBarOptionsMenu";
import PicturesExplorerAppBarOptionsMenu from "../../pages/picturesExplorerPage/PicturesExplorerAppBarOptionsMenu";
import PictureViewerAppBarOptionsMenu from "../../pages/pictureViewerPage/PictureViewerAppBarOptionsMenu";
import TextFileEditorAppBarOptionsMenu from "../../pages/textFileEditorPage/TextFileEditorAppBarOptionsMenu";
import TextFileViewerAppBarOptionsMenu from "../../pages/textFileViewerPage/TextFileViewerAppBarOptionsMenu";
import VideoViewerAppBarOptionsMenu from "../../pages/videoViewerPage/VideoViewerAppBarOptionsMenu";

import { AppPage } from "../../services/appData";

export default function AppOptionsMenu({
    appPage,
    menuAnchorEl
  }: {
    appPage: AppPage,
    menuAnchorEl: HTMLElement
  }) {
  switch (appPage) {
    case AppPage.ViewNoteItem:
      return <NoteViewerAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.EditNoteItem:
      return <NoteEditorAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.NotesHcy:
      return <NotesHcyAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.NoteFilesHcy:
      return <NoteFilesHcyAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.FilesHcy:
      return <FilesHcyAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.PicturesExplorer:
      return <PicturesExplorerAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.ViewTextFile:
      return <TextFileViewerAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.EditTextFile:
      return <TextFileEditorAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.ViewPictureFile:
      return <PictureViewerAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.ViewVideoFile:
      return <VideoViewerAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.ViewAudioFile:
      return <AudioViewerAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    case AppPage.DownloadMiscFile:
      return <FileDownloaderAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
    default:
      return <HomeAppBarOptionsMenu menuAnchorEl={menuAnchorEl} />
  }
}
