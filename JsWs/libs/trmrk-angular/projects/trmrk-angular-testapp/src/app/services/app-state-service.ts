import { Injectable, Inject } from '@angular/core';

import { services, AppConfigCore } from 'trmrk-angular';

const AppStateServiceBase = services.common.AppStateServiceBase;
const injectionTokens = services.dependencyInjection.injectionTokens;
const TrmrkObservable = services.common.TrmrkObservable;

@Injectable()
export class AppStateService extends AppStateServiceBase {
  constructor(
    @Inject(injectionTokens.appConfig.token)
    appConfig: typeof TrmrkObservable<AppConfigCore>
  ) {
    super(appConfig as any);
  }
}
