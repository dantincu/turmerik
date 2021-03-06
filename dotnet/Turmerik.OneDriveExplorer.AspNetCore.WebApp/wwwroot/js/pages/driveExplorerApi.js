import { trmrk, webStorage } from '../common/main.js';
import { AppSettings } from './Entities.js';
import { trmrkAxios } from '../common/trmrkAxios.js';
import { webStorageAxios } from '../common/webStorageAxios.js';

export class OfficeLikeFileType {
    docs = 1;
    sheets = 2;
    slides = 3;
}

const officeLikeFileTypeInstn = new OfficeLikeFileType();

export const officeFileLikeTypeExtensions = {};
officeFileLikeTypeExtensions[officeLikeFileTypeInstn.docs] = ".docx";

officeFileLikeTypeExtensions[officeLikeFileTypeInstn.sheets] = ".xlsx";
officeFileLikeTypeExtensions[officeLikeFileTypeInstn.slides] = ".pptx";

export const driveItemNameInvalidChars = "\\/:*?\"<>|";

export class DriveExplorerApi {
    appSettings = new AppSettings();

    getDriveItemMacrosRelUri;
    username = null;

    constructor() {
    }

    setAppSettings(appSettings) {
        this.appSettings = new AppSettings(appSettings);
        this.getDriveItemMacrosRelUri = appSettings.apiExplorerRelUri + "/" + appSettings.getDriveItemMacrosActionName;
    }

    getDriveFolderCacheKey(driveFolderId) {
        let cacheKey;
        
        if (trmrk.core.isNonEmptyString(driveFolderId)) {
            cacheKey = webStorage.getCacheKey(
                this.appSettings.driveFolderCacheKeyName,
                driveFolderId, this.username);
        } else {
            cacheKey = webStorage.getCacheKey(
                this.appSettings.rootDriveFolderCacheKeyName,
                this.username);
        }

        return cacheKey;
    }

    async getDriveFolderAsync(driveFolderId, refreshCache) {
        let cacheKey = this.getDriveFolderCacheKey(driveFolderId);
        let relUrl = this.appSettings.apiFolderRelUri;

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
        let relUrl = this.appSettings.apiFolderRelUri + "/" + encodeURIComponent(driveFolderId);

        let params = {
            name: newFolderName
        };

        let apiResult = await trmrkAxios.put(relUrl, params);
        return apiResult;
    }

    async addDriveFolderAsync(parentFolderId, newFolderName) {
        this.validateDriveItemIdAndNewName(parentFolderId, newFolderName);
        let relUrl = this.appSettings.apiFolderRelUri;

        let params = {
            parentFolderId: parentFolderId,
            name: newFolderName
        };

        let apiResult = await trmrkAxios.post(relUrl, params);
        return apiResult;
    }

    async removeDriveFolderAsync(driveFolderId) {
        this.validateDriveItemId(driveFolderId);
        let relUrl = this.appSettings.apiFolderRelUri + "/" + encodeURIComponent(driveFolderId);

        let apiResult = await trmrkAxios.delete(relUrl);
        return apiResult;
    }

    async updateDriveFileNameAsync(driveFileId, newFileName, officeLikeFileType) {
        this.validateDriveItemIdAndNewName(driveFileId, newFileName, officeLikeFileType);
        let relUrl = this.appSettings.apiFileRelUri + "/" + encodeURIComponent(driveFileId);

        let params = {
            name: newFileName,
            officeLikeFileType: officeLikeFileType
        };

        let apiResult = await trmrkAxios.put(relUrl, params);
        return apiResult;
    }

    async addDriveFileAsync(parentFolderId, newFileName, officeLikeFileType) {
        this.validateDriveItemIdAndNewName(parentFolderId, newFileName, officeLikeFileType);
        let relUrl = this.appSettings.apiFileRelUri;

        let params = {
            parentFolderId: parentFolderId,
            name: newFileName
        }

        let apiResult = await trmrkAxios.post(relUrl, params);
        return apiResult;
    }

    async removeDriveFileAsync(driveFileId) {
        this.validateDriveItemId(driveFileId);
        let relUrl = this.appSettings.apiFileRelUri + "/" + encodeURIComponent(driveFileId);

        let apiResult = await trmrkAxios.delete(relUrl);
        return apiResult;
    }

    async getDriveItemMacrosAsync() {
        const relUri = this.getDriveItemMacrosRelUri;
        const cacheKey = this.appSettings.driveItemMacrosCacheKeyName;
        
        let apiResult = await webStorageAxios.get(
            relUri, cacheKey
        );

        return apiResult;
    }

    setDriveFolderToCache(driveFolder, parentFolderId) {
        let cacheKey = this.getDriveFolderCacheKey(driveFolder.id);
        
        if (trmrk.core.isNonEmptyString(parentFolderId)) {
            driveFolder = trmrk.core.mergeAll(
                {}, [ {
                    parentFolderId: parentFolderId
                }, driveFolder ], true);
        }

        let driveFolderJson = trmrk.core.toJsonIfObj(driveFolder);
        sessionStorage.setItem(cacheKey, driveFolderJson);
    }

    removeDriveFolderFromCache(driveFolder) {
        let cacheKey = this.getDriveFolderCacheKey(driveFolder.id);
        sessionStorage.removeItem(cacheKey);
    }

    validateDriveItemId(driveItemId) {
        this.validateRequiredStringItems([{
            key: "driveItemId",
            value: driveItemId
        }]);
    }

    validateDriveItemIdAndNewName(driveItemId, newItemName, officeLikeFileType) {
        this.validateRequiredStringItems([{
            key: "driveItemId",
            value: driveItemId
        }, {
            key: "newItemName",
            value: newItemName
        }]);

        this.validateDriveItemName(newItemName);

        if (trmrk.core.isNotNaNNumber(officeLikeFileType)) {
            this.validateOfficeLikeFileName(newItemName, officeLikeFileType);
        }
    }

    validateRequiredStringItems(argsArr) {
        for (let arg of argsArr) {
            if (!trmrk.core.isNonEmptyString(arg.value)) {
                throw arg.key + " must be a non-empty string";
            }
        }
    }

    validateDriveItemName(newItemName) {
        let charsArr = newItemName.split('').filter(
            c => driveItemNameInvalidChars.indexOf(c) >= 0
        );

        if (charsArr.length > 0) {
            const errorMessage = "Drive name \"" + newItemName + "\" contains the following illegal chars: " + charsArr.join();
            throw errorMessage;
        }
    }

    validateOfficeLikeFileName(newItemName, officeLikeFileType) {
        switch (officeLikeFileType) {
            case officeLikeFileTypeInstn.docs:
            case officeLikeFileTypeInstn.sheets:
            case officeLikeFileTypeInstn.slides:
                let requiredExtension = officeFileLikeTypeExtensions[officeLikeFileType];
                this.validateOfficeLikeFileNameExtension(newItemName, requiredExtension);
                break;
            default:
                throw "Unknown office like file type id: " + officeLikeFileType;
        }
    }

    validateOfficeLikeFileNameExtension(newItemName, requiredExtension) {
        if (!newItemName.endsWith(requiredExtension)) {
            throw "Office file name \"" + newItemName + "\" should end with extension " + requiredExtension;
        }
    }
}

const driveExplorerApiInstn = new DriveExplorerApi();

trmrk.types["OfficeLikeFileType"] = OfficeLikeFileType;
trmrk.types["DriveExplorerApi"] = DriveExplorerApi;

export const officeLikeFileType = officeLikeFileTypeInstn;
export const driveExplorerApi = driveExplorerApiInstn;
