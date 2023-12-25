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
  isCompactMode: boolean;
  htmlDocTitle: string;
  appBarOpts: AppBarOpts;
  floatingAppBarHeightEm: number;
  updateFloatingBarTopOffset: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setIsCompactMode: (isCompactMode: boolean) => void;
  setAppConfig: (appConfig: AppConfigData) => void;
  setHtmlDocTitle: (newHtmlDocTitle: string) => void;
  setAppBarOpts: (appBar: AppBarOpts) => void;
  setFloatingAppBarHeightEm: (floatingAppBarHeightEm: number) => void;
  setUpdateFloatingBarTopOffset: (updateFloatingBarTopOffset: boolean) => void;
}

export const actions = Object.freeze({
  SET_IS_DARK_MODE: "SET_IS_DARK_MODE",
  SET_IS_COMPACT_MODE: "SET_IS_COMPACT_MODE",
  SET_APP_CONFIG: "SET_APP_CONFIG",
  SET_HTML_DOC_TITLE: "SET_HTML_DOC_TITLE",
  SET_APP_BAR_OPTS: "SET_APP_BAR_OPTS",
  SET_FLOATING_BAR_TOP_HEIGHT_EM: "SET_FLOATING_BAR_TOP_HEIGHT_EM",
  SET_UPDATE_FLOATING_BAR_TOP_OFFSET: "UPDATE_FLOATING_BAR_TOP_OFFSET",
});

export const reducer = (
  state: AppData,
  action: { type: string; payload: any }
) => {
  const retState = { ...state };

  switch (action.type) {
    case actions.SET_IS_DARK_MODE:
      retState.isDarkMode = action.payload;
      break;
    case actions.SET_IS_COMPACT_MODE:
      retState.isCompactMode = action.payload;
      break;
    case actions.SET_APP_CONFIG:
      retState.appConfig = action.payload;
      break;
    case actions.SET_HTML_DOC_TITLE:
      retState.htmlDocTitle = action.payload;
      break;
    case actions.SET_APP_BAR_OPTS:
      retState.appBarOpts = action.payload;
      break;
    case actions.SET_FLOATING_BAR_TOP_HEIGHT_EM:
      retState.floatingAppBarHeightEm = action.payload;
      break;
    case actions.SET_UPDATE_FLOATING_BAR_TOP_OFFSET:
      retState.updateFloatingBarTopOffset = action.payload;
      break;
  }

  return retState;
};
