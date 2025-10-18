import { Injectable } from '@angular/core';

import { AppStateServiceBase } from './app-state-service-base';

@Injectable()
export abstract class ClientFetchTmStmpMillisServiceBase {
  constructor(public appStateService: AppStateServiceBase) {}

  init() {
    const clientFetchTmStmpMillis = this.getClientFetchTmStmpMillis();
    this.appStateService.clientFetchTmStmpMillis.next(clientFetchTmStmpMillis);
  }

  protected abstract getClientFetchTmStmpMillis(): number;
}
