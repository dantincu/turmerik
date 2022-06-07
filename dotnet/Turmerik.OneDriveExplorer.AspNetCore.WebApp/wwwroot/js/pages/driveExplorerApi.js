import { trmrk, webStorage } from '../common/main.js';
import { TrmrkActionResult } from '../common/ViewModelBase.js';
import { DriveItem, AppSettings } from './Entities.js';

export class DriveExplorerApi {
    appSettings = new AppSettings();

    getDriveItemCacheKey(driveItemId) {
        let cacheKey;
        
        if (trmrk.core.isNonEmptyString(driveItemId)) {
            cacheKey = webStorage.getCacheKey(
                this.appSettings.DriveFolderCacheKeyName,
                driveItemId, this.username);
        } else {
            cacheKey = webStorage.getCacheKey(
                this.appSettings.RootDriveFolderCacheKeyName,
                this.username);
        }

        return cacheKey;
    }

    getDriveItemJsonFromCache(driveItemId) {
        let cacheKey = this.getDriveItemCacheKey(driveItemId);
        let driveItemJson = sessionStorage.getItem(cacheKey);

        return driveItemJson;
    }

    async getDriveItemAsync(driveItemId) {
        let apiResult = new TrmrkActionResult();

        let driveItemJson = this.getDriveItemJsonFromCache(driveItemId);
        let driveItem = trmrk.core.tryParseJson(driveItemJson);

        if (trmrk.core.isNotNullObj(driveItem)) {
            apiResult = new TrmrkActionResult({
                IsSuccess: true,
                Data: driveItem
            });
        } else {
            apiResult = await this.getDriveItemCoreAsync(driveItemId);
        }

        return driveItem;
    }

    setDriveItemToCache(driveItem, driveItemId) {
        let cacheKey = this.getDriveItemCacheKey(driveItemId);
        let driveItemJson = trmrk.core.toJsonIfObj(driveItem);

        sessionStorage.setItem(cacheKey, driveItemJson);
    }

    async getDriveItemCoreAsync(driveItemId) {

    }
}

const driveExplorerApiInstn = new DriveExplorerApi();
trmrk.types["DriveExplorerApi"] = DriveExplorerApi;

export const driveExplorerApi = driveExplorerApiInstn;