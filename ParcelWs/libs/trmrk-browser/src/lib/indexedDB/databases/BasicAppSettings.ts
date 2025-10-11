import { cast } from '../../../trmrk/core';
import { DbAdapterBase, DbStoreAdapter } from '../DbAdapterBase';
import { createDbStoreIfNotExists } from '../core';
import { mapObjProps } from '../../../trmrk/obj';
import { namesOf } from '../../../trmrk/Reflection/core';

import { AppSettingsChoice } from './SharedBasicAppSettings';

export class BasicAppSettingsDbStores {
  public readonly choices = new DbStoreAdapter(BasicAppSettingsDbAdapter.DB_STORES.Choices.name);
}

export class BasicAppSettingsDbAdapter extends DbAdapterBase {
  public static readonly DB_NAME = 'BasicAppSettings';
  public static readonly DB_VERSION = 1;

  public static readonly DB_STORES = Object.freeze(
    mapObjProps(
      {
        Choices: {
          name: '',
          keyPath: Object.freeze(
            namesOf(
              () => cast<AppSettingsChoice>(),
              [(v) => v.catKey, (v) => v.key, (v) => v.sessionId]
            )
          ),
        },
      },
      (propVal, propName) => Object.freeze({ ...propVal, name: propName })
    )
  );

  public readonly stores = new BasicAppSettingsDbStores();

  constructor(appName: string, version: number = BasicAppSettingsDbAdapter.DB_VERSION) {
    super({
      appName,
      version,
      dbName: BasicAppSettingsDbAdapter.DB_NAME,
    });
  }

  override onUpgradeNeeded(event: IDBVersionChangeEvent, db: IDBDatabase): void {
    const dbStores = BasicAppSettingsDbAdapter.DB_STORES;

    createDbStoreIfNotExists(db, dbStores.Choices.name, () => ({
      keyPath: [...dbStores.Choices.keyPath],
    }));
  }
}
