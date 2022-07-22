import { AxiosRequestConfig, AxiosResponse } from "axios";

import { Trmrk } from "../core/core";
import { TrmrkAxios, TrmrkAxiosApiResult } from "./trmrkAxios";
import { WebStorage } from "../core/webStorage";

export class WebStorageAxios {
  constructor(public webStorage: WebStorage, public trmrkAxios: TrmrkAxios) {}

  async request<T = any, D = any>(
    axiosReqFunc: () => Promise<TrmrkAxiosApiResult<T, D>>,
    cacheKey: string,
    storage: Storage | boolean = false,
    refreshCache: boolean = false
  ) {
    let json: string | null = null;
    let data;

    if (!refreshCache) {
      json = this.webStorage.getItem(cacheKey, storage);

      if (Trmrk.valIsStr(json, false, true)) {
        data = JSON.parse(json as string);
      }
    }

    let apiResult: TrmrkAxiosApiResult<T, D>;
    let cachedDataFound = false;

    if (!Trmrk.valIsUndef(data)) {
      cachedDataFound = true;

      apiResult = new TrmrkAxiosApiResult<T, D>({
        isSuccess: true,
        data: data,
      });
    } else {
      apiResult = await axiosReqFunc();

      if (apiResult.isSuccess) {
        if (!cachedDataFound && !Trmrk.valIsNullOfUndefOrNaN(apiResult.data)) {
          json = JSON.stringify(apiResult.data);
          this.webStorage.setItem(cacheKey, json, storage);
        }
      }
    }

    return apiResult;
  }

  async get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    cacheKey: string,
    storage: Storage | boolean,
    opts: AxiosRequestConfig<D>,
    refreshCache: boolean
  ) {
    const apiResult = await this.request<T, D>(
      async () => await this.trmrkAxios.get<T, R, D>(url, opts),
      cacheKey,
      storage,
      refreshCache
    );

    return apiResult;
  }
}
