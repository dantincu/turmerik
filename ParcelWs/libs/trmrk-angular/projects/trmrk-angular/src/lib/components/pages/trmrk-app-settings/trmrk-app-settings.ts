import { Component, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppConfigServiceBase } from '../../../services/app-config-service-base';

import { TrmrkAppPage } from '../../common/trmrk-app-page/trmrk-app-page';

import { TrmrkResetAppDialog } from './trmrk-reset-app-dialog/trmrk-reset-app-dialog';
import { TrmrkAppSettingsService } from '../../../services/pages/trmrk-app-settings-service';

@Component({
  selector: 'trmrk-app-settings',
  imports: [MatCheckbox, RouterLink, MatIconModule, MatButtonModule, MatDialogModule, TrmrkAppPage],
  templateUrl: './trmrk-app-settings.html',
  styleUrl: './trmrk-app-settings.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkAppSettings {
  constructor(
    public appConfigService: AppConfigServiceBase,
    public trmrkAppSettingsService: TrmrkAppSettingsService,
    private resetAppDialog: MatDialog
  ) {
    trmrkAppSettingsService.init({
      resetAppDialog,
      resetAppDialogComponent: TrmrkResetAppDialog,
    });
  }
}
