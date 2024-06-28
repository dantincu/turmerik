import { DriveExplorerApi } from "../../trmrk-axios/DriveExplorerApi/api";
import { ApiService } from "../../trmrk-axios/core";

import { appConfig } from "./appConfig";

export const apiSvc = new ApiService();

apiSvc.init({
  apiHost: appConfig.data.apiHost,
  apiRelUriBase: "api",
  clientVersion: appConfig.data.clientVersion,
  idxedDbNamePfx: null,
});

export const dvXplrSvc = new DriveExplorerApi(apiSvc, {
  relPath: "files",
  isLocalFileNotes: appConfig.data.isLocalFileNotesApp,
  isLocalFilesWinOS: appConfig.data.isWinOS,
});
