import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { setIsDarkModeToLocalStorage } from '../../trmrk-browser/domUtils/core';

import { materialIcons, TrmrkAppPage } from 'trmrk-angular';
import { AppStateService } from '../services/app-state-service';

@Component({
  selector: 'trmrk-app-settings',
  imports: [
    MatCheckbox,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    TrmrkAppPage,
  ],
  templateUrl: './trmrk-app-settings.html',
  styleUrl: './trmrk-app-settings.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkAppSettings implements OnDestroy {
  private darkModeStateChangeSubscription: Subscription;

  isDarkMode;

  resetAltIcon: SafeHtml;

  constructor(
    private appStateService: AppStateService,
    private sanitizer: DomSanitizer
  ) {
    this.onDarkModeBtnClick = this.onDarkModeBtnClick.bind(this);
    this.darkModeStateChange = this.darkModeStateChange.bind(this);
    this.titleContextMenu = this.titleContextMenu.bind(this);

    this.darkModeStateChangeSubscription =
      appStateService.isDarkMode.$obs.subscribe(this.darkModeStateChange);

    this.isDarkMode = this.appStateService.isDarkMode.value;

    this.resetAltIcon = this.sanitizer.bypassSecurityTrustHtml(
      materialIcons.reset_alt
    );
  }

  ngOnDestroy(): void {
    this.darkModeStateChangeSubscription.unsubscribe();
  }

  onDarkModeBtnClick(event: MatCheckboxChange): void {
    setIsDarkModeToLocalStorage(!this.isDarkMode);
    this.appStateService.isDarkMode.next(!this.isDarkMode);
  }

  darkModeStateChange(isDarkModeValue: boolean) {
    this.isDarkMode = isDarkModeValue;
  }

  titleContextMenu(event: MouseEvent) {
    event.preventDefault();
  }
}
