import { v4 as uuidv4 } from "uuid";

import { AppData, AppPage } from "./appData";

export const jsonBool = Object.freeze({
  false: JSON.stringify(false),
  true: JSON.stringify(true),
});

export const getJsonBool = (value: boolean) =>
  value ? jsonBool.true : jsonBool.false;

export const queryKeys = Object.freeze({});

export const localStorageKeys = Object.freeze({
  appThemeIsDarkMode: "appThemeIsDarkMode",
  appIsCompactMode: "appIsCompactMode",
  pgContnrLeftPnlDfWidth: "pgContnrLeftPnlDfWidth",
});

export const localForageKeys = Object.freeze({
  openAppTabs: "openAppTabs",
});

export const newUUid = () => uuidv4().replaceAll("-", "");

export const getLocalForageDbNameNewPfx = (
  uuidStr?: string | null | undefined
) => {
  uuidStr ??= newUUid();
  const newPfx = `localFsApiNotes/${uuidStr}/`;

  return newPfx;
};

export const defaultAppTitle = "Turmerik Notes";

export const getAppTitle = (name: string | null = null) => {
  let title = defaultAppTitle;

  if (typeof name === "string") {
    title = [name, defaultAppTitle].join(" - ");
  }

  return title;
};

export const getAppModeCssClassName = (appData: AppData) => {
  const appModeClassName = appData.isCompactMode
    ? "trmrk-mode-compact"
    : "trmrk-mode-full";

  return appModeClassName;
};

export const getRoute = (routeBase: string, idnf: string) => {
  const encodedIdnf = encodeURIComponent(idnf);
  const route = [routeBase, encodedIdnf].join("/");
  return route;
};

export const getResxCssClassNameCore = (appPage: AppPage) => {
  switch (appPage) {
    case AppPage.NoteItem:
      return "note-item";
    case AppPage.NotesHcy:
      return "notes-hcy";
    case AppPage.NoteFilesHcy:
      return "note-files-hcy";
    case AppPage.FilesHcy:
      return "files-hcy";
    case AppPage.PicturesExplorer:
      return "picsnvids-explorer";
    case AppPage.TextFile:
      return "text-file";
    case AppPage.ViewPictureFile:
      return "view-picture-file";
    case AppPage.ViewVideoFile:
      return "view-video-file";
    case AppPage.ViewAudioFile:
      return "view-audio-file";
    case AppPage.DownloadMiscFile:
      return "download-misc-file";
    case AppPage.Home:
      return "home";
  }
};

export const getResxCssClassName = (appPage: AppPage) => {
  const classNameCore = getResxCssClassNameCore(appPage);
  let className: string | null = null;

  if (classNameCore) {
    className = "trmrk-resx-" + classNameCore;
  }

  return className;
};
