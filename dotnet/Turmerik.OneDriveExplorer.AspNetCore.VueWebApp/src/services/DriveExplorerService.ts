import { DriveItem } from "./Entities";

export class DriveExplorerService {
  loading: boolean;
  currentDriveFolderId: string | null;
  currentDriveFolder: DriveItem | null;
  status: string | null;
  statusText: string | null;
  error: string | object | null;

  constructor() {
    this.loading = false;
    this.currentDriveFolderId = null;
    this.currentDriveFolder = null;
    this.status = null;
    this.statusText = null;
    this.error = null;
  }

  async loadDriveFolderAsync(driveFolderId: string | null) {}
}
