import { createContext, Context } from "solid-js";

import {
  AppDataCore,
  createAppDataCore,
  appContextRef,
} from "../../trmrk-solidjs/dataStore/core";

export interface AppData extends AppDataCore {}

export const createAppData = () => {
  const appData = createAppDataCore() as AppData;
  return appData;
};

export const AppContext = createContext<AppData>();
appContextRef.register(AppContext as Context<AppData>);
