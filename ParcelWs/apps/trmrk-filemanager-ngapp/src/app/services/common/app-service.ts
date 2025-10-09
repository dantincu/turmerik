import { Injectable, Inject } from '@angular/core';

import { AppStateServiceBase } from '../../../trmrk-angular/services/common/app-state-service-base';
import { DarkModeService } from '../../../trmrk-angular/services/common/dark-mode-service';
import { AppServiceBase } from '../../../trmrk-angular/services/common/app-service-base';
import { injectionTokens } from '../../../trmrk-angular/services/dependency-injection/injection-tokens';

import { AppStateService } from './app-state-service';
import { AppConfig } from './app-config';
import { AppDriveStorageOption } from './driveStorageOption';

@Injectable()
export class AppService extends AppServiceBase {
  currentDriveStorageOption: AppDriveStorageOption | null = null;

  constructor(
    @Inject(injectionTokens.appConfig.token) appConfig: AppConfig,
    @Inject(AppStateServiceBase) appStateService: AppStateService,
    darkModeService: DarkModeService
  ) {
    super(appConfig, appStateService, darkModeService);
  }
}
