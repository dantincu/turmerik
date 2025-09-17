import { Injectable, Inject } from '@angular/core';

import { services } from 'trmrk-angular';

const AppStateServiceBase = services.common.AppStateServiceBase;

const AppServiceBase = services.common.AppServiceBase;

import { AppStateService } from '../services/app-state-service';

@Injectable({
  providedIn: 'root',
})
export class AppService extends AppServiceBase {
  constructor(@Inject(AppStateServiceBase) appStateService: AppStateService) {
    super(appStateService);
  }
}
