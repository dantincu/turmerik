import { DbAdapterBase, DbStoreAdapter } from '../DbAdapterBase';
import { createDbStoreIfNotExists } from '../core';

export interface AppTheme {
  id: number;
  name: string;
  clientVersion: number;
}

export interface AppSettingsChoice {
  key: string;
  catKey: string;
}

export class BasicAppSettingsDbStores {
  public readonly choices = new DbStoreAdapter(
    BasicAppSettingsDbAdapter.DB_STORES.Choices.name
  );

  public appThemes = new DbStoreAdapter(
    BasicAppSettingsDbAdapter.DB_STORES.AppThemes.name
  );
}

export class BasicAppSettingsDbAdapter extends DbAdapterBase {
  public static readonly DB_NAME = 'BasicAppSettings';
  public static readonly DB_VERSION = 1;

  public static readonly DB_STORES = Object.freeze({
    Choices: Object.freeze({
      name: 'Choices',
      keyPath: Object.freeze(['key', 'catKey']),
    }),
    AppThemes: Object.freeze({
      name: 'AppThemes',
      keyPath: 'id',
    }),
  });

  public readonly stores = new BasicAppSettingsDbStores();

  constructor(
    appName: string,
    version: number = BasicAppSettingsDbAdapter.DB_VERSION
  ) {
    super(BasicAppSettingsDbAdapter.DB_NAME, appName, version);
  }

  override onUpgradeNeeded(
    event: IDBVersionChangeEvent,
    db: IDBDatabase
  ): void {
    const dbStores = BasicAppSettingsDbAdapter.DB_STORES;

    createDbStoreIfNotExists(db, dbStores.Choices.name, () => ({
      keyPath: [...dbStores.Choices.keyPath],
    }));

    createDbStoreIfNotExists(db, dbStores.AppThemes.name, () => ({
      keyPath: dbStores.AppThemes.keyPath,
      autoIncrement: true,
    }));
  }
}
