import { trmrk, webStorage } from '../common/main.js';
import { DriveItem, AppSettings } from './Entities.js';
import { TrmrkActionResult } from '../common/ViewModelBase.js';
import { driveExplorerApi } from './driveExplorerApi.js';

export class DriveFolderApiResultWrapper {
    id = null;
    data = new DriveItem();
    apiResult = new TrmrkActionResult();
}

export class DriveExplorer {
    username = null;
    appSettings = new AppSettings();
    
    currentDriveFolder = new DriveFolderApiResultWrapper();

    async init(username, appSettings) {
        this.username = username;
        this.appSettings = new AppSettings(appSettings);
        driveExplorerApi.appSettings = this.appSettings;

        webStorage.cacheKeyBasePrefix = this.appSettings.CacheKeyBasePrefix;
        let folderId = trmrk.core.urlQuery.get(this.appSettings.DriveFolderIdUrlQueryKey);

        await this.getCurrentDriveFolderAsync(folderId);
    }

    async getCurrentDriveFolderAsync(folderId) {
        let folder = this.currentDriveFolder;
        folder.id = folderId;

        folder.apiResult = await driveExplorerApi.getDriveItemAsync(folderId);

        if (folder.apiResult.IsSuccess) {
            this.renderCurrentDriveFolder(folder.apiResult.Data);
        } else {
            this.renderCurrentDriveFolderError(folder.apiResult.ErrorViewModel);
        }
    }

    renderCurrentDriveFolder(driveFolder) {

    }

    renderCurrentDriveFolderError(errorViewModel) {

    }
}

const driveExplorerInstn = new DriveExplorer();

trmrk.driveExplorer = driveExplorerInstn;
export const driveExplorer = driveExplorerInstn;
