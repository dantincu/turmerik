import { trmrk, webStorage } from '../common/main.js';
import { DriveItem } from './DriveItem.js';

export class DriveExplorer {
    username = null;
    urlQuery = null;
    appSettings = null;
    driveFolderCacheKeyName = "driveFolder";
    rootDriveFolderCacheKeyName = "rootDriveFolder";

    init(username, appSettings) {
        this.username = username;
        this.appSettings = appSettings;
    }

    getDriveItemCacheKey(id) {
        let cacheKey = this.getCacheKey(
            this.driveFolderCacheKeyName,
            id, this.username);

        return cacheKey;
    }

    getDriveItemJson(id) {
        let cacheKey = this.getDriveItemCacheKey(id);
        let driveItemJson = sessionStorage.getItem(cacheKey);

        return driveItemJson;
    }

    getDriveItem(id) {
        let driveItemJson = this.getDriveItemJson(id);
        let driveItem = JSON.parse(driveItemJson);

        return driveItem;
    }

    setDriveItem(driveItem, id) {
        let cacheKey = this.getDriveItemCacheKey(id);
        let driveItemJson = trmrk.core.toJsonIfObj(driveItem);

        sessionStorage.setItem(cacheKey, driveItemJson);
    }
}

const driveExplorerInstn = new DriveExplorer();

trmrk.driveExplorer = driveExplorerInstn;
export const driveExplorer = driveExplorerInstn;
