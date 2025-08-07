import { IDbAdapterBase, IDbStoreAdapter } from '../IDbAdapterBase';

export interface AppTheme {
  id: number;
  name: string;
}

export class BasicAppSettingsDbStores {
  public readonly choices = new IDbStoreAdapter(
    BasicAppSettingsDbAdapter.DB_STORES.Choices.name
  );

  public appThemes = new IDbStoreAdapter(
    BasicAppSettingsDbAdapter.DB_STORES.AppThemes.name
  );
}

export class BasicAppSettingsDbAdapter extends IDbAdapterBase {
  public static readonly DB_NAME = 'BasicAppSettings';
  public static readonly DB_VERSION = 1;

  public static readonly DB_STORES = Object.freeze({
    Choices: Object.freeze({
      name: 'Choices',
      keyPath: 'key',
    }),
    AppThemes: Object.freeze({
      name: 'AppThemes',
      keyPath: 'id',
    }),
  });

  public readonly stores = new BasicAppSettingsDbStores();

  constructor(version: number = BasicAppSettingsDbAdapter.DB_VERSION) {
    super(BasicAppSettingsDbAdapter.DB_NAME, version);
  }

  override onUpgradeNeeded(
    event: IDBVersionChangeEvent,
    db: IDBDatabase
  ): void {
    db.createObjectStore(BasicAppSettingsDbAdapter.DB_STORES.Choices.name, {
      keyPath: BasicAppSettingsDbAdapter.DB_STORES.Choices.keyPath,
    });

    db.createObjectStore(BasicAppSettingsDbAdapter.DB_STORES.AppThemes.name, {
      keyPath: BasicAppSettingsDbAdapter.DB_STORES.AppThemes.keyPath,
      autoIncrement: true,
    });
  }
}
