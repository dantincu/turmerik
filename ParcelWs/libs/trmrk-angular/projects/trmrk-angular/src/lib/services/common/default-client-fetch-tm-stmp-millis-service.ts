import { Injectable } from '@angular/core';

import { AppStateServiceBase } from './app-state-service-base';
import { ClientFetchTmStmpMillisServiceBase } from './client-fetch-tm-stmp-millis-service-base';
import { TimeStampGeneratorBase } from './timestamp-generator-base';

@Injectable({
  providedIn: 'root',
})
export class DefaultClientFetchTmStmpMillisService extends ClientFetchTmStmpMillisServiceBase {
  constructor(
    appStateService: AppStateServiceBase,
    private timeStampGenerator: TimeStampGeneratorBase
  ) {
    super(appStateService);
  }

  protected override getClientFetchTmStmpMillis(): number {
    const clientFetchTmStmpMillis = this.timeStampGenerator.millis();
    return clientFetchTmStmpMillis;
  }
}
