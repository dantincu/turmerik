import {
  TrmrkGlobalObjectCore,
  createTrmrk,
} from "../../trmrk/TRMRK-GLOBAL-OBJECT/trmrk-global-object-core";

import {
  DarkModeService,
  DarkModeServiceInitArgs,
} from "../domUtils/DarkModeService";

export interface TrmrkGlobalObject extends TrmrkGlobalObjectCore {
  darkModeService: DarkModeService;
}

export const initApp = (
  appName: string,
  createGlobalTrmrkObj?: boolean | null | undefined,
  dbObjNamePrefix?: string | null | undefined,
  darkModeArgs?: DarkModeServiceInitArgs | null | undefined,
) => {
  const trmrk = createTrmrk<TrmrkGlobalObject>(
    appName,
    createGlobalTrmrkObj,
    dbObjNamePrefix,
  );

  trmrk.darkModeService = new DarkModeService();
  trmrk.darkModeService.init(darkModeArgs);
};
