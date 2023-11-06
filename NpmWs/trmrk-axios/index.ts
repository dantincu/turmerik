import { AxiosRequestConfig as AxiosRequestConfigType } from "axios";
import * as apiCore from "./src/core";

export type ApiConfigData = apiCore.ApiConfigData;
export type ApiResponse<T> = apiCore.ApiResponse<T>;
export type AxiosResponse<T> = apiCore.AxiosResponse<T>;
export const ApiService = apiCore.ApiService;
export type ApiServiceType = apiCore.ApiServiceType;
export type AxiosRequestConfig<D = any> = AxiosRequestConfigType<D>;
