import { Injectable } from '@angular/core';

import { AppStateServiceBase } from '../../../trmrk-angular/services/common/app-state-service-base';

import { APP_NAME } from './core';

@Injectable()
export class AppStateService extends AppStateServiceBase {
  constructor() {
    super(APP_NAME);
  }
}
