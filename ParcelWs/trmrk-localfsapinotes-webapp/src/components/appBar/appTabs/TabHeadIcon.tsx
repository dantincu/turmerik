import React from "react";

import DescriptionIcon from "@mui/icons-material/Description";
import ArticleIcon from "@mui/icons-material/Article";
import NoteIcon from "@mui/icons-material/Note";
import EditNoteIcon from "@mui/icons-material/EditNote";

import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import NotesIcon from "@mui/icons-material/Notes";
import AudioFileIcon from "@mui/icons-material/AudioFile";

import DownloadIcon from "@mui/icons-material/Download";
import SmartDisplayIcon from "@mui/icons-material/SmartDisplay";
import ImageIcon from "@mui/icons-material/Image";
import BrowseGalleryIcon from "@mui/icons-material/BrowseGallery";

import HomeIcon from "@mui/icons-material/Home";

import { AppTabsData, AppTab, AppPage } from "../../../services/appData";

export default function TabHeadIcon({
    tab
  }: {
    tab: AppTab
  }) {
    switch (tab.appPage) {
      case AppPage.ViewNoteItem:
        return <DescriptionIcon />
      case AppPage.EditNoteItem:
        return <ArticleIcon />;

      case AppPage.NotesHcy:
        return <FolderIcon />
      case AppPage.NoteFilesHcy:
        return <FolderOpenIcon />
      case AppPage.FilesHcy:
        return <FolderOutlinedIcon />;

      case AppPage.PicturesExplorer:
        return <BrowseGalleryIcon />;

      case AppPage.ViewTextFile:
        return <NoteIcon />
      case AppPage.EditTextFile:
        return <EditNoteIcon />;

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
