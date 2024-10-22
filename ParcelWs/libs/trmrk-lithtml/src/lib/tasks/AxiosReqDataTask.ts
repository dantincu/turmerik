import { ReactiveControllerHost } from "lit";
import { Task, TaskFunctionOptions } from "@lit/task";

import { TrmrkError } from "../../trmrk/TrmrkError";
import { ApiResponse } from "../../trmrk-axios/core";

export interface AxiosReqDataTask<
  T extends ReadonlyArray<unknown> = ReadonlyArray<unknown>,
  R = unknown
> {
  host: ReactiveControllerHost;
  apiSvcCallAction: (args: T, options: TaskFunctionOptions) => Promise<R>;
  argsFunc: () => T;
  noDataCallback?: (() => void) | null | undefined;
  noDataErrMsg?: string | null | undefined;
  successCallback: (data: R) => void;
  errorCallback: (resp: ApiResponse<R>) => void;
}

export const createAxiosReqDataTask = <
  T extends ReadonlyArray<unknown> = ReadonlyArray<unknown>,
  R = unknown
>(
  opts: AxiosReqDataTask<T, R>
) =>
  new Task<T, R>(opts.host, {
    task: async (args, options) => {
      let data = await opts.apiSvcCallAction(args, options);

      if ((data ?? null) === null) {
        if (opts.noDataCallback) {
          opts.noDataCallback();
        } else {
          throw new TrmrkError(
            opts.noDataErrMsg ??
              "The resource at this location does not exist or has been moved",
            null,
            {
              statusCode: 404,
            }
          );
        }
      }

      return data;
    },
    onComplete: opts.successCallback,
    onError: (err: any) => {
      const trmrkError = err as TrmrkError<ApiResponse<R>>;

      opts.errorCallback(
        trmrkError.data ??
          ({
            error: err,
            errTitle: trmrkError.statusCode?.toString() ?? "Error",
            errMessage: trmrkError.statusText ?? trmrkError.message,
          } as ApiResponse<R>)
      );
    },
    args: opts.argsFunc,
  });
