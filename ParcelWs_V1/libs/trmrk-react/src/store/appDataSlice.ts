import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import trmrk from "trmrk";

import {
  TrmrkDispatcherType,
  TrmrkReducer,
  TrmrkSelector,
  TrmrkSelectorType,
  TrmrkSlice,
  TrmrkSliceOps,
} from "./core";

import { localStorageKeys } from "../utils";
import { AppData } from "./appData";

export interface AppDataReducer<TAppData extends AppData = AppData>
  extends TrmrkReducer<TAppData> {
  setShowAppBar: TrmrkDispatcherType<TAppData, boolean>;
  setShowAppBarToggleBtn: TrmrkDispatcherType<TAppData, boolean>;
  setIsDarkMode: TrmrkDispatcherType<TAppData, boolean>;
  setIsCompactMode: TrmrkDispatcherType<TAppData, boolean>;
}

export interface AppDataSelector<TAppData extends AppData = AppData>
  extends TrmrkSelector<TAppData> {
  getShowAppBar: TrmrkSelectorType<TAppData, boolean>;
  getShowAppBarToggleBtn: TrmrkSelectorType<TAppData, boolean>;
  getIsDarkMode: TrmrkSelectorType<TAppData, boolean>;
  getIsCompactMode: TrmrkSelectorType<TAppData, boolean>;
}

export type AppDataSlice<
  TAppData extends AppData = AppData,
  TAppDataReducer extends AppDataReducer<TAppData> = AppDataReducer<TAppData>,
  TAppDataSelector extends AppDataSelector<TAppData> = AppDataSelector<TAppData>
> = TrmrkSlice<TAppData, TAppDataReducer, TAppDataSelector>;

export type AppDataSliceOps<
  TAppData extends AppData = AppData,
  TAppDataReducer extends AppDataReducer<TAppData> = AppDataReducer<TAppData>,
  TAppDataSelector extends AppDataSelector<TAppData> = AppDataSelector<TAppData>
> = TrmrkSliceOps<TAppData, TAppDataReducer, TAppDataSelector>;

export const createReducer = <
  TAppData extends AppData = AppData,
  TReducer extends AppDataReducer<TAppData> = AppDataReducer<TAppData>
>() =>
  ({
    setShowAppBar: (state, action) => {
      state.showAppBar = action.payload;
    },
    setShowAppBarToggleBtn: (state, action) => {
      state.showAppBarToggleBtn = action.payload;
    },
    setIsDarkMode: (state, action) => {
      state.isDarkMode = action.payload;
    },
    setIsCompactMode: (state, action) => {
      state.isCompactMode = action.payload;
    },
  } as AppDataReducer<TAppData> as TReducer);

export const createSelector = <
  TAppData extends AppData = AppData,
  TSelector extends AppDataSelector<TAppData> = AppDataSelector<TAppData>
>() =>
  ({
    getShowAppBar: (appData) => appData.showAppBar,
    getShowAppBarToggleBtn: (appData) => appData.showAppBarToggleBtn,
    getIsDarkMode: (appData) => appData.isDarkMode,
    getIsCompactMode: (appData) => appData.isCompactMode,
  } as AppDataSelector<TAppData> as TSelector);

export const defaultInitialStateFactory = <
  TAppData extends AppData = AppData
>() =>
  ({
    baseLocation: trmrk.url.getBaseLocation(),
    showAppBar: true,
    showAppBarToggleBtn: true,
    isDarkMode:
      localStorage.getItem(localStorageKeys.appThemeIsDarkMode) ===
      trmrk.jsonBool.true,
    isCompactMode:
      localStorage.getItem(localStorageKeys.appIsCompactMode) !==
      trmrk.jsonBool.false,
  } as TAppData);

export const createAppDataSlice = <
  TAppData extends AppData = AppData,
  TReducer extends AppDataReducer<TAppData> = AppDataReducer<TAppData>,
  TSelector extends AppDataSelector<TAppData> = AppDataSelector<TAppData>
>(
  reducer?: TReducer | null | undefined,
  selector?: TSelector | null | undefined,
  initialStateFactory?: (() => TAppData) | null | undefined
) => {
  reducer ??= createReducer<TAppData, TReducer>();
  selector ??= createSelector<TAppData, TSelector>();
  initialStateFactory ??= defaultInitialStateFactory;

  const slice = createSlice<TAppData, TReducer, string, TSelector, string>({
    name: "appData",
    initialState: initialStateFactory(),
    reducers: {
      ...(reducer as any),
    },
    selectors: {
      ...selector,
    },
  });

  return slice as AppDataSlice<TAppData, TReducer, TSelector>;
};

export const getAppDataSliceOps = <
  TAppData extends AppData,
  TReducer extends AppDataReducer<TAppData> = AppDataReducer<TAppData>,
  TSelector extends AppDataSelector<TAppData> = AppDataSelector<TAppData>,
  TSliceOps extends AppDataSliceOps<
    TAppData,
    TReducer,
    TSelector
  > = AppDataSliceOps<TAppData, TReducer, TSelector>
>(
  appDataSlice: TrmrkSlice<TAppData, TReducer, TSelector>
) =>
  ({
    actions: appDataSlice.actions,
    selectors: appDataSlice.selectors,
  } as TrmrkSliceOps<TAppData, TReducer, TSelector> as TSliceOps);
