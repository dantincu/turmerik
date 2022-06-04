import { Trmrk as trmrk, WebStorage as webStorage } from '../common/main.js';
import { DriveItem } from './DriveItem.js';

const driveExplorer = {
    username: "",
    urlQuery: null,
    appSettings: null,
    init: (username, appSettings) => {
        driveExplorer.username = username;
        driveExplorer.appSettings = appSettings;
    },
    getCacheKey: (keyName, id, username) => {
        if (typeof (username) === "string" && username.length > 0) {
            username = username + "|";
        }

        let cacheKey = trmrk.cacheKeyBasePrefix + "|" + username + keyName + "|" + id;
        return cacheKey;
    },
    driveFolderCacheKeyName: "driveFolder",
    rootDriveFolderCacheKeyName: "rootDriveFolder",
    getDriveItemCacheKey(id) {
        let cacheKey = driveExplorer.getCacheKey(
            driveExplorer.driveFolderCacheKeyName,
            id,
            driveExplorer.username);

        return cacheKey;
    },
    getDriveItemJson: (id) => {
        let cacheKey = driveExplorer.getDriveItemCacheKey(id);
        let driveItemJson = sessionStorage.getItem(cacheKey);

        return driveItemJson;
    },
    getDriveItem: (id) => {
        let driveItemJson = driveExplorer.getDriveItemJson(id);
        let driveItem = JSON.parse(driveItemJson);

        return driveItem;
    },
    setDriveItem: (driveItem, id) => {
        let cacheKey = driveExplorer.getDriveItemCacheKey(id);
        let driveItemJson = driveItem;

        if (typeof (driveItemJson) !== "string") {
            driveItemJson = JSON.stringify(driveItem);
        }

        sessionStorage.setItem(cacheKey, driveItemJson);
    }
};

trmrk.driveExplorer = driveExplorer;
export const DriveExplorer = driveExplorer;
