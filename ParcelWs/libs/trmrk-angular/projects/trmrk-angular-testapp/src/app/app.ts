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

    window.addEventListener('storage', (event) => {
      console.log('Storage event:', event);
      if (event.key === localStorageKeys.appThemeIsDarkMode) {
        this.darkModeLocalStorageValueChanged(event.newValue === jsonBool.true);
      }
    });
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
  }
}
