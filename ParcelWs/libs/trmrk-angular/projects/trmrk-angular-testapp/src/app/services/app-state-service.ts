import { Injectable } from '@angular/core';

import { services } from 'trmrk-angular';

const AppStateServiceBase = services.common.AppStateServiceBase;

import { APP_NAME } from './core';

@Injectable()
export class AppStateService extends AppStateServiceBase {
  constructor() {
    super(APP_NAME);
  }
}
