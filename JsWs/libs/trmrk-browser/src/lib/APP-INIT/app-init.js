import { createTrmrk, } from '../../trmrk/TRMRK-GLOBAL-OBJECT/trmrk-global-object-core';
import { DarkModeService } from '../domUtils/DarkModeService';
export const initApp = (appName, createGlobalTrmrkObj = false) => {
    const trmrk = createTrmrk(appName, createGlobalTrmrkObj);
    trmrk.darkModeService = new DarkModeService();
    trmrk.darkModeService.init();
};
