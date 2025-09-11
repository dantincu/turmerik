import { Injectable, Inject } from '@angular/core';

import { AppStateServiceBase, AppServiceBase } from 'trmrk-angular';

import { AppStateService } from '../services/app-state-service';

@Injectable({
  providedIn: 'root',
})
export class AppService extends AppServiceBase {
  constructor(@Inject(AppStateServiceBase) appStateService: AppStateService) {
    super(appStateService);
  }
}
