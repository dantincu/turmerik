import { Injectable, Inject } from '@angular/core';

import { AppStateServiceBase } from '../../../trmrk-angular/services/common/app-state-service-base';
import { TrmrkObservable } from '../../../trmrk-angular/services/common/TrmrkObservable';
import { injectionTokens } from '../../../trmrk-angular/services/dependency-injection/injection-tokens';

import { AppConfig } from './app-config';

@Injectable()
export class AppStateService extends AppStateServiceBase {
  appSetupModalErrorMsg = new TrmrkObservable<string | null>(null);

  constructor(@Inject(injectionTokens.appConfig.token) public appCfg: () => AppConfig) {
    super(appCfg);
  }
}
