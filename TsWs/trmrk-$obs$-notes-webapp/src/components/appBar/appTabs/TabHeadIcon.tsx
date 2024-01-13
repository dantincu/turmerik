import React from "react";

import ArticleIcon from "@mui/icons-material/Article";
import NotesIcon from "@mui/icons-material/Notes";

import FolderIcon from "@mui/icons-material/Folder";
import AudioFileIcon from "@mui/icons-material/AudioFile";

import DownloadIcon from "@mui/icons-material/Download";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import ImageIcon from "@mui/icons-material/Image";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";

import HomeIcon from "@mui/icons-material/Home";

import { AppTab, AppPage } from "../../../services/appData";

export default function TabHeadIcon({
    tab,
  }: {
    tab: AppTab,
  }) {
    switch (tab.appPage) {
      case AppPage.NoteItem:
        return <ArticleIcon />;

      case AppPage.NotesHcy:
        return <NotesIcon />;
      case AppPage.NoteFilesHcy:
        return <FolderIcon />;
      case AppPage.FilesHcy:
        return <FolderIcon />;

      case AppPage.PicturesExplorer:
        return <BrowseGalleryIcon />;

      case AppPage.TextFile:
        return <ArticleIcon />;

      case AppPage.ViewPictureFile:
        return <ImageIcon />;
      case AppPage.ViewVideoFile:
        return <SmartDisplayIcon />;
      case AppPage.ViewAudioFile:
        return <AudioFileIcon />;
      case AppPage.DownloadMiscFile:
        return <DownloadIcon />;
      default:
        return <HomeIcon />;
    }
}
