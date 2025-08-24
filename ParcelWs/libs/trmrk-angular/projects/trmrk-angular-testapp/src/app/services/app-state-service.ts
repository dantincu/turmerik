import { Injectable } from '@angular/core';

import { AppStateServiceBase } from 'trmrk-angular';

import { APP_NAME } from './core';

@Injectable()
export class AppStateService extends AppStateServiceBase {
  constructor() {
    super(APP_NAME);
  }
}
