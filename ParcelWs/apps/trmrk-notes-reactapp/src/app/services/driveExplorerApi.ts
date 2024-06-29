import { DriveExplorerApi } from "../../trmrk-axios/DriveExplorerApi/api";
import { appConfig } from "./appConfig";
import { apiSvc } from "./apiSvc";

export const dvXplrApi = new DriveExplorerApi(apiSvc, {
  relPath: "files",
  isLocalFileNotes: appConfig.value.isLocalFileNotesApp,
  isLocalFilesWinOS: appConfig.value.isWinOS,
});
