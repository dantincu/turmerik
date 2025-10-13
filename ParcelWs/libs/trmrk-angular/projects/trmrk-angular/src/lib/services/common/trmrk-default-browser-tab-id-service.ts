import { Injectable, Inject } from '@angular/core';

import { localStorageKeys } from '../../../trmrk-browser/domUtils/core';
import { getDbObjName } from '../../../trmrk-browser/indexedDB/core';

import { AppStateServiceBase } from './app-state-service-base';
import { TrmrkStrIdGeneratorBase } from './trmrk-str-id-generator-base';
import { TrmrkBrowserTabIdServiceBase } from './trmrk-browser-tab-id-service-base';
import { injectionTokens } from '../dependency-injection/injection-tokens';

@Injectable({
  providedIn: 'root',
})
export class TrmrkDefaultBrowserTabIdService extends TrmrkBrowserTabIdServiceBase {
  constructor(
    appStateService: AppStateServiceBase,
    @Inject(injectionTokens.appName.token) private appName: string,
    private strIdGenerator: TrmrkStrIdGeneratorBase
  ) {
    super(appStateService);
  }

  protected getCurrentBrowserTabId(): string {
    const currentBrowserTabIdSessionStorageKey = getDbObjName([
      this.appName,
      localStorageKeys.currentBrowserTabId,
    ]);

    let currentBrowserTabId: string = sessionStorage.getItem(currentBrowserTabIdSessionStorageKey)!;

    if ((currentBrowserTabId ?? null) === null) {
      currentBrowserTabId = this.strIdGenerator.newId();
      sessionStorage.setItem(currentBrowserTabIdSessionStorageKey, currentBrowserTabId);
    }

    return currentBrowserTabId;
  }
}
