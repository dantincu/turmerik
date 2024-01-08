export interface AppData {
  baseLocation: string;
  appBarHeight: number | null;
  showAppBar: boolean;
  isDarkMode: boolean;
  isCompactMode: boolean;
  hasFilesRootLocation: boolean;
  hasNotesRootLocation: boolean;
}

export enum AppPage {
  Home = 0,
  NoteItem,
  NotesHcy,
  NoteFilesHcy,
  FilesHcy,
  PicturesExplorer,
  TextFile,
  ViewPictureFile,
  ViewVideoFile,
  ViewAudioFile,
  DownloadMiscFile,
}

export interface AppSettingsMenuOpts {
  isOpen: boolean;
  appearenceMenuOpts: AppearenceMenuOpts;
}

export interface AppearenceMenuOpts {
  isOpen: boolean;
}

export interface AppOptionsMenuOpts {
  isOpen: boolean;
}

export interface AppBarData {
  showTabsNavArrows: boolean;
  appSettingsMenuOpts: AppSettingsMenuOpts;
  appOptionsMenuOpts: AppOptionsMenuOpts;
}

export interface AppTab {
  appPage: AppPage;
  idnf: string | null;
  name: string;
  tabUuid: string;
  isCurrent: boolean | null;
  isEditMode: boolean | null;
  isPreviewMode: boolean | null;
  isEdited: boolean | null;
}

export interface AppTabsData {
  openTabs: AppTab[];
}

export interface FilesHcyHistoryItem {
  idnf: string;
}

export interface FilesHcyHistory {
  items: FilesHcyHistoryItem[];
  currentIdx: number | null | undefined;
  currentItem: FilesHcyHistoryItem | null | undefined;
}
