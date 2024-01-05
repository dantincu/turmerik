export interface AppData {
  baseLocation: string;
  appBarHeight: number | null;
  showAppBar: boolean;
  isDarkMode: boolean;
  isCompactMode: boolean;
  hasFsApiRootDirHandle: boolean;
}

export enum AppPage {
  Home = 0,
  ViewNoteItem,
  EditNoteItem,
  NotesHcy,
  NoteFilesHcy,
  FilesHcy,
  PicturesExplorer,
  ViewTextFile,
  EditTextFile,
  ViewPictureFile,
  ViewVideoFile,
  ViewAudioFile,
  DownloadMiscFile,
}

export interface AppSettingsMenuOpts {
  isOpen: boolean;
  appThemeMenuOpts: AppThemeMenuOpts;
}

export interface AppThemeMenuOpts {
  isOpen: boolean;
}

export interface AppOptionsMenuOpts {
  isOpen: boolean;
}

export interface AppBarData {
  appSettingsMenuOpts: AppSettingsMenuOpts;
  appOptionsMenuOpts: AppOptionsMenuOpts;
}

export interface AppTabsData {}

export interface FilesHcyHistoryItem {
  idnf: string;
}

export interface FilesHcyHistory {
  items: FilesHcyHistoryItem[];
  currentIdx: number | null | undefined;
  currentItem: FilesHcyHistoryItem | null | undefined;
}
