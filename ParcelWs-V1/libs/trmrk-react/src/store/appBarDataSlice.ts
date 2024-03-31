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

import { AppBarData, AppearenceMenuOpts, AppSettingsMenuOpts } from "./appData";

export interface AppBarDataReducer<
  TAppBarData extends AppBarData = AppBarData,
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>
> extends TrmrkReducer<TAppBarData> {
  setAppSettingsMenuOpts: TrmrkDispatcherType<
    TAppBarData,
    TAppSettingsMenuOpts
  >;
  setAppSettingsMenuIsOpen: TrmrkDispatcherType<TAppBarData, boolean>;
  setAppearenceMenuIsOpen: TrmrkDispatcherType<TAppBarData, boolean>;
}

export interface AppBarDataSelector<
  TAppBarData extends AppBarData = AppBarData,
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>
> extends TrmrkSelector<TAppBarData> {
  getAppSettingsMenuOpts: TrmrkSelectorType<TAppBarData, TAppSettingsMenuOpts>;
  getAppSettingsMenuIsOpen: TrmrkSelectorType<TAppBarData, boolean>;
  getAppearenceMenuIsOpen: TrmrkSelectorType<TAppBarData, boolean>;
}

export type AppBarDataSlice<
  TAppBarData extends AppBarData = AppBarData,
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>,
  TAppBarDataReducer extends AppBarDataReducer<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataReducer<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>,
  TAppBarDataSelector extends AppBarDataSelector<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataSelector<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>
> = TrmrkSlice<TAppBarData, TAppBarDataReducer, TAppBarDataSelector>;

export type AppBarDataSliceOps<
  TAppBarData extends AppBarData = AppBarData,
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>,
  TAppBarDataReducer extends AppBarDataReducer<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataReducer<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>,
  TAppBarDataSelector extends AppBarDataSelector<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataSelector<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>
> = TrmrkSliceOps<TAppBarData, TAppBarDataReducer, TAppBarDataSelector>;

export const createReducer = <
  TAppBarData extends AppBarData = AppBarData,
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>,
  TReducer extends AppBarDataReducer<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataReducer<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>
>() =>
  ({
    setAppSettingsMenuOpts: (state, action) => {
      state.appSettingsMenuOpts = action.payload;
    },
    setAppSettingsMenuIsOpen: (state, action) => {
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen = false;
      state.appSettingsMenuOpts.isOpen = action.payload;
    },
    setAppearenceMenuIsOpen: (state, action) => {
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen = action.payload;
    },
  } as AppBarDataReducer<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > as TReducer);

export const createSelector = <
  TAppBarData extends AppBarData = AppBarData,
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>,
  TSelector extends AppBarDataSelector<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataSelector<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>
>() =>
  ({
    getAppSettingsMenuOpts: (state) => state.appSettingsMenuOpts,
    getAppSettingsMenuIsOpen: (state) => state.appSettingsMenuOpts.isOpen,
    getAppearenceMenuIsOpen: (state) =>
      state.appSettingsMenuOpts.appearenceMenuOpts.isOpen,
  } as AppBarDataSelector<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > as TSelector);

export const defaultInitialStateFactory = <
  TAppBarData extends AppBarData = AppBarData
>() =>
  ({
    appSettingsMenuOpts: {
      isOpen: false,
      appearenceMenuOpts: {
        isOpen: false,
      },
    },
  } as TAppBarData);

export const createAppBarDataSlice = <
  TAppBarData extends AppBarData = AppBarData,
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>,
  TReducer extends AppBarDataReducer<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataReducer<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>,
  TSelector extends AppBarDataSelector<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataSelector<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>
>(
  reducer?: TReducer | null | undefined,
  selector?: TSelector | null | undefined,
  initialStateFactory?: (() => TAppBarData) | null | undefined
) => {
  reducer ??= createReducer<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts,
    TReducer
  >();
  selector ??= createSelector<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts,
    TSelector
  >();
  initialStateFactory ??= defaultInitialStateFactory;

  const slice = createSlice<TAppBarData, TReducer, string, TSelector, string>({
    name: "appBarData",
    initialState: initialStateFactory(),
    reducers: {
      ...(reducer as any),
    },
    selectors: {
      ...selector,
    },
  });

  return slice as AppBarDataSlice<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts,
    TReducer,
    TSelector
  >;
};

export const getAppBarDataSliceOps = <
  TAppBarData extends AppBarData,
  TAppearenceMenuOpts extends AppearenceMenuOpts = AppearenceMenuOpts,
  TAppSettingsMenuOpts extends AppSettingsMenuOpts<TAppearenceMenuOpts> = AppSettingsMenuOpts<TAppearenceMenuOpts>,
  TReducer extends AppBarDataReducer<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataReducer<TAppBarData, TAppearenceMenuOpts, TAppSettingsMenuOpts>,
  TSelector extends AppBarDataSelector<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  > = AppBarDataSelector<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts
  >,
  TSliceOps extends AppBarDataSliceOps<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts,
    TReducer,
    TSelector
  > = AppBarDataSliceOps<
    TAppBarData,
    TAppearenceMenuOpts,
    TAppSettingsMenuOpts,
    TReducer,
    TSelector
  >
>(
  appBarDataSlice: TrmrkSlice<TAppBarData, TReducer, TSelector>
) =>
  ({
    actions: appBarDataSlice.actions,
    selectors: appBarDataSlice.selectors,
  } as TrmrkSliceOps<TAppBarData, TReducer, TSelector> as TSliceOps);
