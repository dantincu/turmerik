import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { NullOrUndef } from '../../../trmrk/core';

import { AppStateServiceBase } from '../../services/common/app-state-service-base';
import * as materialIcons from '../../assets/icons/material';

import { openDialog, DialogPanelSize } from '../../services/common/trmrk-dialog';
import { setIsDarkModeToLocalStorage } from '../../../trmrk-browser/domUtils/core';

export interface TrmrkAppSettingsServiceInitArgs {
  resetAppDialog: MatDialog;
  resetAppDialogComponent: any;
  deleteAppCacheDialog: MatDialog;
  deleteAppCacheComponent: any;
}

@Injectable({
  providedIn: 'root',
})
export class TrmrkAppSettingsService implements OnDestroy {
  isDarkMode;
  resetAltIcon: SafeHtml;

  showAppThemeOption: boolean | NullOrUndef;

  private darkModeStateChangeSubscription: Subscription;
  private resetAppDialog!: MatDialog;
  private resetAppDialogComponent: any;
  private deleteAppCacheDialog!: MatDialog;
  private deleteAppCacheDialogComponent: any;

  constructor(private appStateService: AppStateServiceBase, private sanitizer: DomSanitizer) {
    this.onDarkModeBtnClick = this.onDarkModeBtnClick.bind(this);
    this.darkModeStateChange = this.darkModeStateChange.bind(this);

    this.darkModeStateChangeSubscription = appStateService.isDarkMode.subscribe(
      this.darkModeStateChange
    );

    this.isDarkMode = this.appStateService.isDarkMode.value;

    this.resetAltIcon = this.sanitizer.bypassSecurityTrustHtml(materialIcons.reset_alt);
  }

  ngOnDestroy(): void {
    this.darkModeStateChangeSubscription.unsubscribe();
    this.resetAppDialog = null!;
    this.resetAppDialogComponent = null!;
  }

  init(args: TrmrkAppSettingsServiceInitArgs) {
    this.resetAppDialog = args.resetAppDialog;
    this.resetAppDialogComponent = args.resetAppDialogComponent;
    this.deleteAppCacheDialog = args.deleteAppCacheDialog;
    this.deleteAppCacheDialogComponent = args.deleteAppCacheComponent;
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

  resetAppClick(event: MouseEvent) {
    openDialog({
      matDialog: this.resetAppDialog,
      dialogComponent: this.resetAppDialogComponent,
      data: {
        disableClose: true,
        data: {},
      },
      clickEvent: event,
      dialogPanelSize: DialogPanelSize.Default,
    });
  }

  deleteAppCacheClick(event: MouseEvent) {
    openDialog({
      matDialog: this.deleteAppCacheDialog,
      dialogComponent: this.deleteAppCacheDialogComponent,
      data: {
        disableClose: true,
        data: {},
      },
      clickEvent: event,
      dialogPanelSize: DialogPanelSize.Default,
    });
  }
}
