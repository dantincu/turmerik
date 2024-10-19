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
        throw new Error("Something went wrong and data could not be loaded...");
      }

      return data;
    },
    onComplete: opts.successCallback,
    onError: (err: any) => {
      opts.errorCallback(
        (err as TrmrkError<ApiResponse<R>>).data ??
          ({
            error: err,
            errTitle: "Error",
            errMessage: (err as Error).message,
          } as ApiResponse<R>)
      );
    },
    args: opts.argsFunc,
  });
