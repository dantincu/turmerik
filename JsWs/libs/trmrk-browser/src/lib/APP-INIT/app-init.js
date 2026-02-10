import { createTrmrk, } from "../../trmrk/TRMRK-GLOBAL-OBJECT/trmrk-global-object-core";
import { DarkModeService, } from "../domUtils/DarkModeService";
export const initApp = (appName, createGlobalTrmrkObj, dbObjNamePrefix, darkModeArgs) => {
    const trmrk = createTrmrk(appName, createGlobalTrmrkObj, dbObjNamePrefix);
    trmrk.darkModeService = new DarkModeService();
    trmrk.darkModeService.init(darkModeArgs);
};
