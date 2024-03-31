import {
  AppBarData,
  AppearenceMenuOpts,
  AppSettingsMenuOpts,
} from "trmrk-react/src/store/appData";

import {
  createAppBarDataSlice,
  AppBarDataSliceOps as AppBarDataSliceOpsCore,
  getAppBarDataSliceOps,
  AppBarDataReducer as AppBarDataReducerCore,
  AppBarDataSelector as AppBarDataSelectorCore,
} from "trmrk-react/src/store/appBarDataSlice";

const appBarDataSlice = createAppBarDataSlice();

export const {
  setAppSettingsMenuIsOpen,
  setAppSettingsMenuOpts,
  setAppearenceMenuIsOpen,
} = appBarDataSlice.actions;

export const {
  getAppSettingsMenuIsOpen,
  getAppSettingsMenuOpts,
  getAppearenceMenuIsOpen,
} = appBarDataSlice.selectors;

export default appBarDataSlice.reducer;

export type AppBarDataReducer = AppBarDataReducerCore<
  AppBarData,
  AppearenceMenuOpts,
  AppSettingsMenuOpts
>;
export type AppBarDataSelector = AppBarDataSelectorCore<
  AppBarData,
  AppearenceMenuOpts,
  AppSettingsMenuOpts
>;

export type AppBarDataSliceOps = AppBarDataSliceOpsCore<
  AppBarData,
  AppearenceMenuOpts,
  AppSettingsMenuOpts,
  AppBarDataReducer,
  AppBarDataSelector
>;

export const appBarDataSliceOps = getAppBarDataSliceOps(
  appBarDataSlice
) as AppBarDataSliceOps;
