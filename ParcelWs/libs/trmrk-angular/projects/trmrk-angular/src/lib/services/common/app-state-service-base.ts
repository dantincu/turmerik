import { Injectable, OnDestroy, EventEmitter } from '@angular/core';

import { getDbObjName } from '../../../trmrk-browser/indexedDB/core';
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
export abstract class AppStateServiceBase implements OnDestroy {
  isDarkMode = new TrmrkObservable<boolean>(false);
  revertDarkModeToDefault = new EventEmitter<void>();
  showAppBar = new TrmrkObservable<boolean>(true);
  currentModalId = new TrmrkObservable<number>(0);
  setupOk = new TrmrkObservable<boolean>(false);
  performingSetup = new TrmrkObservable<boolean>(false);
  appSuspended = new TrmrkObservable<boolean>(false);

  defaults = getAppDefaultValues();

  dbObjNamePrefix: string;
  appThemeIsDarkModeLocalStorageKey: string;

  constructor(public appName: string) {
    this.dbObjNamePrefix = getDbObjName([appName]);

    this.appThemeIsDarkModeLocalStorageKey = getDbObjName([
      appName,
      localStorageKeys.appThemeIsDarkMode,
    ]);
  }

  ngOnDestroy(): void {
    this.isDarkMode.unsubscribeAll();
    this.showAppBar.unsubscribeAll();
    this.revertDarkModeToDefault.unsubscribe();
  }
}
