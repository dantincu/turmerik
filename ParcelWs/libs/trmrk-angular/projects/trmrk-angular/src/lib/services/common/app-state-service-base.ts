import { Injectable } from '@angular/core';

import { TrmrkObservable } from './TrmrkObservable';
import { NgAppConfigCore } from './app-config';

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
  hasBeenSetUp = new TrmrkObservable<boolean>(false);
  performAppSetup = new TrmrkObservable<boolean>(false);
  currentBrowserTabId = new TrmrkObservable<string>(null!);

  defaults = getAppDefaultValues();

  constructor(public appConfig: TrmrkObservable<NgAppConfigCore>) {}
}
