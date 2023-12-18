import { ApiService } from "trmrk-axios";
import { browser as trmrkBrowserCore } from "trmrk-browser-core";

import { browser as trmrkBrowser } from "trmrk-browser";

export const apiSvc = new ApiService();
export const idxedDB = new trmrkBrowserCore.indexedDB.TrmrkIdxedDB();

export const cachedApiSvc = new trmrkBrowser.axiosIdxedDB.AxiosIdxedDB(
  apiSvc,
  idxedDB
);
