import axios from "axios";
import { AppConfigData } from "../trmrk/notes-app-config";

import { Axios } from "./axios-type-defs";

export namespace ns {
  export interface ApiConfigData {
    apiHost: string;
    apiRelUriBase: string;
    clientVersion: string;
    idxedDbNamePfx: string | null;
  }

  export type AxiosConfigBase<T> = Axios.AxiosXHRConfigBase<T>;
  export type AxiosConfig<T> = Axios.AxiosXHRConfig<T>;
  export type AxiosResponse<T> = Axios.AxiosXHR<T>;

  export interface ApiResponse<T> extends AxiosResponse<T> {
    error?: any | null | undefined;
    errTitle?: string | null | undefined;
    errMessage?: string | null | undefined;
    isSuccess?: boolean | null | undefined;
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
    isPreconditionRequiredStatus?: boolean | null | undefined;
  }

  export const trmrkHeaderNames = {
    clientVersion: "trmrk-client-version",
    clientUserUuid: "trmrk-client-user-uuid",
    requiredClientVersion: "trmrk-required-client-version",
  };

  export class ApiService {
    public apiHost!: string;
    public apiRelUriBase!: string;
    public apiUriBase!: string;
    public clientVersion!: string;
    public clientUserUuid!: string;

    public defaultConfigFactory: (
      data: any
    ) => AxiosConfigBase<any> | undefined = () => undefined;

    public init(
      data: ns.ApiConfigData,
      defaultConfigFactory?:
        | ((data: any) => AxiosConfigBase<any> | undefined)
        | null
        | undefined
    ) {
      this.apiHost = data.apiHost;
      this.apiRelUriBase = data.apiRelUriBase;
      this.apiUriBase = [this.apiHost, this.apiRelUriBase].join("/");
      this.clientVersion = data.clientVersion;

      this.defaultConfigFactory =
        defaultConfigFactory ??
        ((data) => {
          const headers: { [key: string]: string } = {};

          headers[ns.trmrkHeaderNames.clientVersion] = this.clientVersion;

          /* if (this.clientUserUuid) {
            headers[ns.trmrkHeaderNames.clientUserUuid] = this.clientUserUuid;
          } */

          return {
            withCredentials: true,
            headers,
          };
        });
    }

    public getUri(relUri: string, data?: any | null | undefined) {
      let uri = [this.apiUriBase, relUri].join("/");

      if (data) {
        const urlParams = new URLSearchParams();

        for (let key of Object.keys(data)) {
          const value = data[key];

          if ((value ?? null) !== null) {
            urlParams.set(key, value);
          }
        }

        const query = urlParams.toString();

        uri = [uri, query].join("?");
      }

      return uri;
    }

    public getError<T>(reason: any) {
      const resp = {
        error: reason,
        errTitle: "Error",
        errMessage: reason.message ?? "Oops... something went wrong",
      } as ns.ApiResponse<T>;

      return resp;
    }

    public resolvePromise<T>(
      prom: Axios.IPromise<ns.AxiosResponse<T>>,
      resolve: (
        value: ns.ApiResponse<T> | PromiseLike<ns.ApiResponse<T>>
      ) => void
    ) {
      prom
        .then((response) => {
          const resp = this.setResponseFields(response as ns.ApiResponse<T>);
          resolve(resp);
        })
        .catch((reason) => {
          let resp: ApiResponse<T>;
          const response = reason.response;

          if (response) {
            resp = this.setResponseFields(response as ns.ApiResponse<T>);
          } else {
            resp = this.getError<T>(reason);
          }

          resolve(resp);
        });
    }

    public setResponseFields<T>(resp: ns.ApiResponse<T>) {
      const status = resp.status;

      if (status >= 100) {
        if (status < 200) {
          resp.isInfoStatus = true;
        } else if (status < 300) {
          resp.isSuccessStatus = true;
          resp.isSuccess = true;
        } else if (status < 400) {
          resp.isRedirectStatus = false;
        } else {
          resp.isErrorStatus = false;

          if (status < 500) {
            resp.isClientErrorStatus = true;

            switch (status) {
              case 400:
                resp.errMessage = "A validation error has occurred";
                resp.isBadRequestStatus = true;
                break;
              case 401:
                resp.errMessage = "You are not authenticated";
                resp.isNotAuthenticatedStatus = true;
                break;
              case 403:
                resp.errMessage = "You are not authorized to access this page";
                resp.isForbiddenStatus = true;
                break;
              case 404:
                resp.errMessage =
                  "The page you are looking for doesn't exist or has been moved";
                resp.isNotFoundStatus = true;
                break;
              case 408:
                resp.errMessage = "The request took too long to respond";
                resp.isTimeoutStatus = true;
                break;
              case 428:
                resp.isPreconditionRequiredStatus = true;

                if (ns.trmrkHeaderNames.requiredClientVersion in resp.headers) {
                  resp.errMessage = `The client app in the browser needs to be updated. \
                  Please back up any unsubmitted data (if any) and then refresh the browser page in order to update the client app.`;
                }
            }
          } else {
            resp.isServerErrorStatus = true;
          }
        }
      }

      if (!resp.isSuccessStatus) {
        if (!!status) {
          resp.errTitle = status.toString();
        } else {
          resp.errTitle = "Error";
        }

        resp.errMessage ??= `The server responded with status ${status}`;
      }

      return resp;
    }

    public get<T>(
      relUri: string,
      data?: any | undefined,
      configFactory?: (
        d: any,
        cfg: AxiosConfigBase<T> | undefined
      ) => AxiosConfigBase<T> | undefined
    ) {
      return new Promise<ns.ApiResponse<T>>((resolve) => {
        this.resolvePromise(
          axios.get<T>(
            this.getUri(relUri, data),
            this.getConfig(configFactory, data)
          ),
          resolve
        );
      });
    }

    public post<T>(
      relUri: string,
      data: T,
      configFactory?: (
        d: T,
        cfg: AxiosConfigBase<T> | undefined
      ) => AxiosConfigBase<T> | undefined
    ) {
      return new Promise<ns.ApiResponse<T>>((resolve) => {
        this.resolvePromise(
          axios.post<T>(
            this.getUri(relUri),
            data,
            this.getConfig(configFactory, data)
          ),
          resolve
        );
      });
    }

    public put<T>(
      relUri: string,
      data: T,
      configFactory?: (
        d: T,
        cfg: AxiosConfigBase<T> | undefined
      ) => AxiosConfigBase<T> | undefined
    ) {
      return new Promise<ns.ApiResponse<T>>((resolve) => {
        this.resolvePromise(
          axios.put<T>(
            this.getUri(relUri),
            data,
            this.getConfig(configFactory, data)
          ),
          resolve
        );
      });
    }

    public patch<T>(
      relUri: string,
      data: T,
      configFactory?: (
        d: T,
        cfg: AxiosConfigBase<T> | undefined
      ) => AxiosConfigBase<T> | undefined
    ) {
      return new Promise<ns.ApiResponse<T>>((resolve) => {
        this.resolvePromise(
          axios.patch<T>(
            this.getUri(relUri),
            data,
            this.getConfig(configFactory, data)
          ),
          resolve
        );
      });
    }

    public delete<T>(
      relUri: string,
      data?: any | undefined,
      configFactory?: (
        d: T,
        cfg: AxiosConfigBase<T> | undefined
      ) => AxiosConfigBase<T> | undefined
    ) {
      return new Promise<ns.ApiResponse<T>>((resolve) => {
        this.resolvePromise(
          axios.delete<T>(
            this.getUri(relUri, data),
            this.getConfig(configFactory)
          ),
          resolve
        );
      });
    }

    private getConfig<T>(
      configFactory?: (
        d: T,
        cfg: AxiosConfigBase<T> | undefined
      ) => AxiosConfigBase<T> | undefined,
      data?: T
    ) {
      let config: AxiosConfigBase<T> | undefined =
        this.defaultConfigFactory(data);

      configFactory ??= (dt, cfg) => {
        /* if (cfg && (dt ?? false)) {
          (cfg as AxiosConfig<T>).data ??= dt;
        } */

        return cfg;
      };

      config = configFactory(data!, config);
      return config;
    }
  }
}

export const initApi = (
  apiSvc: ns.ApiService,
  appConfigData: AppConfigData,
  idxedDbNamePfx?: string | null | undefined,
  relUrlBase?: string | null | undefined
) => {
  apiSvc.init({
    apiHost: appConfigData.apiHost,
    apiRelUriBase: relUrlBase ?? "api",
    clientVersion: appConfigData.clientVersion,
    idxedDbNamePfx: idxedDbNamePfx ?? null,
  });
};

export type ApiConfigData = ns.ApiConfigData;
export type AxiosConfig<T> = ns.AxiosConfig<T>;
export type AxiosResponse<T> = ns.AxiosResponse<T>;
export type ApiResponse<T> = ns.ApiResponse<T>;
export const ApiService = ns.ApiService;
export type ApiServiceType = ns.ApiService;
