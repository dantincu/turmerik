import { Injectable } from '@angular/core';
import { AppStateServiceBase } from './app-state-service-base';

@Injectable()
export class AppServiceBase {
  constructor(public appStateService: AppStateServiceBase) {}
}
