import { createTrmrk, } from '../../trmrk/TRMRK-GLOBAL-OBJECT/trmrk-global-object-core';
import { DarkModeService } from '../domUtils/DarkModeService';
export const initApp = (appName) => {
    const trmrk = createTrmrk(appName);
    trmrk.darkModeService = new DarkModeService();
    trmrk.darkModeService.init();
};
