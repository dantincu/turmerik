import { trmrk, webStorage } from '../common/main.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { DriveItem, AppSettings } from './Entities.js';
import { trmrkAxios, TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { webStorageAxios } from '../common/webStorageAxios.js';

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

    async getDriveItemAsync(driveItemId) {
        let cacheKey = this.getDriveItemCacheKey(driveItemId);
        let relUrl = 'api/driveFolder';

        if (trmrk.core.isNonEmptyString(driveItemId)) {
            relUrl += "/" + encodeURIComponent(driveItemId);
        }

        let apiResult = await webStorageAxios.get(
            relUrl, cacheKey
        );

        return apiResult;
    }

    setDriveItemToCache(driveItem, driveItemId) {
        let cacheKey = this.getDriveItemCacheKey(driveItemId);
        let driveItemJson = trmrk.core.toJsonIfObj(driveItem);

        sessionStorage.setItem(cacheKey, driveItemJson);
    }

    async getDriveItemCoreAsync(driveItemId) {
        let apiResult = await trmrkAxios.get(
            'api/driveFolder', {
                params: {
                    driveItemId: driveItemId
                }
            }
        );

        return apiResult;
    }
}

const driveExplorerApiInstn = new DriveExplorerApi();
trmrk.types["DriveExplorerApi"] = DriveExplorerApi;

export const driveExplorerApi = driveExplorerApiInstn;