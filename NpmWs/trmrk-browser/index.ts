export * from "trmrk-browser-core";

import * as trmrkBrowser from "./src";

import { axiosIdxedDB } from "./src";

export const browser = {
  axiosIdxedDB,
};

export type AxiosIdxedDB = trmrkBrowser.AxiosIdxedDB;
export type AxiosIdxedDBType = trmrkBrowser.AxiosIdxedDBType;
export type AxiosIdxedDBInitOpts = trmrkBrowser.AxiosIdxedDBInitOpts;
export type AxiosIdxedDBReq<T> = trmrkBrowser.AxiosIdxedDBReq<T>;
export type AxiosIdxedDBResp<T> = trmrkBrowser.AxiosIdxedDBResp<T>;
