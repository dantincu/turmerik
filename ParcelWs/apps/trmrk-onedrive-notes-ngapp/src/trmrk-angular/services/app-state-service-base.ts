import { Injectable } from '@angular/core';

import { getDbObjName } from '../../trmrk-browser/indexedDB/core';
import { localStorageKeys } from '../../trmrk-browser/domUtils/core';

import { TrmrkObservable } from './TrmrkObservable';

@Injectable()
export abstract class AppStateServiceBase {
  isDarkMode = new TrmrkObservable<boolean>(false);
  showAppBar = new TrmrkObservable<boolean>(true);

  dbObjNamePrefix: string;
  appThemeIsDarkModeLocalStorageKey: string;

  constructor(public appName: string) {
    this.dbObjNamePrefix = getDbObjName([appName]);

    this.appThemeIsDarkModeLocalStorageKey = getDbObjName([
      appName,
      localStorageKeys.appThemeIsDarkMode,
    ]);
  }
}
