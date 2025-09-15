import { Injectable, Inject } from '@angular/core';

import { AppStateServiceBase } from '../../trmrk-angular/services/app-state-service-base';
import { AppServiceBase } from '../../trmrk-angular/services/app-service-base';
import { TrmrkAppSettingsService } from '../../trmrk-angular/services/pages/trmrk-app-settings-service';
import { TrmrkAppThemesService } from '../../trmrk-angular/services/pages/trmrk-app-themes-service';
import { TrmrkEditAppThemeDialogService } from '../../trmrk-angular/services/pages/trmrk-edit-app-theme-dialog-service';
import { TrmrkResetAppService } from '../../trmrk-angular/services/pages/reset-app-service/trmrk-reset-app-service';

import { AppStateService } from '../services/app-state-service';

@Injectable({
  providedIn: 'root',
})
export class AppService extends AppServiceBase {
  constructor(
    @Inject(AppStateServiceBase) appStateService: AppStateService,
    private trmrkAppSettingsService: TrmrkAppSettingsService,
    private trmrkAppThemesService: TrmrkAppThemesService,
    private trmrkEditAppThemeDialogService: TrmrkEditAppThemeDialogService,
    private trmrkResetAppService: TrmrkResetAppService
  ) {
    super(appStateService);
    // trmrkAppSettingsService.showAppThemeOption = true;
  }
}
