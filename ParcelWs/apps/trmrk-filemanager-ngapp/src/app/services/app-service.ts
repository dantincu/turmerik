import { Injectable, Inject } from '@angular/core';

import { AppStateServiceBase } from '../../trmrk-angular/services/app-state-service-base';
import { AppServiceBase } from '../../trmrk-angular/services/app-service-base';

import { AppStateService } from '../services/app-state-service';

@Injectable({
  providedIn: 'root',
})
export class AppService extends AppServiceBase {
  constructor(@Inject(AppStateServiceBase) appStateService: AppStateService) {
    super(appStateService);
  }
}
