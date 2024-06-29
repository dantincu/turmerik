import { ApiService, initApi } from "../../trmrk-axios/core";
import { appConfig } from "./appConfig";

export const apiSvc = new ApiService();
initApi(apiSvc, appConfig.value);
