import { useContext, createContext } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import { isCompactMode as isCompactModeFunc } from "../../trmrk-browser/domUtils/core";
import { initDomAppTheme } from "../domUtils/core";

export enum SplitPanelOrientation {
  None = 0,
  Vertical,
  Horizontal,
}

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
  goToParentBtn: ComponentFlags;
  showHistoryNavBtns: boolean;
  showHistoryNavBtnsDefaultBehaviorEnabled: boolean;
  historyBackBtnEnabled: boolean;
  historyForwardBtnEnabled: boolean;
  showOptionsBtn: boolean;
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

export interface AppBodyData {
  splitOrientation: SplitPanelOrientation;
  firstContainerIsFurtherSplit: boolean;
  secondContainerIsFurtherSplit: boolean;
  secondContainerIsFocused: boolean;
  secondPanelIsFocused: boolean;
  appBodyPanel1Scrollable: boolean;
  appBodyPanel2Scrollable: boolean;
  appBodyPanel3Scrollable: boolean;
  appBodyPanel4Scrollable: boolean;
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
  appBody: AppBodyData;
}

export interface ExplorerPanel {
  isEnabled: boolean;
  isFocused: boolean;
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
        goToParentBtn: {
          isVisible: false,
          isEnabled: true,
        },
        showHistoryNavBtns: true,
        showHistoryNavBtnsDefaultBehaviorEnabled: true,
        historyBackBtnEnabled: true,
        historyForwardBtnEnabled: true,
        showOptionsBtn: true,
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
        isEnabled: false,
        isFocused: false,
      },
      appBody: {
        splitOrientation: SplitPanelOrientation.None,
        firstContainerIsFurtherSplit: false,
        secondContainerIsFurtherSplit: false,
        secondContainerIsFocused: false,
        secondPanelIsFocused: false,
        appBodyPanel1Scrollable: true,
        appBodyPanel2Scrollable: true,
        appBodyPanel3Scrollable: true,
        appBodyPanel4Scrollable: true,
      },
    },
  };

  return appData;
};

export type NestedPaths<T> = {
  [K in keyof T & (string | number)]: T[K] extends (infer U)[] // Array case
    ? `${K}` | `${K}[${string | number}]` | `${K}[${NestedPaths<U>}]`
    : T[K] extends object // Regular object case
    ? `${K}` | `${K}.${NestedPaths<T[K]>}`
    : `${K}`; // Base case for primitive types
}[keyof T & (string | number)];

export type AppDataPaths = NestedPaths<AppDataCore>;

export type AppContextType = {
  appData: AppDataCore;
  setAppDataFull: SetStoreFunction<AppDataCore>;
  setAppData: <T>(path: AppDataPaths, value: T) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => useContext(AppContext)!;
