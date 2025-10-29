import { Injectable } from '@angular/core';

import { AppStateServiceBase } from './app-state-service-base';

@Injectable()
export abstract class TrmrkBrowserTabIdServiceBase {
  constructor(public appStateService: AppStateServiceBase) {}

  init() {
    const currentBrowserTabId = this.getCurrentBrowserTabId();
    this.appStateService.currentBrowserTabId.next(currentBrowserTabId);
  }

  protected abstract getCurrentBrowserTabId(): string;
}
