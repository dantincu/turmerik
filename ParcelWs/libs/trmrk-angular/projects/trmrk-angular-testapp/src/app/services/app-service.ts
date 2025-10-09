import { Injectable, Inject } from '@angular/core';

import { services, AppConfigCore } from 'trmrk-angular';

import { AppStateService } from './app-state-service';

const AppStateServiceBase = services.common.AppStateServiceBase;
const AppServiceBase = services.common.AppServiceBase;
const DarkModeService = services.common.DarkModeService;
const injectionTokens = services.dependencyInjection.injectionTokens;

@Injectable({
  providedIn: 'root',
})
export class AppService extends AppServiceBase {
  constructor(
    @Inject(injectionTokens.appConfig.token) appConfig: AppConfigCore,
    @Inject(AppStateServiceBase) appStateService: AppStateService,
    @Inject(DarkModeService) darkModeService: any
  ) {
    super(appConfig, appStateService, darkModeService);
  }
}
