import { Injectable, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { appThemeCssClasses, isDarkMode } from '../../../trmrk-browser/domUtils/core';
import { jsonBool } from '../../../trmrk/core';
import { getDbObjName } from '../../../trmrk-browser/indexedDB/core';
import { localStorageKeys } from '../../../trmrk-browser/domUtils/core';

import { AppStateServiceBase } from './app-state-service-base';
import { injectionTokens } from '../dependency-injection/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  public appThemeIsDarkModeLocalStorageKey: string;

  private darkModeStateChangeSubscription: Subscription;

  constructor(
    public appStateService: AppStateServiceBase,
    @Inject(injectionTokens.appName.token) private appName: string
  ) {
    this.appThemeIsDarkModeLocalStorageKey = getDbObjName([
      appName,
      localStorageKeys.appThemeIsDarkMode,
    ]);

    this.darkModeStateChange = this.darkModeStateChange.bind(this);

    this.darkModeStateChangeSubscription = appStateService.isDarkMode.subscribe(
      this.darkModeStateChange
    );

    this.storageEvent = this.storageEvent.bind(this);
    window.addEventListener('storage', this.storageEvent);
  }

  storageEvent(event: StorageEvent) {
    if ((event.key ?? null) === null || event.key === this.appThemeIsDarkModeLocalStorageKey) {
      let isDarkModeValue = false;

      if (
        (event.key ?? null) === null ||
        (event.key === this.appThemeIsDarkModeLocalStorageKey && (event.newValue ?? null) === null)
      ) {
        isDarkModeValue = isDarkMode(this.appThemeIsDarkModeLocalStorageKey);
      } else {
        isDarkModeValue = event.newValue === jsonBool.true;
      }

      this.darkModeLocalStorageValueChanged(isDarkModeValue);
    }
  }

  darkModeLocalStorageValueChanged(isDarkModeValue: boolean) {
    this.darkModeStateChange(isDarkModeValue);
    this.appStateService.isDarkMode.next(isDarkModeValue);
  }

  darkModeStateChange(isDarkModeValue: boolean) {
    document.body.classList.remove(
      isDarkModeValue ? appThemeCssClasses.trmrkAppThemeLight : appThemeCssClasses.trmrkAppThemeDark
    );

    document.body.classList.add(
      isDarkModeValue ? appThemeCssClasses.trmrkAppThemeDark : appThemeCssClasses.trmrkAppThemeLight
    );
  }

  revertDarkModeToDefault() {
    const isDarkModeValue = isDarkMode(this.appThemeIsDarkModeLocalStorageKey);
    this.darkModeStateChange(isDarkModeValue);
    this.appStateService.isDarkMode.next(isDarkModeValue);
  }

  ngOnDestroy(): void {
    this.darkModeStateChangeSubscription.unsubscribe();
    window.removeEventListener('storage', this.storageEvent);
  }

  init() {
    this.revertDarkModeToDefault();
  }
}
