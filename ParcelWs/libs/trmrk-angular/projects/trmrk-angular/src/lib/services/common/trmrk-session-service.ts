import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { mapPropNamesToThemselves, PropNameWordsConvention } from '../../../trmrk/propNames';
import { dbRequestToPromise, openDbRequestToPromise } from '../../../trmrk-browser/indexedDB/core';
import { AppSession } from '../../../trmrk-browser/indexedDB/databases/AppSessions';
import { transformUrl, getRelUri } from '../../../trmrk/url';

import { IndexedDbDatabasesServiceCore } from './indexedDb/indexed-db-databases-service-core';
import { TrmrkObservable } from './TrmrkObservable';
import { TimeStampGenerator } from './timestamp-generator';
import { TrmrkStrIdGeneratorBase } from './trmrk-str-id-generator-base';

export const urlQueryKeys = mapPropNamesToThemselves(
  {
    tabId: '',
    sessionId: '',
    userIdnf: '',
    strgOptKey: '',
    mailOptKey: '',
  },
  PropNameWordsConvention.KebabCase,
  PropNameWordsConvention.CamelCase
);

@Injectable({
  providedIn: 'root',
})
export class TrmrkSessionService implements OnDestroy {
  public currentSession = new TrmrkObservable<AppSession>(null!);

  private queryingDb = false;

  constructor(
    private indexedDbDatabasesService: IndexedDbDatabasesServiceCore,
    private strIdGenerator: TrmrkStrIdGeneratorBase,
    private timeStampGenerator: TimeStampGenerator,
    private router: Router
  ) {}

  ngOnDestroy(): void {}

  assureSessionIsSet() {
    return new Promise<AppSession>((resolve, reject) => {
      if (this.currentSession.value) {
        resolve(this.currentSession.value);
        return;
      } else if (this.queryingDb) {
        reject(new Error('Query params changed too quickly'));
        return;
      } else {
        this.queryingDb = true;
      }

      let session: AppSession;
      const params = new URLSearchParams(document.location.search);
      let sessionId = params.get(urlQueryKeys.sessionId);
      const urlQuerySessionIdIsSet = (sessionId ?? null) !== null;

      const onSuccess = (value: AppSession) => {
        session = value;
        this.currentSession.next(session);
        this.queryingDb = false;
        resolve(session);
      };

      openDbRequestToPromise(this.indexedDbDatabasesService.appSessions.value.open()).then(
        (response) => {
          const store = this.indexedDbDatabasesService.appSessions.value.stores.appSessions.store(
            response.value,
            null,
            'readwrite'
          );

          const request = urlQuerySessionIdIsSet
            ? (store.get(sessionId!) as IDBRequest<IDBValidKey | AppSession>)
            : (store.put(
                (session = {
                  sessionId: (sessionId = this.strIdGenerator.newId()),
                  createdAtMillis: this.timeStampGenerator.millis(),
                } as AppSession)
              ) as IDBRequest<IDBValidKey | AppSession>);

          dbRequestToPromise(request).then((response) => {
            let value = response.value as AppSession;

            if (urlQuerySessionIdIsSet) {
              if (value) {
                onSuccess(value);
              } else {
                dbRequestToPromise(
                  store.put(
                    (session = {
                      sessionId,
                      createdAtMillis: this.timeStampGenerator.millis(),
                    } as AppSession)
                  )
                ).then((response) => {
                  onSuccess(session);
                }, reject);
              }
            } else {
              const url = transformUrl(getRelUri(document.location.href), {
                queryParamsTransformer: (map) => {
                  map[urlQueryKeys.sessionId] = sessionId!;
                  return map;
                },
              });

              this.router.navigateByUrl(url);
              onSuccess(value);
            }
          }, reject);
        },
        reject
      );
    });
  }
}
