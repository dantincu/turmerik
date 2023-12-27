import { createSlice } from "@reduxjs/toolkit";

import { core as trmrk } from "trmrk";

import { localStorageKeys, jsonBool } from "../services/utils";

import {
  AppBarData,
  AppBarOpts,
  AppData,
  AppOptionsMenuOpts,
  AppPage,
  AppSettingsMenuOpts,
} from "../services/appData";

import { AppConfigData } from "trmrk/src/notes-app-config";

const appDataSlice = createSlice({
  name: "appData",
  initialState: {
    isDarkMode:
      localStorage.getItem(localStorageKeys.appThemeIsDarkMode) ===
      jsonBool.true,
    isCompactMode:
      localStorage.getItem(localStorageKeys.appIsCompactMode) !==
      jsonBool.false,
    baseLocation: trmrk.url.getBaseLocation(),
    htmlDocTitle: "Turmerik Local File Notes",
    appBarData: {
      appBarOpts: {},
      floatingAppBarHeightEm: 2,
      updateFloatingBarTopOffset: true,
      appSettingsMenuOpts: {
        isOpen: false,
        appThemeMenuOpts: {
          isOpen: false,
        },
      },
      appOptionsMenuOpts: {
        isOpen: false,
      },
    } as AppBarData,
  } as AppData,
  reducers: {
    setIsDarkMode(
      state,
      action: {
        type: string;
        payload: boolean;
      }
    ) {
      state.isDarkMode = action.payload;
    },
    setIsCompactMode(
      state,
      action: {
        type: string;
        payload: boolean;
      }
    ) {
      state.isCompactMode = action.payload;
    },
    setAppConfig(
      state,
      action: {
        type: string;
        payload: AppConfigData;
      }
    ) {
      state.appConfig = action.payload;
    },
    setCurrentIdnf(
      state,
      action: {
        type: string;
        payload: string | null;
      }
    ) {
      state.currentIdnf = action.payload;
    },
    setAppBarOpts(
      state,
      action: {
        type: string;
        payload: AppBarOpts;
      }
    ) {
      state.appBarData.appBarOpts = action.payload;
    },
    setAppPage(
      state,
      action: {
        type: string;
        payload: AppPage;
      }
    ) {
      state.appBarData.appBarOpts.appPage = action.payload;
    },
    setFloatingBarTopHeightEm(
      state,
      action: {
        type: string;
        payload: number;
      }
    ) {
      state.appBarData.floatingAppBarHeightEm = action.payload;
    },
    setUpdateFloatingBarTopOffset(
      state,
      action: {
        type: string;
        payload: boolean;
      }
    ) {
      state.appBarData.updateFloatingBarTopOffset = action.payload;
    },
    setAppSettingsMenuOpts(
      state,
      action: {
        type: string;
        payload: AppSettingsMenuOpts;
      }
    ) {
      state.appBarData.appSettingsMenuOpts = action.payload;
    },
    setAppOptionsMenuOpts(
      state,
      action: {
        type: string;
        payload: AppOptionsMenuOpts;
      }
    ) {
      state.appBarData.appOptionsMenuOpts = action.payload;
    },
    setAppSettingsMenuIsOpen(
      state,
      action: {
        type: string;
        payload: boolean;
      }
    ) {
      state.appBarData.appSettingsMenuOpts.appThemeMenuOpts.isOpen = false;
      state.appBarData.appSettingsMenuOpts.isOpen = action.payload;
    },
    setAppThemeMenuIsOpen(
      state,
      action: {
        type: string;
        payload: boolean;
      }
    ) {
      state.appBarData.appSettingsMenuOpts.appThemeMenuOpts.isOpen =
        action.payload;
    },
    setAppOptionsMenuIsOpen(
      state,
      action: {
        type: string;
        payload: boolean;
      }
    ) {
      state.appBarData.appOptionsMenuOpts.isOpen = action.payload;
    },
  },
});

export const {
  setIsDarkMode,
  setIsCompactMode,
  setAppConfig,
  setCurrentIdnf,
  setAppBarOpts,
  setAppPage,
  setFloatingBarTopHeightEm,
  setUpdateFloatingBarTopOffset,
  setAppSettingsMenuOpts,
  setAppOptionsMenuOpts,
  setAppSettingsMenuIsOpen,
  setAppThemeMenuIsOpen,
  setAppOptionsMenuIsOpen,
} = appDataSlice.actions;

export default appDataSlice.reducer;
