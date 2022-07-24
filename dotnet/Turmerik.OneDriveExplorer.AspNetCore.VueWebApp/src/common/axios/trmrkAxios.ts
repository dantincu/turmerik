import { Trmrk } from "../core/core";
import {
  Axios,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosDefaults,
  AxiosRequestHeaders,
} from "axios";

export class TrmrkAxiosApiResult<T = any, D = any> {
  constructor(src: any | null | undefined = null) {
    if (src) {
      this.isSuccess = src.isSuccess ?? src.status == 200; // Did NOT use strict comparison as I DO want it to be valid when the status is "200" as a string
      this.exc = src.exc ?? null;
      this.data = Trmrk.getObjOrParseJsonIfStr<T>(src.data);
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
    let statusStr;

    if (
      Trmrk.valIsOfTypeString(this.status) ||
      Trmrk.valIsNotNaNNumber(this.status)
    ) {
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
  constructor(public axios: Axios) {
    axios.defaults = {
      headers: {
        get: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        } as AxiosRequestHeaders,
        post: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        } as AxiosRequestHeaders,
        put: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        } as AxiosRequestHeaders,
        delete: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        } as AxiosRequestHeaders,
      },
    } as AxiosDefaults;
  }

  async request<T = any, R = AxiosResponse<T>, D = any>(
    requestFunc: () => Promise<R>
  ) {
    let apiResult: TrmrkAxiosApiResult<T, D> | null = null;

    const axiosApiResult = await requestFunc().catch((exc: any) => {
      apiResult = new TrmrkAxiosApiResult<T, D>({
        isSuccess: false,
        exc: exc,
        status: 500,
        statusText: "Unknown error",
      });

      return null;
    });

    if (!apiResult && axiosApiResult) {
      apiResult = new TrmrkAxiosApiResult<T, D>(axiosApiResult);
    }

    return apiResult as TrmrkAxiosApiResult<T, D>;
  }

  async get<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    opts: AxiosRequestConfig<D> | undefined = undefined
  ) {
    const apiResult = await this.request<T, R, D>(async () => {
      return await this.axios.get<T, R, D>(
        url,
        opts ?? {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );
    });

    /* if (Trmrk.valIsNullOfUndef(opts)) {
      apiResult = await this.request<T, R, D>(async () => {
        return await this.axios.get<T, R, D>(url);
      });
    } else {
      apiResult = await this.request<T, R, D>(async () => {
        return await this.axios.get<T, R, D>(url, opts ?? {});
      });
    } */

    return apiResult;
  }

  async put<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    params: any,
    opts: AxiosRequestConfig<D> | undefined = undefined
  ) {
    const apiResult = await this.request<T, R, D>(
      async () =>
        await this.axios.put<T, R, D>(
          url,
          params,
          opts ?? {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        )
    );

    /* if (Trmrk.valIsNullOfUndef(opts)) {
      if (Trmrk.valIsNullOfUndef(params)) {
        apiResult = await this.request<T, R, D>(
          async () => await this.axios.put<T, R, D>(url)
        );
      } else {
        apiResult = await this.request<T, R, D>(
          async () => await this.axios.put<T, R, D>(url, params)
        );
      }
    } else {
      apiResult = await this.request<T, R, D>(
        async () => await this.axios.put<T, R, D>(url, params ?? {}, opts)
      );
    }*/

    return apiResult;
  }

  async post<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    params: any,
    opts: AxiosRequestConfig<D> | undefined = undefined
  ) {
    const apiResult = await this.request<T, R, D>(
      async () =>
        await this.axios.post<T, R, D>(
          url,
          params,
          opts ?? {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
            },
          }
        )
    );

    /* if (Trmrk.valIsNullOfUndef(opts)) {
      if (Trmrk.valIsNullOfUndef(params)) {
        apiResult = await this.request<T, R, D>(
          async () => await this.axios.post<T, R, D>(url)
        );
      } else {
        apiResult = await this.request<T, R, D>(
          async () => await this.axios.post<T, R, D>(url, params)
        );
      }
    } else {
      apiResult = await this.request<T, R, D>(
        async () => await this.axios.post<T, R, D>(url, params ?? {}, opts)
      );
    } */

    return apiResult;
  }

  async delete<T = any, R = AxiosResponse<T>, D = any>(
    url: string,
    opts: AxiosRequestConfig<D> | undefined = undefined
  ) {
    const apiResult = await this.request<T, R, D>(async () => {
      return await this.axios.delete<T, R, D>(
        url,
        opts ?? {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        }
      );
    });

    /* if (Trmrk.valIsNullOfUndef(opts)) {
      apiResult = await this.request<T, R, D>(async () => {
        return await this.axios.delete<T, R, D>(url);
      });
    } else {
      apiResult = await this.request<T, R, D>(async () => {
        return await this.axios.delete<T, R, D>(url, opts);
      });
    } */

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
