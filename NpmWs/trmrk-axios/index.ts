import { ApiService } from "./src/core";

import * as core from "./src/core";

export const axios = {
  ApiService,
};

export type ApiConfigData = core.ApiConfigData;
export type ApiResponse<T> = core.ApiResponse<T>;
export type AxiosResponse<T> = core.AxiosResponse<T>;
