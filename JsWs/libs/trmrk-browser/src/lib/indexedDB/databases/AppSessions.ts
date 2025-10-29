import { cast, NullOrUndef, withVal } from '../../../trmrk/core';
import { DbAdapterBase, DbStoreAdapter } from '../DbAdapterBase';
import { createDbStoreIfNotExists, createIndexIfNotExists } from '../core';
import { mapObjProps } from '../../../trmrk/obj';
import { nameOf, namesOf } from '../../../trmrk/Reflection/core';

import { ActiveDataItemCore } from '../core';

export interface AppSession extends ActiveDataItemCore {
  sessionId: string;
  displayName?: string | NullOrUndef;
}

export interface AppSessionTab extends ActiveDataItemCore {
  sessionId: string;
  tabId: string;
}

export class AppSessionsDbStores {
  public readonly appSessions = new DbStoreAdapter(AppSessionsDbAdapter.DB_STORES.AppSessions.name);

  public readonly appSessionTabs = new DbStoreAdapter(
    AppSessionsDbAdapter.DB_STORES.AppSessionTabs.name
  );
}

export class AppSessionsDbAdapter extends DbAdapterBase {
  public static readonly DB_NAME = 'AppSessions';
  public static readonly DB_VERSION = 1;

  public static readonly DB_STORES = Object.freeze(
    mapObjProps(
      {
        AppSessions: {
          name: '',
          keyPath: Object.freeze(
            nameOf(
              () => cast<AppSession>(),
              (v) => v.sessionId
            )
          ),
        },
        AppSessionTabs: {
          name: '',
          keyPath: Object.freeze(
            nameOf(
              () => cast<AppSessionTab>(),
              (v) => v.tabId
            )
          ),
          indexes: Object.freeze(
            mapObjProps(
              {
                sessionId: {
                  name: '',
                  keyPath: Object.freeze(
                    namesOf(() => cast<AppSessionTab>(), [(v) => v.sessionId])
                  ),
                },
              },
              (propVal, propName) => Object.freeze({ ...propVal, name: propName })
            )
          ),
        },
      },
      (propVal, propName) => Object.freeze({ ...propVal, name: propName })
    )
  );

  public readonly stores = new AppSessionsDbStores();

  constructor(appName: string, version: number = AppSessionsDbAdapter.DB_VERSION) {
    super({
      appName,
      version,
      dbName: AppSessionsDbAdapter.DB_NAME,
    });
  }

  override onUpgradeNeeded(event: IDBVersionChangeEvent, db: IDBDatabase): void {
    const dbStores = AppSessionsDbAdapter.DB_STORES;

    createDbStoreIfNotExists(db, dbStores.AppSessions.name, () => ({
      keyPath: dbStores.AppSessions.keyPath,
    }));

    createDbStoreIfNotExists(
      db,
      dbStores.AppSessionTabs.name,
      () => ({
        keyPath: dbStores.AppSessionTabs.keyPath,
      }),
      (dbStore) => {
        withVal(dbStores.AppSessionTabs.indexes.sessionId, (sessionIdIdx) => {
          createIndexIfNotExists(dbStore, sessionIdIdx.name, [...sessionIdIdx.keyPath]);
        });
      }
    );
  }
}
