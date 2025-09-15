import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NullOrUndef } from '../../../trmrk/core';

import { AppStateServiceBase } from '../../services/app-state-service-base';
import { materialIcons } from '../../assets/icons/material';

import { setIsDarkModeToLocalStorage } from '../../../trmrk-browser/domUtils/core';

@Injectable({
  providedIn: 'root',
})
export class TrmrkAppSettingsService implements OnDestroy {
  isDarkMode;
  resetAltIcon: SafeHtml;

  showAppThemeOption: boolean | NullOrUndef;

  private darkModeStateChangeSubscription: Subscription;

  constructor(private appStateService: AppStateServiceBase, private sanitizer: DomSanitizer) {
    this.onDarkModeBtnClick = this.onDarkModeBtnClick.bind(this);
    this.darkModeStateChange = this.darkModeStateChange.bind(this);

    this.darkModeStateChangeSubscription = appStateService.isDarkMode.$obs.subscribe(
      this.darkModeStateChange
    );

    this.isDarkMode = this.appStateService.isDarkMode.value;

    this.resetAltIcon = this.sanitizer.bypassSecurityTrustHtml(materialIcons.reset_alt);
  }

  ngOnDestroy(): void {
    this.darkModeStateChangeSubscription.unsubscribe();
  }

  onDarkModeBtnClick(event: MatCheckboxChange): void {
    setIsDarkModeToLocalStorage(
      !this.isDarkMode,
      this.appStateService.appThemeIsDarkModeLocalStorageKey
    );

    this.appStateService.isDarkMode.next(!this.isDarkMode);
  }

  darkModeStateChange(isDarkModeValue: boolean) {
    this.isDarkMode = isDarkModeValue;
  }
}
