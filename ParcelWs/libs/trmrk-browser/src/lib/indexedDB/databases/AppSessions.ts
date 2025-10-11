import { cast, NullOrUndef } from '../../../trmrk/core';
import { DbAdapterBase, DbStoreAdapter } from '../DbAdapterBase';
import { createDbStoreIfNotExists } from '../core';
import { mapObjProps } from '../../../trmrk/obj';
import { nameOf } from '../../../trmrk/Reflection/core';

import { ActiveDataItemCore } from '../core';

export interface AppSession extends ActiveDataItemCore {
  sessionId: string;
  displayName?: string | NullOrUndef;
}

export class AppSessionsDbStores {
  public readonly appSessions = new DbStoreAdapter(AppSessionsDbAdapter.DB_STORES.AppSessions.name);
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
      keyPath: [...dbStores.AppSessions.keyPath],
    }));
  }
}
