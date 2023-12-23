import * as localforage from "localforage";
import { core as trmrk } from "trmrk";

import {
  ApiConfigData,
  ApiResponse,
  AxiosResponse,
  ApiServiceType,
  AxiosRequestConfig,
} from "trmrk-axios";

import { browser as trmrkBrowser, TrmrkDBResp } from "trmrk-browser-core";

export interface AxiosLocalForageInitOpts {
  data: ApiConfigData;
  defaultConfigFactory?:
    | ((data: any) => AxiosRequestConfig<any> | undefined)
    | null
    | undefined;
}

export interface AxiosLocalForageReq<T> {
  localForageGet: () => Promise<TrmrkDBResp<T>>;
  apiCall: (apiSvc: ApiServiceType) => Promise<ApiResponse<T>>;
  localForageSet: (data: T) => Promise<TrmrkDBResp<T>>;
}

export interface AxiosLocalForageResp<T>
  extends ApiResponse<T>,
    TrmrkDBResp<T> {}

export class AxiosLocalForage {
  constructor(public readonly apiSvc: ApiServiceType) {}

  public init(opts: AxiosLocalForageInitOpts) {
    this.apiSvc.init(opts.data, opts.defaultConfigFactory);
  }

  public async req<T>(opts: AxiosLocalForageReq<T>) {
    let resp = (await opts.localForageGet()) as AxiosLocalForageResp<T>;

    if (!resp.cacheMatch) {
      resp = (await opts.apiCall(this.apiSvc)) as AxiosLocalForageResp<T>;

      if (resp.isSuccessStatus) {
        const setResp = await opts.localForageSet(resp.data);
        resp.cacheError = setResp.cacheError;
      }
    }

    return resp;
  }
}

export type AxiosLocalForageType = AxiosLocalForage;
