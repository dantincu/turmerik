import { IDriveExplorerApi } from "trmrk/src/DriveExplorerApi/core";

export class DriveExplorerSvc {
  public svc: IDriveExplorerApi | null = null;
}

export const driveExplorerSvc = new DriveExplorerSvc();
