import { createTrmrk, } from "../../trmrk/TRMRK-GLOBAL-OBJECT/trmrk-global-object-core";
import { DarkModeService, } from "../domUtils/DarkModeService";
export const initApp = (appName, dbObjAppName, createGlobalTrmrkObj, darkModeArgs) => {
    const trmrk = createTrmrk(appName, dbObjAppName, createGlobalTrmrkObj);
    trmrk.darkModeService = new DarkModeService();
    trmrk.darkModeService.init(darkModeArgs);
};
