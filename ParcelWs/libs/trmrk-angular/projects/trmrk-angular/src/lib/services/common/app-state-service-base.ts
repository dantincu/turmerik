import { Injectable } from '@angular/core';

import { getDbObjName } from '../../../trmrk-browser/indexedDB/core';
import { commonDbNamePrefixes } from '../../../trmrk-browser/indexedDB/DbAdapterBase';
import { localStorageKeys } from '../../../trmrk-browser/domUtils/core';

import { TrmrkObservable } from './TrmrkObservable';

export interface AppBarControlsVisibility {
  backBtn: boolean;
  goToParentBtn: boolean;
  optionsBtn: boolean;
}

export interface AppMainMenuControlsVisibility {
  homeBtn: boolean;
  refreshBtn: boolean;
  manageTabsBtn: boolean;
  duplicateTabBtn: boolean;
  shareBtn: boolean;
  userProfileBtn: boolean;
  manageAppBtn: boolean;
  settingsBtn: boolean;
  helpBtn: boolean;
}

export interface AppControlsVisibility {
  appBar: AppBarControlsVisibility;
  mainMenuTopStrip: boolean;
  mainMenu: AppMainMenuControlsVisibility;
}

export interface AppDefaultValues {
  appResetTriggersSetup: boolean;
  show: AppControlsVisibility;
}

export const getAppDefaultValues = (): AppDefaultValues => ({
  appResetTriggersSetup: true,
  show: {
    appBar: {
      backBtn: true,
      goToParentBtn: false,
      optionsBtn: true,
    },
    mainMenuTopStrip: true,
    mainMenu: {
      homeBtn: true,
      refreshBtn: true,
      manageTabsBtn: true,
      duplicateTabBtn: true,
      shareBtn: true,
      userProfileBtn: true,
      manageAppBtn: true,
      settingsBtn: true,
      helpBtn: true,
    },
  },
});

@Injectable()
export abstract class AppStateServiceBase {
  isDarkMode = new TrmrkObservable<boolean>(false);
  showAppBar = new TrmrkObservable<boolean>(true);
  currentModalId = new TrmrkObservable<number>(0);
  setupOk = new TrmrkObservable<boolean>(false);
  performingSetup = new TrmrkObservable<boolean>(false);
  appSuspended = new TrmrkObservable<boolean>(false);

  defaults = getAppDefaultValues();

  dbObjNamePrefix: string;
  cacheDbObjNamePrefix: string;
  appThemeIsDarkModeLocalStorageKey: string;

  constructor(public appName: string) {
    this.dbObjNamePrefix = getDbObjName([appName]);
    this.cacheDbObjNamePrefix = getDbObjName([appName, commonDbNamePrefixes.cache]);

    this.appThemeIsDarkModeLocalStorageKey = getDbObjName([
      appName,
      localStorageKeys.appThemeIsDarkMode,
    ]);
  }
}
