import { Injectable, Inject } from '@angular/core';

import {
  ToggleAppBarServiceBase,
  AppBarMapService,
  AppStateServiceBase,
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
