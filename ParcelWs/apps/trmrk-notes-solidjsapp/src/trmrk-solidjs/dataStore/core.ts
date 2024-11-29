import { Context } from "solid-js";

import { Singleton } from "../../trmrk/core";
import { isCompactMode as isCompactModeFunc } from "../../trmrk-browser/domUtils/core";
import { initDomAppTheme } from "../domUtils/core";

export interface ComponentFlags {
  isVisible?: boolean | null | undefined;
  isEnabled?: boolean | null | undefined;
}

export interface AppOptionsData {
  refreshAppPageBtn: ComponentFlags;
  viewOpenTabsBtnBtn: ComponentFlags;
  goToSettingsPageBtn: ComponentFlags;
}

export interface AppTabsBarData {
  show: boolean;
}

export interface AppHeaderData {
  show: boolean;
  customContentStartingColumnIdx: number;
  goToParentBtn: ComponentFlags;
  showHistoryNavBtns: boolean;
  showHistoryNavBtnsDefaultBehaviorEnabled: boolean;
  historyBackBtnEnabled: boolean;
  historyForwardBtnEnabled: boolean;
  optionsBtnEnabled: boolean;
  options: AppOptionsData;
  appTabsBar: AppTabsBarData;
}

export interface AppFooterData {
  show: boolean;
  showHomeBtn: boolean;
  showUndoRedoBtns: boolean;
  undoBtnEnabled: boolean;
  redoBtnEnabled: boolean;
  showCloseSelectionBtn: boolean;
}

export interface AppLayout {
  appLayoutCssClass?: string | null | undefined;
  isDarkMode: boolean;
  isCompactMode: boolean;
  homePageUrl: string;
  settingsPageUrl: string;
  appHeader: AppHeaderData;
  appFooter: AppFooterData;
  explorerPanel: ExplorerPanel;
}

export interface ExplorerPanel {
  enabled: boolean;
}

export interface AppDataCore {
  appLayout: AppLayout;
  docTitle?: string | null | undefined;
  defaultDocTitle?: string | null | undefined;
  appTitle?: string | null | undefined;
  defaultAppTitle?: string | null | undefined;
}

export const createAppDataCore = () => {
  const appData: AppDataCore = {
    appLayout: {
      isDarkMode: initDomAppTheme(),
      isCompactMode: isCompactModeFunc(),
      homePageUrl: "/",
      settingsPageUrl: "/settings",
      appHeader: {
        show: true,
        customContentStartingColumnIdx: 0,
        goToParentBtn: {
          isVisible: false,
          isEnabled: true,
        },
        showHistoryNavBtns: true,
        showHistoryNavBtnsDefaultBehaviorEnabled: true,
        historyBackBtnEnabled: true,
        historyForwardBtnEnabled: true,
        optionsBtnEnabled: true,
        options: {
          refreshAppPageBtn: {
            isVisible: true,
            isEnabled: true,
          },
          viewOpenTabsBtnBtn: {
            isVisible: true,
            isEnabled: true,
          },
          goToSettingsPageBtn: {
            isVisible: true,
            isEnabled: true,
          },
        },
        appTabsBar: {
          show: true,
        },
      },
      appFooter: {
        show: true,
        showHomeBtn: true,
        showUndoRedoBtns: false,
        undoBtnEnabled: false,
        redoBtnEnabled: false,
        showCloseSelectionBtn: false,
      },
      explorerPanel: {
        enabled: false,
      },
    },
  };

  return appData;
};

export const appContextRef = new Singleton<Context<AppDataCore>>();
