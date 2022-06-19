import { trmrk, webStorage } from '../common/main.js';
import { ViewModelBase } from '../common/ViewModelBase.js';
import { DriveItem, AppSettings } from './Entities.js';
import { trmrkAxios, TrmrkAxiosApiResult } from '../common/trmrkAxios.js';
import { webStorageAxios } from '../common/webStorageAxios.js';

export class OfficeLikeFileType {
    Docs = 1;
    Sheets = 2;
    Slides = 3;
}

export class DriveItemOpEnum {
    CreateFile = 1;
    MoveFolder = 2;
    CopyFolder = 3;
    MoveFile = 4;
    CopyFile = 5;
    DeleteFile = 6;
    CreateMultipleFolders = 7;
    CreateMultipleFiles = 8;
    CreateFolderFromMacro = 9;
    CreateFileFromMacro = 10;
}

const driveItemOpEnumInstn = new DriveItemOpEnum();
const officeLikeFileTypeInstn = new OfficeLikeFileType();

export const officeFileLikeTypeExtensions = {};
officeFileLikeTypeExtensions[officeLikeFileTypeInstn.Docs] = ".docx";

officeFileLikeTypeExtensions[officeLikeFileTypeInstn.Sheets] = ".xlsx";
officeFileLikeTypeExtensions[officeLikeFileTypeInstn.Slides] = ".pptx";

export const driveItemNameInvalidChars = "\\/:*?\"<>|";

export class DriveExplorerApi {
    appSettings = new AppSettings();
    folderRelUri = 'api/driveFolder';
    fileRelUri = 'api/driveFile';

    getDriveFolderCacheKey(driveFolderId) {
        let cacheKey;
        
        if (trmrk.core.isNonEmptyString(driveFolderId)) {
            cacheKey = webStorage.getCacheKey(
                this.appSettings.DriveFolderCacheKeyName,
                driveFolderId, this.username);
        } else {
            cacheKey = webStorage.getCacheKey(
                this.appSettings.RootDriveFolderCacheKeyName,
                this.username);
        }

        return cacheKey;
    }

    async getDriveFolderAsync(driveFolderId, refreshCache) {
        let cacheKey = this.getDriveFolderCacheKey(driveFolderId);
        let relUrl = this.folderRelUri;

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
        let relUrl = this.folderRelUri + "/" + encodeURIComponent(driveFolderId);

        let params = {
            name: newFolderName,
            driveItemOp: driveItemOpEnumInstn.MoveFolder
        };

        let apiResult = await trmrkAxios.put(relUrl, params);
        return apiResult;
    }

    async addDriveFolderAsync(parentFolderId, newFolderName) {
        this.validateDriveItemIdAndNewName(parentFolderId, newFolderName);
        let relUrl = this.folderRelUri;

        let params = {
            parentFolderId: parentFolderId,
            name: newFolderName
        };

        let apiResult = await trmrkAxios.post(relUrl, params);
        return apiResult;
    }

    async removeDriveFolderAsync(driveFolderId) {
        this.validateDriveItemId(driveFolderId);
        let relUrl = this.folderRelUri + "/" + encodeURIComponent(driveFolderId);

        let apiResult = await trmrkAxios.delete(relUrl);
        return apiResult;
    }

    async updateDriveFileNameAsync(driveFileId, newFileName, officeLikeFileType) {
        this.validateDriveItemIdAndNewName(driveFileId, newFileName, officeLikeFileType);
        let relUrl = this.fileRelUri + "/" + encodeURIComponent(driveFileId);

        let params = {
            name: newFolderName
        };

        let apiResult = await trmrkAxios.put(relUrl, params);
        return apiResult;
    }

    async addDriveFileAsync(parentFolderId, newFileName, officeLikeFileType) {
        this.validateDriveItemIdAndNewName(parentFolderId, newFileName, officeLikeFileType);
        let relUrl = this.fileRelUri;

        let params = {
            parentFolderId: parentFolderId,
            name: newFileName
        }

        let apiResult = await trmrkAxios.post(relUrl, params);
        return apiResult;
    }

    async removeDriveFileAsync(driveFileId) {
        this.validateDriveItemId(driveFileId);
        let relUrl = this.fileRelUri + "/" + encodeURIComponent(driveFileId);

        let apiResult = await trmrkAxios.delete(relUrl);
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
            case officeLikeFileTypeInstn.Docs:
            case officeLikeFileTypeInstn.Sheets:
            case officeLikeFileTypeInstn.Slides:
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
trmrk.types["DriveItemOpEnum"] = DriveItemOpEnum;
trmrk.types["DriveExplorerApi"] = DriveExplorerApi;

export const officeLikeFileType = officeLikeFileTypeInstn;
export const driveItemOpEnum = driveItemOpEnumInstn;
export const driveExplorerApi = driveExplorerApiInstn;
