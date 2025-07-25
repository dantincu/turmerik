import { Injectable } from '@angular/core';

import { ToggleAppBarServiceBase, AppBarMapService } from 'trmrk-angular';

import { AppStateService } from './app-state-service';

@Injectable()
export class ToggleAppBarService extends ToggleAppBarServiceBase<AppStateService> {
  constructor(
    appStateService: AppStateService,
    appBarMapService: AppBarMapService
  ) {
    super(appStateService, appBarMapService);
  }
}
