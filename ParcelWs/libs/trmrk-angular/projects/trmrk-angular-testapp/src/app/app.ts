import { Component, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  localStorageKeys,
  appThemeCssClasses,
  isDarkMode,
} from '../trmrk-browser/domUtils/core';

import { jsonBool } from '../trmrk/core';

import { AppStateService } from './services/appStateService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  protected title = 'trmrk-angular-testapp';
  private darkModeStateChangeSubscription: Subscription;

  constructor(private appStateService: AppStateService) {
    const isDarkModeValue = isDarkMode();
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
      event.key === localStorageKeys.appThemeIsDarkMode
    ) {
      let isDarkModeValue = false;

      if ((event.key ?? null) === null) {
        isDarkModeValue = isDarkMode();
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
