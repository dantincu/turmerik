import { Injectable, Inject } from '@angular/core';

import { AppStateServiceBase } from '../../trmrk-angular/services/common/app-state-service-base';
import { AppServiceBase } from '../../trmrk-angular/services/common/app-service-base';
import { TrmrkAppSettingsService } from '../../trmrk-angular/services/pages/trmrk-app-settings-service';
import { TrmrkAppThemesService } from '../../trmrk-angular/services/pages/trmrk-app-themes-service';
import { TrmrkEditAppThemeDialogService } from '../../trmrk-angular/services/pages/trmrk-edit-app-theme-dialog-service';
import { TrmrkResetAppService } from '../../trmrk-angular/services/pages/reset-app-service/trmrk-reset-app-service';
import { injectionTokens } from '../../trmrk-angular/services/dependency-injection/injection-tokens';

import { AppStateService } from '../services/app-state-service';
import { AppConfig } from '../services/app-config';

@Injectable()
export class AppService extends AppServiceBase {
  constructor(
    @Inject(injectionTokens.appConfig.token) appConfig: AppConfig,
    @Inject(AppStateServiceBase) appStateService: AppStateService,
    private trmrkAppSettingsService: TrmrkAppSettingsService,
    private trmrkAppThemesService: TrmrkAppThemesService,
    private trmrkEditAppThemeDialogService: TrmrkEditAppThemeDialogService,
    private trmrkResetAppService: TrmrkResetAppService
  ) {
    super(appConfig, appStateService);
  }
}
