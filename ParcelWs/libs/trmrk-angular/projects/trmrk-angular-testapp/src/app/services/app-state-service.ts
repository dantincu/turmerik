import { Injectable, Inject } from '@angular/core';

import { services, AppConfigCore } from 'trmrk-angular';

const AppStateServiceBase = services.common.AppStateServiceBase;
const injectionTokens = services.dependencyInjection.injectionTokens;

@Injectable()
export class AppStateService extends AppStateServiceBase {
  constructor(
    @Inject(injectionTokens.appConfig.token) appConfig: () => AppConfigCore
  ) {
    super(appConfig);
  }
}
