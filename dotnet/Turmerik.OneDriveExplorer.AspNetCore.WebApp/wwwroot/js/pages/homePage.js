import { trmrk, webStorage } from '../common/main.js';
import { domUtils } from '../common/domUtils.js';
import { DriveItem, AppSettings } from './Entities.js';

export class HomePage {
    username = null;
    appSettings = new AppSettings();

    driveItemNameMacros = null;
    driveItemMacros = null;

    async init(
        username,
        appSettings,
        driveItemNameMacros,
        driveItemMacros) {
        this.username = username;
        this.appSettings = new AppSettings(appSettings);

        this.driveItemNameMacros = driveItemNameMacros;
        this.driveItemMacros = driveItemMacros;
    }
}

const homePageInstn = new HomePage();
trmrk.homePage = homePageInstn;

export const homePage = homePageInstn;
domUtils.onDomContentLoaded();