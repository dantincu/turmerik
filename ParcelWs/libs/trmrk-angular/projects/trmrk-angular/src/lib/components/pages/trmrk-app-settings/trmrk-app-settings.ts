import { Component, ViewEncapsulation, Inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { injectionTokens } from '../../../services/dependency-injection/injection-tokens';
import { AppConfigCore } from '../../../services/common/app-config';
import { TrmrkObservable } from '../../../services/common/TrmrkObservable';

import { TrmrkAppPage } from '../../common/trmrk-app-page/trmrk-app-page';

import { TrmrkResetAppDialog } from './trmrk-reset-app-dialog/trmrk-reset-app-dialog';
import { TrmrkDeleteAppCacheDialog } from './trmrk-delete-app-cache-dialog/trmrk-delete-app-cache-dialog';
import { TrmrkAppSettingsService } from '../../../services/pages/trmrk-app-settings-service';

export type TrmrkAppSettingsTsType = TrmrkAppSettings;

@Component({
  selector: 'trmrk-app-settings',
  imports: [MatCheckbox, RouterLink, MatIconModule, MatButtonModule, MatDialogModule, TrmrkAppPage],
  templateUrl: './trmrk-app-settings.html',
  styleUrl: './trmrk-app-settings.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkAppSettings {
  constructor(
    @Inject(injectionTokens.appConfig.token) public appConfig: TrmrkObservable<AppConfigCore>,
    public trmrkAppSettingsService: TrmrkAppSettingsService,
    private resetAppDialog: MatDialog,
    private deleteAppCacheDialog: MatDialog
  ) {
    trmrkAppSettingsService.init({
      resetAppDialog,
      resetAppDialogComponent: TrmrkResetAppDialog,
      deleteAppCacheDialog,
      deleteAppCacheComponent: TrmrkDeleteAppCacheDialog,
    });
  }
}
