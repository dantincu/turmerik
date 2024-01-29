import * as core from "./core";
import * as appData from "./appData";
import * as appDataSlice from "./appDataSlice";

export const store = {
  ...core,
  ...appData,
  ...appDataSlice,
};
