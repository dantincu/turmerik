import { Injectable, Inject } from '@angular/core';

import {
  AppBarMapService,
  AppStateServiceBase,
  ToggleAppBarServiceBase,
} from 'trmrk-angular';

import { AppStateService } from './app-state-service';

@Injectable()
export class ToggleAppBarService extends ToggleAppBarServiceBase<AppStateService> {
  constructor(
    @Inject(AppStateServiceBase) appStateService: AppStateService,
    appBarMapService: AppBarMapService
  ) {
    super(appStateService, appBarMapService);
  }
}
