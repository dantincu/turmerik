import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { appThemeCssClasses, isDarkMode } from '../../../trmrk-browser/domUtils/core';

import { jsonBool } from '../../../trmrk/core';

import { AppStateServiceBase } from './app-state-service-base';

@Injectable({
  providedIn: 'root',
})
export class DarkModeService {
  private darkModeStateChangeSubscription: Subscription;
  private revertDarkModeToDefaultSubscription: Subscription;

  constructor(public appStateService: AppStateServiceBase) {
    this.darkModeStateChange = this.darkModeStateChange.bind(this);

    this.darkModeStateChangeSubscription = appStateService.isDarkMode.subscribe(
      this.darkModeStateChange
    );

    this.revertDarkModeToDefaultSubscription = appStateService.revertDarkModeToDefault.subscribe(
      () => {
        const isDarkModeValue = isDarkMode(this.appStateService.appThemeIsDarkModeLocalStorageKey);
        this.darkModeStateChange(isDarkModeValue);
        appStateService.isDarkMode.next(isDarkModeValue);
      }
    );

    this.storageEvent = this.storageEvent.bind(this);
    window.addEventListener('storage', this.storageEvent);
  }

  storageEvent(event: StorageEvent) {
    if (
      (event.key ?? null) === null ||
      event.key === this.appStateService.appThemeIsDarkModeLocalStorageKey
    ) {
      let isDarkModeValue = false;

      if (
        (event.key ?? null) === null ||
        (event.key === this.appStateService.appThemeIsDarkModeLocalStorageKey &&
          (event.newValue ?? null) === null)
      ) {
        isDarkModeValue = isDarkMode(this.appStateService.appThemeIsDarkModeLocalStorageKey);
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
      isDarkModeValue ? appThemeCssClasses.light : appThemeCssClasses.dark
    );

    document.body.classList.add(
      isDarkModeValue ? appThemeCssClasses.dark : appThemeCssClasses.light
    );
  }

  ngOnDestroy(): void {
    this.darkModeStateChangeSubscription.unsubscribe();
    this.revertDarkModeToDefaultSubscription.unsubscribe();
    window.removeEventListener('storage', this.storageEvent);
  }

  init() {
    this.appStateService.revertDarkModeToDefault.emit();
  }
}
