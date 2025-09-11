import { Injectable, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppStateServiceBase } from 'trmrk-angular';

import {
  appThemeCssClasses,
  isDarkMode,
} from '../../trmrk-browser/domUtils/core';

import { jsonBool } from '../../trmrk/core';

import { AppStateService } from '../services/app-state-service';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private darkModeStateChangeSubscription: Subscription;

  constructor(
    @Inject(AppStateServiceBase) private appStateService: AppStateService
  ) {
    const isDarkModeValue = isDarkMode(
      this.appStateService.appThemeIsDarkModeLocalStorageKey
    );
    this.darkModeStateChange(isDarkModeValue);
    appStateService.isDarkMode.next(isDarkModeValue);
    this.darkModeStateChange = this.darkModeStateChange.bind(this);

    this.darkModeStateChangeSubscription =
      appStateService.isDarkMode.$obs.subscribe(this.darkModeStateChange);

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
        isDarkModeValue = isDarkMode(
          this.appStateService.appThemeIsDarkModeLocalStorageKey
        );
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
    window.removeEventListener('storage', this.storageEvent);
  }
}
