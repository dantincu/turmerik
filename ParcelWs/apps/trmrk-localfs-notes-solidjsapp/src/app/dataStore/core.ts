import { createContext, Context } from "solid-js";

import {
  AppDataCore,
  createAppDataCore,
  AppContext as AppContextCore,
} from "../../trmrk-solidjs/dataStore/core";

export interface AppData extends AppDataCore {}

export const createAppData = () => {
  const appData = createAppDataCore() as AppData;
  return appData;
};

export const AppContext = AppContextCore as Context<AppData>;
