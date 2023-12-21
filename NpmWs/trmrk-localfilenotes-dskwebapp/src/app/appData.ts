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
}

export interface AppData {
  appConfig: AppConfigData;
  baseLocation: string;
  isDarkMode: boolean;
  htmlDocTitle: string;
  appTitle: string;
  appBarOpts: AppBarOpts;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setAppConfig: (appConfig: AppConfigData) => void;
  setHtmlDocTitle: (newHtmlDocTitle: string) => void;
  setAppTitle: (newAppTitle: string) => void;
  setAppBarOpts: (appBar: AppBarOpts) => void;
}

export const actions = Object.freeze({
  SET_IS_DARK_MODE: "SET_IS_DARK_MODE",
  SET_APP_CONFIG: "SET_APP_CONFIG",
  SET_HTML_DOC_TITLE: "SET_HTML_DOC_TITLE",
  SET_APP_TITLE: "SET_APP_TITLE",
  SET_APP_BAR_OPTS: "SET_APP_BAR_OPTS",
});

const onSetIsDarkMode = (
  state: AppData,
  action: { type: string; payload: boolean }
) => {
  return {
    ...state,
    isDarkMode: action.payload,
  };
};

const onSetAppConfig = (
  state: AppData,
  action: { type: string; payload: AppConfigData }
) => {
  return {
    ...state,
    appConfig: action.payload,
  };
};

const onSetHtmlDocTitle = (
  state: AppData,
  action: { type: string; payload: string }
) => {
  return {
    ...state,
    htmlDocTitle: action.payload,
  };
};

const onSetAppTitle = (
  state: AppData,
  action: { type: string; payload: string }
) => {
  return {
    ...state,
    appTitle: action.payload,
  };
};

const onSetAppBarOpts = (
  state: AppData,
  action: { type: string; payload: AppBarOpts }
) => {
  return {
    ...state,
    appBarOpts: action.payload,
  };
};

export const reducer = (
  state: AppData,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case actions.SET_IS_DARK_MODE:
      return onSetIsDarkMode(state, action);
    case actions.SET_APP_CONFIG:
      return onSetAppConfig(state, action);
    case actions.SET_HTML_DOC_TITLE:
      return onSetHtmlDocTitle(state, action);
    case actions.SET_APP_TITLE:
      return onSetAppTitle(state, action);
    case actions.SET_APP_BAR_OPTS:
      return onSetAppBarOpts(state, action);
    default:
      return state;
  }
};
