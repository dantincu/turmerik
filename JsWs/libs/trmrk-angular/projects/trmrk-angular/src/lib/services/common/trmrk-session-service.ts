import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';
import {
  dbRequestToPromise,
  openDbRequestToPromise,
  ActiveDataItemCore,
} from '../../../trmrk-browser/indexedDB/core';
import { DbStoreAdapter } from '../../../trmrk-browser/indexedDB/DbAdapterBase';
import { AppSession, AppSessionTab } from '../../../trmrk-browser/indexedDB/databases/AppSessions';
import { transformUrl, getRelUri } from '../../../trmrk/url';

import { IndexedDbDatabasesServiceCore } from './indexedDb/indexed-db-databases-service-core';
import { TrmrkObservable } from './TrmrkObservable';
import { TimeStampGeneratorBase } from './timestamp-generator-base';
import { TrmrkStrIdGeneratorBase } from './trmrk-str-id-generator-base';

export const urlQueryKeys = mapPropNamesToThemselves(
  {
    browserTabId: '',
    tabId: '',
    sessionId: '',
    userIdnf: '',
    strgOptKey: '',
    mailOptKey: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);

interface AssureIsSetArgs<T extends ActiveDataItemCore> {
  requestTab: boolean;
  idParamsKey: string;
  obs: TrmrkObservable<T>;
  dbStore: () => DbStoreAdapter;
  valueBuilder: (value: T, id: string) => void;
}

@Injectable({
  providedIn: 'root',
})
export class TrmrkSessionService implements OnDestroy {
  public currentSession = new TrmrkObservable<AppSession>(null!);
  public currentTab = new TrmrkObservable<AppSessionTab>(null!);

  private queryingDb = false;

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore,
    private strIdGenerator: TrmrkStrIdGeneratorBase,
    private timeStampGenerator: TimeStampGeneratorBase,
    private router: Router
  ) {}

  ngOnDestroy(): void {}

  assureSessionIsSet() {
    return this.assureIsSet<AppSession>({
      requestTab: false,
      idParamsKey: urlQueryKeys.sessionId,
      obs: this.currentSession,
      dbStore: () => this.indexedDbDatabasesService.appSessions.value.stores.appSessions,
      valueBuilder: (value, id) => {
        value.sessionId = id;
      },
    });
  }

  assureSessionTabIsSet() {
    return this.assureIsSet<AppSessionTab>({
      requestTab: true,
      idParamsKey: urlQueryKeys.tabId,
      obs: this.currentTab,
      dbStore: () => this.indexedDbDatabasesService.appSessions.value.stores.appSessionTabs,
      valueBuilder: (value, id) => {
        value.tabId = id;
        value.sessionId = this.currentSession.value!.sessionId;
      },
    });
  }

  async assureIsSet<T extends ActiveDataItemCore>(args: AssureIsSetArgs<T>) {
    if (!this.currentSession.value) {
      if (args.requestTab) {
        throw new Error('The session has to be set before setting the tab');
      } else {
        this.onQueryingDb();
      }
    } else {
      if (!args.requestTab) {
        return this.currentSession.value as unknown as T;
      } else {
        if (this.currentTab.value) {
          return this.currentTab.value as unknown as T;
        } else {
          this.onQueryingDb();
        }
      }
    }

    let retVal: T;
    const params = new URLSearchParams(document.location.search);
    let id = params.get(args.idParamsKey);
    const urlQueryIdIsSet = (id ?? null) !== null;

    const onSuccess = (value: T) => {
      retVal = value;
      args.obs.next(retVal);
      this.queryingDb = false;
    };

    const response = await openDbRequestToPromise(
      this.indexedDbDatabasesService.appSessions.value.open()
    );

    const store = args.dbStore().store(response.value, null, 'readwrite');

    if (urlQueryIdIsSet) {
      let value = (await dbRequestToPromise(store.get(id!))).value as T;

      if (value) {
        onSuccess(value);
      } else {
        value = { createdAtMillis: this.timeStampGenerator.millis() } as T;
        args.valueBuilder(value, id!);
        await dbRequestToPromise(store.put(value));
        onSuccess(value);
      }
    } else {
      let value = { createdAtMillis: this.timeStampGenerator.millis() } as T;
      args.valueBuilder(value, (id = this.strIdGenerator.newId()));
      await dbRequestToPromise(store.put(value));

      const url = transformUrl(getRelUri(document.location.href), {
        queryParamsTransformer: (params) => {
          params.set(args.idParamsKey, id!);
          return params;
        },
      });

      this.router.navigateByUrl(url);
      onSuccess(value);
    }

    return retVal!;
  }

  onQueryingDb() {
    if (this.queryingDb) {
      throw new Error('Query params changed too quickly');
    } else {
      this.queryingDb = true;
    }
  }
}
