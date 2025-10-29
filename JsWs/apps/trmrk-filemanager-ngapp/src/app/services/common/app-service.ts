import { Injectable, Inject } from '@angular/core';

import { AppStateServiceBase } from '../../../trmrk-angular/services/common/app-state-service-base';
import { NgAppConfigCore } from '../../../trmrk-angular/services/common/app-config';
import { DarkModeService } from '../../../trmrk-angular/services/common/dark-mode-service';
import { AppServiceBase } from '../../../trmrk-angular/services/common/app-service-base';
import { TrmrkObservable } from '../../../trmrk-angular/services/common/TrmrkObservable';
import { injectionTokens } from '../../../trmrk-angular/services/dependency-injection/injection-tokens';

import { AppStateService } from './app-state-service';
import { AppConfig } from './app-config';
import { AppDriveStorageOption } from '../../../trmrk-filemanager-nglib/services/common/driveStorageOption';
import { StorageOptionServiceCore } from '../../../trmrk-filemanager-nglib/services/common/storage-option-service-core';

@Injectable()
export class AppService extends AppServiceBase {
  appStateSvc: AppStateService;

  constructor(
    @Inject(injectionTokens.appConfig.token) appConfig: TrmrkObservable<AppConfig>,
    @Inject(AppStateServiceBase) appStateService: AppStateService,
    darkModeService: DarkModeService,
    public storageOptionService: StorageOptionServiceCore
  ) {
    super(
      appConfig as unknown as TrmrkObservable<NgAppConfigCore>,
      appStateService,
      darkModeService
    );
    this.appStateSvc = appStateService;
  }
}
