import { Injectable } from '@angular/core';

import { AppSessionTab } from '../../../trmrk-browser/indexedDB/databases/AppSessions';
import { NullOrUndef } from '../../../trmrk/core';

import { IndexedDbDatabasesServiceCore } from './indexedDb/indexed-db-databases-service-core';
import { TrmrkSessionService, sessionUrlQueryKeys } from './trmrk-session-service';

@Injectable({
  providedIn: 'root',
})
export class TrmrkSessionTabsService {
  constructor(
    private sessionService: TrmrkSessionService,
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore
  ) {}

  async assureSessionTabIsSet(url?: string | NullOrUndef) {
    const retObj = await this.sessionService.assureIsSet<AppSessionTab>({
      url,
      requestTab: true,
      idParamsKey: sessionUrlQueryKeys.tabId,
      obs: this.sessionService.currentTab,
      dbStore: () => this.indexedDbDatabasesService.appSessions.value.stores.appSessionTabs,
      valueBuilder: (value, id) => {
        value.tabId = id;
        value.sessionId = this.sessionService.currentSession.value!.sessionId;
      },
    });

    return retObj;
  }
}
