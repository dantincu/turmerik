import { Trmrk as trmrk, WebStorage as webStorage } from '../main.js';

const driveExplorer = {
    username: "",
    setUsername: (username) => {
        driveExplorer.username = username;
    },
    driveItemCacheKeyName: "driveItem",
    getDriveItemCacheKey(id) {
        let cacheKey = trmrk.getCacheKey(
            driveExplorer.driveItemCacheKeyName,
            id,
            driveExplorer.username);

        return cacheKey;
    },
    getDriveItemJson: (id) => {
        let cacheKey = driveExplorer.getDriveItemCacheKey(id);
        let driveItemJson = sessionStorage.getItem(cacheKey);

        if (typeof (driveItemJson) !== "string") {
            driveItemJson = localStorage.getItem(cacheKey);
        }

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
        localStorage.setItem(cacheKey, driveItemJson);
    }
};

trmrk.driveExplorer = driveExplorer;
export const DriveExplorer = driveExplorer;
