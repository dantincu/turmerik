import { AppConfigData } from "trmrk/src/notes-app-config";

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

export interface AppBarOpts {
  appBarCssClass: string;
  resxIconCssClass: string;
  hasContextRow: boolean;
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
  appBarOpts: AppBarOpts;
  floatingAppBarHeightEm: number;
  updateFloatingBarTopOffset: boolean;
  appSettingsMenuOpts: AppSettingsMenuOpts;
  appOptionsMenuOpts: AppOptionsMenuOpts;
}

export interface AppPagesData {
  isDarkMode: boolean;
  isCompactMode: boolean;
  currentAppPage: AppPage;
  currentIdnf: string | null;
}

export interface AppTabsData {}

export interface AppData {
  appConfig: AppConfigData;
  baseLocation: string;
  /* appBarData: AppBarData;
  appPages: AppPagesData; */
}
