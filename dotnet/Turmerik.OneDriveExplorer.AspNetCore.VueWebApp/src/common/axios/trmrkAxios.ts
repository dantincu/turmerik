import { Axios, AxiosRequestConfig, AxiosResponse } from "axios";

import { TrmrkCore, ValueWrapper } from "../core/core";

export class TrmrkAxiosApiResult<T = any, D = any> {
  constructor(src: any | null | undefined = null) {
    if (src) {
      this.isSuccess = src.isSuccess ?? src.status == 200; // Did NOT use strict comparison as I DO want it to be valid when the status is "200" as a string
      this.exc = src.exc ?? null;
      this.data = src.data ?? null;
      this.status = src.status ?? null;
      this.statusText = src.statusText ?? null;
      this.headers = src.headers ?? null;
      this.config = src.config ?? null;
      this.request = src.request ?? null;
    }
  }

  isSuccess: boolean | null = null;
  exc: object | string | null = null;
  data: T | null = null;
  status: number | string | null = null;
  statusText: string | null = null;
  headers: object | null = null;
  config: AxiosRequestConfig<D> | null = null;
  request: object | null = null;

  getStatusStr(defaultValue = "Error") {
    const statusWrapper = new ValueWrapper(this.status);
    let statusStr;

    if (statusWrapper.isNotNaNNumber || statusWrapper.isNonEmptyString) {
      statusStr = this.status?.toString();
    } else {
      statusStr = defaultValue;
    }

    return statusStr;
  }

  getStatusText(defaultValue = "Error") {
    const statusText = this.statusText ?? this.getStatusStr(defaultValue);
    return statusText;
  }
}

export class TrmrkAxios {
  constructor(public axios: Axios, public trmrkCore: TrmrkCore) {}

  async request<T = any, D = any>(
    requestFunc: () => Promise<AxiosResponse<T, D>>
  ) {
    let apiResult: TrmrkAxiosApiResult<T, D>;

    try {
      const axiosApiResult = await requestFunc();
      apiResult = new TrmrkAxiosApiResult<T, D>(axiosApiResult);
    } catch (exc) {
      apiResult = new TrmrkAxiosApiResult({
        isSuccess: false,
        exc: exc,
        status: 500,
        statusText: "Unknown error",
      });
    }

    return apiResult;
  }

  async get(
    url: string,
    opts: AxiosRequestConfig<any> | undefined = undefined
  ) {
    const apiResult = await this.request(
      async () => await this.axios.get(url, opts)
    );

    return apiResult;
  }

  async put(
    url: string,
    params: any,
    opts: AxiosRequestConfig<any> | undefined = undefined
  ) {
    const apiResult = await this.request(
      async () => await this.axios.put(url, params, opts)
    );

    return apiResult;
  }

  async post(
    url: string,
    params: any,
    opts: AxiosRequestConfig<any> | undefined = undefined
  ) {
    const apiResult = await this.request(
      async () => await this.axios.post(url, params, opts)
    );

    return apiResult;
  }

  async delete(
    url: string,
    opts: AxiosRequestConfig<any> | undefined = undefined
  ) {
    const apiResult = await this.request(
      async () => await this.axios.delete(url, opts)
    );

    return apiResult;
  }

  setApiResultSuccessFlag<T = any, D = any>(
    apiResult: TrmrkAxiosApiResult<T, D>
  ) {
    if (apiResult.status === 200) {
      apiResult.isSuccess = true;
    } else {
      apiResult.isSuccess = false;
    }
  }
}
