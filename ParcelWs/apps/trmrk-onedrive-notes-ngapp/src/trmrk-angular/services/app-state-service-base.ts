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

  showBackBtnByDefault = true;
  showGoToParentBtnByDefault = true;
  showOptionsMenuBtnByDefault = true;
  showMainMenuTopStripByDefault = true;
  showRefreshMainMenuBtnByDefault = true;
  showUserProfileMainMenuBtnByDefault = true;
  showManageAppMainMenuBtnByDefault = true;
  showSettingsMainMenuBtnByDefault = true;
  showHelpMainMenuBtnByDefault = true;

  constructor(public appName: string) {
    this.dbObjNamePrefix = getDbObjName([appName]);

    this.appThemeIsDarkModeLocalStorageKey = getDbObjName([
      appName,
      localStorageKeys.appThemeIsDarkMode,
    ]);
  }
}
