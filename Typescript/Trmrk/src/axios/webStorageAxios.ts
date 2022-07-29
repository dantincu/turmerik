import { AxiosRequestConfig, AxiosResponse } from "axios";

import { Trmrk, IHash, IRefValue } from "../core/core";
import { TrmrkAxios, TrmrkAxiosApiResult } from "./trmrkAxios";
import { WebStorage } from "../core/webStorage";

export interface ICacheKeyProp<T> {
  get: (data: IRefValue<T>, obj: object) => void;
  set: (data: IRefValue<T>, key: string) => void;
}

export class WebStorageAxios {
  constructor(public webStorage: WebStorage, public trmrkAxios: TrmrkAxios) {}

  async requestMultiple<T = any, D = any>(
    axiosReqFunc: () => Promise<TrmrkAxiosApiResult<T, D>>,
    cacheKeysMap: IHash<ICacheKeyProp<T>>,
    storage: Storage | boolean = false,
    refreshCache: boolean = false
  ) {
    let apiResult: TrmrkAxiosApiResult<T, D>;
    const data = {} as IRefValue<T>;

    let cachedDataFound = !refreshCache;

    if (cachedDataFound) {
      for (const cacheKey of Object.keys(cacheKeysMap)) {
        const json = this.webStorage.getItem(cacheKey, storage);
        cachedDataFound = cachedDataFound && Trmrk.valIsStr(json, false, true);

        if (cachedDataFound) {
          const dataItem = JSON.parse(json as string);
          cacheKeysMap[cacheKey].get(data, dataItem);
        } else {
          break;
        }
      }
    }

    if (cachedDataFound) {
      apiResult = new TrmrkAxiosApiResult<T, D>({
        isSuccess: true,
        data: data.value,
      });
    } else {
      apiResult = await axiosReqFunc();

      if (apiResult.isSuccess) {
        data.value = apiResult.data;
        
        if (!cachedDataFound && !Trmrk.valIsNullOfUndefOrNaN(apiResult.data)) {
          for (const cacheKey of Object.keys(cacheKeysMap)) {
            cacheKeysMap[cacheKey].set(data, cacheKey);
          }
        }
      }
    }

    return apiResult;
  }

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

  async getMultiple<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    cacheKeysMap: IHash<ICacheKeyProp<T>>,
    storage: Storage | boolean = false,
    opts: AxiosRequestConfig<D> | null | undefined = null,
    refreshCache: boolean = false
  ) {
    const apiResult = await this.requestMultiple<T, D>(
      async () =>
        await this.trmrkAxios.get<T, R, D>(
          url,
          opts as AxiosRequestConfig<D> | undefined
        ),
      cacheKeysMap,
      storage,
      refreshCache
    );

    return apiResult;
  }

  async get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    cacheKey: string,
    storage: Storage | boolean = false,
    opts: AxiosRequestConfig<D> | null | undefined = null,
    refreshCache: boolean = false
  ) {
    const apiResult = await this.request<T, D>(
      async () =>
        await this.trmrkAxios.get<T, R, D>(
          url,
          opts as AxiosRequestConfig<D> | undefined
        ),
      cacheKey,
      storage,
      refreshCache
    );

    return apiResult;
  }
}
