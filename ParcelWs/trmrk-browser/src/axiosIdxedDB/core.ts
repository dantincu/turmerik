import { AxiosRequestConfig } from "axios";

import { core as trmrk } from "trmrk";

import {
  ApiConfigData,
  ApiResponse,
  AxiosResponse,
  ApiServiceType,
} from "trmrk-axios/src/core";

import {
  TrmrkIdxedDBType,
  TrmrkDBResp,
  IdxedDBInitOpts,
} from "trmrk-browser-core/src/indexedDB/core";

export interface AxiosIdxedDBInitOpts extends IdxedDBInitOpts {
  data: ApiConfigData;
  defaultConfigFactory?:
    | ((data: any) => AxiosRequestConfig<any> | undefined)
    | null
    | undefined;
}

export interface AxiosIdxedDBReq<T> {
  idxedDBGet: (db: IDBDatabase) => TrmrkDBResp<T>;
  apiCall: (apiSvc: ApiServiceType) => Promise<ApiResponse<T>>;
  idxedDBSet: (db: IDBDatabase, data: T) => TrmrkDBResp<T>;
}

export interface AxiosIdxedDBResp<T> extends ApiResponse<T>, TrmrkDBResp<T> {}

export class AxiosIdxedDB {
  constructor(
    public readonly apiSvc: ApiServiceType,
    public readonly idxedDB: TrmrkIdxedDBType
  ) {}

  public init(opts: AxiosIdxedDBInitOpts) {
    this.apiSvc.init(opts.data, opts.defaultConfigFactory);
    return this.idxedDB.init(opts);
  }

  public async req<T>(opts: AxiosIdxedDBReq<T>) {
    let resp = (await this.idxedDB.withDb<T>(
      opts.idxedDBGet
    )) as AxiosIdxedDBResp<T>;

    if (!(resp.cacheMatch || resp.cacheError)) {
      resp = (await opts.apiCall(this.apiSvc)) as AxiosIdxedDBResp<T>;

      if (resp.isSuccessStatus) {
        await this.idxedDB.withDb<T>((db) => {
          const setResp = opts.idxedDBSet(db, resp.data);
          resp.cacheError = setResp.cacheError;

          return setResp;
        });
      }
    }

    return resp;
  }
}

export type AxiosIdxedDBType = AxiosIdxedDB;
