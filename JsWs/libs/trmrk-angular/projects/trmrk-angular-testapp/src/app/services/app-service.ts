import { Injectable, Inject } from '@angular/core';

import { services, AppConfigCore } from 'trmrk-angular';

import { AppStateService } from './app-state-service';

const AppStateServiceBase = services.common.AppStateServiceBase;
const AppServiceBase = services.common.AppServiceBase;
const DarkModeService = services.common.DarkModeService;
const TrmrkObservable = services.common.TrmrkObservable;
const injectionTokens = services.dependencyInjection.injectionTokens;

@Injectable({
  providedIn: 'root',
})
export class AppService extends AppServiceBase {
  constructor(
    @Inject(injectionTokens.appConfig.token)
    appConfig: typeof TrmrkObservable<AppConfigCore>,
    @Inject(AppStateServiceBase) appStateService: AppStateService,
    @Inject(DarkModeService) darkModeService: any
  ) {
    super(appConfig as any, appStateService, darkModeService);
  }
}
