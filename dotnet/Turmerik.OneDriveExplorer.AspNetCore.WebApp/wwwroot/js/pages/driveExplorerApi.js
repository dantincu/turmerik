import { trmrk, webStorage } from '../common/main.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { DriveItem, AppSettings } from './Entities.js';
import { trmrkAxios, TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { webStorageAxios } from '../common/webStorageAxios.js';

export class DriveItemOpEnum {
    MoveFolder = 1;
    CopyFolder = 2;
    MoveFile = 3;
    CopyFile = 4;
    DeleteFile = 5;
    CreateMultipleFolders = 6;
    CreateMultipleFiles = 7;
    CreateFolderFromMacro = 8;
    CreateFileFromMacro = 9;
}

export class DriveExplorerApi {
    appSettings = new AppSettings();
    relUri = 'api/driveFolder';

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

    async getDriveFolderAsync(driveFolderId, refreshCache) {
        let cacheKey = this.getDriveItemCacheKey(driveFolderId);
        let relUrl = this.relUri;

        if (trmrk.core.isNonEmptyString(driveFolderId)) {
            relUrl += "/" + encodeURIComponent(driveFolderId);
        }

        let apiResult = await webStorageAxios.get(
            relUrl, cacheKey, null, null, refreshCache
        );

        return apiResult;
    }

    async updateDriveFolderNameAsync(driveFolderId, newFolderName) {
        this.validateDriveItemIdAndNewName(driveFolderId, newFolderName);
        let relUrl = this.relUri + "/" + encodeURIComponent(driveFolderId);

        let opts = {
            params: {
                name: newFolderName
            }
        };

        let apiResult = await trmrkAxios.put(relUrl, opts);
        return apiResult;
    }

    async addDriveFolderAsync(parentFolderId, newFolderName) {
        this.validateDriveItemIdAndNewName(parentFolderId, newFolderName);
        let relUrl = this.relUri;

        let opts = {
            params: {
                parentFolderId: parentFolderId,
                name: newFolderName
            }
        };

        let apiResult = await trmrkAxios.post(relUrl, opts);
        return apiResult;
    }

    async removeDriveFolderAsync(driveFolderId) {
        this.validateDriveItemId(driveFolderId);
        let relUrl = this.relUri + "/" + encodeURIComponent(driveFolderId);

        let apiResult = await trmrkAxios.delete(relUrl);
        return apiResult;
    }

    async updateDriveFileNameAsync(driveFileId, newFileName) {
        this.validateDriveItemIdAndNewName(driveFileId, newFileName);
        let relUrl = this.relUri + "/" + encodeURIComponent(driveFileId);

        let opts = {
            params: {
                name: newFolderName
            }
        };

        let apiResult = await trmrkAxios.put(relUrl, opts);
        return apiResult;
    }

    async addDriveFileAsync(parentFolderId, newFileName) {
        this.validateDriveItemIdAndNewName(parentFolderId, newFileName);
        let relUrl = this.relUri;

        let opts = {
            params: {
                parentFolderId: parentFolderId,
                name: newFolderName
            }
        };

        let apiResult = await trmrkAxios.post(relUrl, opts);
        return apiResult;
    }

    async removeDriveFileAsync(driveFileId) {
        this.validateDriveItemId(driveFileId);
        let relUrl = this.relUri + "/" + encodeURIComponent(driveFileId);

        let apiResult = await trmrkAxios.delete(relUrl);
        return apiResult;
    }

    setDriveItemToCache(driveItem, driveItemId) {
        let cacheKey = this.getDriveItemCacheKey(driveItemId);
        let driveItemJson = trmrk.core.toJsonIfObj(driveItem);

        sessionStorage.setItem(cacheKey, driveItemJson);
    }

    validateDriveItemId(driveItemId) {
        this.validateRequiredStringItems({
            key: "driveItemId",
            value: driveItemId
        });
    }

    validateDriveItemIdAndNewName(driveItemId, newItemName) {
        this.validateRequiredStringItems({
            key: "driveItemId",
            value: driveItemId
        }, {
            key: "newItemName",
            value: newItemName
        });
    }

    validateRequiredStringItems(argsArr) {
        for (let arg of argsArr) {
            if (!trmrk.core.isNonEmptyString(arg.value)) {
                throw arg.key + " must be a non-empty string";
            }
        }
    }
}

const driveExplorerApiInstn = new DriveExplorerApi();
const driveItemOpEnumInstn = new DriveItemOpEnum();

trmrk.types["DriveExplorerApi"] = DriveExplorerApi;
trmrk.types["DriveItemOpEnum"] = DriveItemOpEnum;

export const driveExplorerApi = driveExplorerApiInstn;
export const driveItemOpEnum = driveItemOpEnumInstn;