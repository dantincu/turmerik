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
  appPage: AppPage;
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

export interface AppData {
  appConfig: AppConfigData;
  baseLocation: string;
  isDarkMode: boolean;
  isCompactMode: boolean;
  htmlDocTitle: string;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsCompactMode: (isCompactMode: boolean) => void;
  setAppConfig: (appConfig: AppConfigData) => void;
  setHtmlDocTitle: (newHtmlDocTitle: string) => void;
}

export interface AppBarData {
  appBarOpts: AppBarOpts;
  floatingAppBarHeightEm: number;
  updateFloatingBarTopOffset: boolean;
  appSettingsMenuOpts: AppSettingsMenuOpts;
  appOptionsMenuOpts: AppOptionsMenuOpts;
  setAppBarOpts: (appBar: AppBarOpts) => void;
  setFloatingAppBarHeightEm: (floatingAppBarHeightEm: number) => void;
  setUpdateFloatingBarTopOffset: (updateFloatingBarTopOffset: boolean) => void;
  setAppSettingsMenuOpts: (appSettingsMenuOpts: AppSettingsMenuOpts) => void;
  setAppOptionsMenuOpts: (appOptionsMenuOpts: AppOptionsMenuOpts) => void;

  setAppSettingsMenuIsOpen: (isOpen: boolean) => void;
  setAppThemeMenuIsOpen: (isOpen: boolean) => void;
  setAppOptionsMenuIsOpen: (isOpen: boolean) => void;
}

export const appCtxActions = Object.freeze({
  SET_IS_DARK_MODE: "SET_IS_DARK_MODE",
  SET_IS_COMPACT_MODE: "SET_IS_COMPACT_MODE",
  SET_APP_CONFIG: "SET_APP_CONFIG",
  SET_HTML_DOC_TITLE: "SET_HTML_DOC_TITLE",
});

export const appBarCtxActions = Object.freeze({
  SET_APP_BAR_OPTS: "SET_APP_BAR_OPTS",
  SET_FLOATING_BAR_TOP_HEIGHT_EM: "SET_FLOATING_BAR_TOP_HEIGHT_EM",
  SET_UPDATE_FLOATING_BAR_TOP_OFFSET: "UPDATE_FLOATING_BAR_TOP_OFFSET",
  SET_APP_SETTINGS_MENU_OPTS: "SET_APP_SETTINGS_MENU_OPTS",
  SET_APP_OPTIONS_MENU_OPTS: "SET_APP_OPTIONS_MENU_OPTS",

  SET_APP_SETTINGS_MENU_IS_OPEN: "SET_APP_SETTINGS_MENU_IS_OPEN",
  SET_APP_THEME_MENU_IS_OPEN: "SET_APP_THEME_MENU_IS_OPEN",
  SET_APP_OPTIONS_MENU_IS_OPEN: "SET_APP_OPTIONS_MENU_IS_OPEN",
});

export const appCtxReducer = (
  state: AppData,
  action: { type: string; payload: any }
) => {
  const retState = { ...state };

  switch (action.type) {
    case appCtxActions.SET_IS_DARK_MODE:
      retState.isDarkMode = action.payload;
      break;
    case appCtxActions.SET_IS_COMPACT_MODE:
      retState.isCompactMode = action.payload;
      break;
    case appCtxActions.SET_APP_CONFIG:
      retState.appConfig = action.payload;
      break;
    case appCtxActions.SET_HTML_DOC_TITLE:
      retState.htmlDocTitle = action.payload;
      break;
  }

  return retState;
};

const onSetAppSettingsMenuIsOpen = (
  retState: AppBarData,
  appSettingsMenuIsOpen: boolean
) => {
  const appSettingsMenuOpts = retState.appSettingsMenuOpts;

  retState.appSettingsMenuOpts = {
    ...appSettingsMenuOpts,
    isOpen: appSettingsMenuIsOpen,
    appThemeMenuOpts: {
      ...appSettingsMenuOpts.appThemeMenuOpts,
      isOpen: false,
    },
  };
};

const onSetAppThemeMenuIsOpen = (
  retState: AppBarData,
  appThemeMenuIsOpen: boolean
) => {
  const appSettingsMenuOpts = retState.appSettingsMenuOpts;

  retState.appSettingsMenuOpts = {
    ...appSettingsMenuOpts,
    appThemeMenuOpts: {
      ...appSettingsMenuOpts.appThemeMenuOpts,
      isOpen: appThemeMenuIsOpen,
    },
  };
};

const onSetAppOptionsMenuIsOpen = (
  retState: AppBarData,
  appOptionsMenuIsOpen: boolean
) => {
  const appOptionsMenuOpts = retState.appOptionsMenuOpts;

  retState.appOptionsMenuOpts = {
    ...appOptionsMenuOpts,
    isOpen: appOptionsMenuIsOpen,
  };
};

export const appBarCtxReducer = (
  state: AppBarData,
  action: { type: string; payload: any }
) => {
  const retState = { ...state };

  switch (action.type) {
    case appBarCtxActions.SET_APP_BAR_OPTS:
      retState.appBarOpts = action.payload;
      break;
    case appBarCtxActions.SET_FLOATING_BAR_TOP_HEIGHT_EM:
      retState.floatingAppBarHeightEm = action.payload;
      break;
    case appBarCtxActions.SET_UPDATE_FLOATING_BAR_TOP_OFFSET:
      retState.updateFloatingBarTopOffset = action.payload;
      break;
    case appBarCtxActions.SET_APP_SETTINGS_MENU_OPTS:
      retState.appSettingsMenuOpts = action.payload;
      break;
    case appBarCtxActions.SET_APP_OPTIONS_MENU_OPTS:
      retState.appOptionsMenuOpts = action.payload;
      break;
    case appBarCtxActions.SET_APP_SETTINGS_MENU_IS_OPEN:
      onSetAppSettingsMenuIsOpen(retState, action.payload);
      break;
    case appBarCtxActions.SET_APP_THEME_MENU_IS_OPEN:
      onSetAppThemeMenuIsOpen(retState, action.payload);
      break;
    case appBarCtxActions.SET_APP_OPTIONS_MENU_IS_OPEN:
      onSetAppOptionsMenuIsOpen(retState, action.payload);
      break;
  }

  return retState;
};
