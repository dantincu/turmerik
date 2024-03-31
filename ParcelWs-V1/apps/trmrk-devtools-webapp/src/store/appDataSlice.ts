import { AppData } from "trmrk-react/src/store/appData";

import {
  createAppDataSlice,
  AppDataSliceOps as AppDataSliceOpsCore,
  getAppDataSliceOps,
  AppDataReducer as AppDataReducerCore,
  AppDataSelector as AppDataSelectorCore,
} from "trmrk-react/src/store/appDataSlice";

const appDataSlice = createAppDataSlice();

export const {
  setIsCompactMode,
  setIsDarkMode,
  setShowAppBar,
  setShowAppBarToggleBtn,
} = appDataSlice.actions;

export const {
  getIsCompactMode,
  getIsDarkMode,
  getShowAppBar,
  getShowAppBarToggleBtn,
} = appDataSlice.selectors;

export default appDataSlice.reducer;

export type AppDataReducer = AppDataReducerCore<AppData>;
export type AppDataSelector = AppDataSelectorCore<AppData>;

export type AppDataSliceOps = AppDataSliceOpsCore<
  AppData,
  AppDataReducer,
  AppDataSelector
>;

export const appDataSliceOps = getAppDataSliceOps(
  appDataSlice
) as AppDataSliceOps;
