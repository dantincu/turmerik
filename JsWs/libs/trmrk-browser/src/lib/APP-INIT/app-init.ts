import {
  TrmrkGlobalObjectCore,
  createTrmrk,
} from '../../trmrk/TRMRK-GLOBAL-OBJECT/trmrk-global-object-core';

import { DarkModeService } from '../domUtils/DarkModeService';

export interface TrmrkGlobalObject extends TrmrkGlobalObjectCore {
  darkModeService: DarkModeService;
}

export const initApp = (appName: string, createGlobalTrmrkObj = false) => {
  const trmrk = createTrmrk<TrmrkGlobalObject>(appName, createGlobalTrmrkObj);
  trmrk.darkModeService = new DarkModeService();
  trmrk.darkModeService.init();
};
