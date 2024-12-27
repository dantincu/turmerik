import { Context } from "solid-js";
import { SetStoreFunction } from "solid-js/store";

import {
  AppDataCore,
  createAppDataCore,
  AppContext as AppContextCore,
} from "../../trmrk-solidjs/dataStore/core";

export interface AppData extends AppDataCore {}

export type NestedPaths<T> = {
  [K in keyof T & (string | number)]: T[K] extends (infer U)[] // Array case
    ? `${K}` | `${K}[${string | number}]` | `${K}[${NestedPaths<U>}]`
    : T[K] extends object // Regular object case
    ? `${K}` | `${K}.${NestedPaths<T[K]>}`
    : `${K}`; // Base case for primitive types
}[keyof T & (string | number)];

export type AppDataPaths = NestedPaths<AppData>;

export type AppContextType = {
  appData: AppData;
  setAppDataFull: SetStoreFunction<AppData>;
  setAppData: <T>(path: AppDataPaths, value: T) => void;
};

export const createAppData = () => {
  const appData = createAppDataCore() as AppData;
  return appData;
};

export const AppContext = AppContextCore as Context<AppContextType>;
