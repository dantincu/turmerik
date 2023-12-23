import * as axiosIdxedDB from "./axiosIdxedDB";
import * as axiosLocalForage from "./axiosLocalForage";

export const browser = {
  axiosIdxedDB,
  axiosLocalForage,
};

export type AxiosIdxedDB = axiosIdxedDB.AxiosIdxedDB;
export type AxiosIdxedDBType = axiosIdxedDB.AxiosIdxedDBType;
export type AxiosIdxedDBInitOpts = axiosIdxedDB.AxiosIdxedDBInitOpts;
export type AxiosIdxedDBReq<T> = axiosIdxedDB.AxiosIdxedDBReq<T>;
export type AxiosIdxedDBResp<T> = axiosIdxedDB.AxiosIdxedDBResp<T>;
