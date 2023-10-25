import axios from "axios";

export namespace core {
  export interface ApiConfigData {
    apiHost: string;
    apiRelUriBase: string;
  }

  export interface AxiosResponse<T> {
    data: T;
    status: number;
    statusText: string;
    request?: any;
  }

  export interface ApiResponse<T> extends AxiosResponse<T> {
    error?: any | null | undefined;
    errTitle?: string | null | undefined;
    errMessage?: string | null | undefined;
    isSuccessStatus?: boolean | null | undefined;
    isRedirectStatus?: boolean | null | undefined;
    isInfoStatus?: boolean | null | undefined;
    isErrorStatus?: boolean | null | undefined;
    isClientErrorStatus?: boolean | null | undefined;
    isServerErrorStatus?: boolean | null | undefined;
    isForbiddenStatus?: boolean | null | undefined;
    isBadRequestStatus?: boolean | null | undefined;
    isNotAuthenticatedStatus?: boolean | null | undefined;
    isNotFoundStatus?: boolean | null | undefined;
    isTimeoutStatus?: boolean | null | undefined;
  }
}

export type ApiConfigData = core.ApiConfigData;
export type AxiosResponse<T> = core.AxiosResponse<T>;
export type ApiResponse<T> = core.ApiResponse<T>;

export class ApiService {
  public apiHost!: string;
  public apiRelUriBase!: string;
  public apiUriBase!: string;

  public init(data: core.ApiConfigData) {
    this.apiHost = data.apiHost;
    this.apiRelUriBase = data.apiRelUriBase;
    this.apiUriBase = [this.apiHost, this.apiRelUriBase].join("/");
  }

  public getUri(relUri: string) {
    const uri = [this.apiUriBase, relUri].join("/");
    return uri;
  }

  public getError<T>(reason: any) {
    const resp = {
      error: reason,
      errTitle: "Error",
      errMessage: reason.message ?? "Oops... something went wrong",
    } as core.ApiResponse<T>;

    return resp;
  }

  public resolvePromise<T>(
    prom: Promise<core.AxiosResponse<T>>,
    resolve: (
      value: core.ApiResponse<T> | PromiseLike<core.ApiResponse<T>>
    ) => void
  ) {
    prom
      .then((response) => {
        const resp = this.setResponseFields(response as core.ApiResponse<T>);
        resolve(resp);
      })
      .catch((reason) => {
        const resp = this.getError<T>(reason);
        resolve(resp);
      });
  }

  public setResponseFields<T>(resp: core.ApiResponse<T>) {
    const status = resp.status;

    if (status && status >= 100) {
      if (status < 200) {
        resp.isInfoStatus = true;
        resp.errMessage = "Unexpected status code";
      } else if (status < 300) {
        resp.isSuccessStatus = true;
      } else if (status < 400) {
        resp.errMessage = "Unexpected status code";
        resp.isRedirectStatus = false;
      } else {
        resp.isErrorStatus = false;

        if (status < 500) {
          resp.isClientErrorStatus = true;

          switch (status) {
            case 400:
              resp.errMessage = "A validation error occurred";
              resp.isBadRequestStatus = true;
              break;
            case 401:
              resp.errMessage = "You are not authenticated";
              resp.isNotAuthenticatedStatus = true;
              break;
            case 403:
              resp.errMessage =
                "You are not authorized to access the requested resource";
              resp.isForbiddenStatus = true;
              break;
            case 404:
              resp.errMessage = "The requested resource could not be found";
              resp.isNotFoundStatus = true;
              break;
            case 408:
              resp.errMessage = "The request took too long to respond";
              resp.isTimeoutStatus = true;
              break;
          }
        } else {
          resp.isServerErrorStatus = true;
        }
      }
    } else {
      resp.errMessage = "Unexpected status code";
    }

    if (!resp.isSuccessStatus) {
      if (!!status) {
        resp.errTitle = status.toString();
      } else {
        resp.errTitle = "Error";
      }

      resp.errMessage ??= "The server responded with an error";
    }

    return resp;
  }

  public get<T, D = any>(relUri: string, data?: D | undefined) {
    return new Promise<core.ApiResponse<T>>((resolve) => {
      this.resolvePromise(
        axios.get<T, core.AxiosResponse<T>, D>(this.getUri(relUri), {
          data: data,
        }),
        resolve
      );
    });
  }

  public post<T, D = any>(relUri: string, data: D) {
    return new Promise<core.ApiResponse<T>>((resolve) => {
      this.resolvePromise(
        axios.post<T, core.AxiosResponse<T>, D>(this.getUri(relUri), data),
        resolve
      );
    });
  }

  public put<T, D = any>(relUri: string, data: D) {
    return new Promise<core.ApiResponse<T>>((resolve) => {
      this.resolvePromise(
        axios.put<T, core.AxiosResponse<T>, D>(this.getUri(relUri), data),
        resolve
      );
    });
  }

  public patch<T, D = any>(relUri: string, data: D) {
    return new Promise<core.ApiResponse<T>>((resolve) => {
      this.resolvePromise(
        axios.patch<T, core.AxiosResponse<T>, D>(this.getUri(relUri), data),
        resolve
      );
    });
  }

  public delete<T, D = any>(relUri: string, data?: D | undefined) {
    return new Promise<core.ApiResponse<T>>((resolve) => {
      this.resolvePromise(
        axios.delete<T, core.AxiosResponse<T>, D>(this.getUri(relUri), {
          data: data,
        }),
        resolve
      );
    });
  }
}
