import { NullOrUndef, cast } from '../../../trmrk/core';
import { DbAdapterBase, DbStoreAdapter } from '../DbAdapterBase';
import { createDbStoreIfNotExists } from '../core';
import { mapObjProps } from '../../../trmrk/obj';
import { mapPropNamesToThemselves } from '../../../trmrk/propNames';
import { namesOf, nameOf } from '../../../trmrk/Reflection/core';

export interface AppTheme {
  id: number;
  name: string;
  clientVersion: number;
}

export interface SharedAppSettingsChoice<TValue = any> {
  key: string;
  catKey: string;
  value: TValue;
}

export interface AppSettingsChoice<TValue = any> extends SharedAppSettingsChoice<TValue> {
  sessionId: string;
}

export interface KeyPress {
  key: string;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
}

export interface KeyboardShortcutCore {
  name: string;
  displayName: string;
  enabled?: boolean | NullOrUndef;
}

export interface KeyboardShortcutSrlzbl extends KeyboardShortcutCore {
  sequence?: KeyPress[] | NullOrUndef;
}

export interface KeyboardShortcut extends KeyboardShortcutCore {
  scopes: string[];
  sequence: KeyPress[];
}

export const commonAppSettingsChoiceCatKeys = mapPropNamesToThemselves({
  appPanelsLayout: '',
});

export const commonAppSettingsChoiceKeys = mapPropNamesToThemselves({
  panelWidthRatios: '',
  panelVisibilities: '',
});

export class SharedBasicAppSettingsDbStores {
  public readonly choices = new DbStoreAdapter(
    SharedBasicAppSettingsDbAdapter.DB_STORES.Choices.name
  );

  public readonly appThemes = new DbStoreAdapter(
    SharedBasicAppSettingsDbAdapter.DB_STORES.AppThemes.name
  );

  public readonly keyboardShortcuts = new DbStoreAdapter(
    SharedBasicAppSettingsDbAdapter.DB_STORES.KeyboardShortcuts.name
  );
}

export class SharedBasicAppSettingsDbAdapter extends DbAdapterBase {
  public static readonly DB_NAME = 'BasicAppSettings';
  public static readonly DB_VERSION = 1;

  public static readonly DB_STORES = Object.freeze(
    mapObjProps(
      {
        Choices: {
          name: '',
          keyPath: Object.freeze(
            namesOf(() => cast<SharedAppSettingsChoice>(), [(v) => v.catKey, (v) => v.key])
          ),
        },
        AppThemes: {
          name: '',
          keyPath: nameOf(
            () => cast<AppTheme>(),
            (v) => v.id
          ),
        },
        KeyboardShortcuts: {
          name: '',
          keyPath: nameOf(
            () => cast<KeyboardShortcutSrlzbl>(),
            (v) => v.name
          ),
        },
      },
      (propVal, propName) => Object.freeze({ ...propVal, name: propName })
    )
  );

  public readonly stores = new SharedBasicAppSettingsDbStores();

  constructor(appName: string, version: number = SharedBasicAppSettingsDbAdapter.DB_VERSION) {
    super({
      appName,
      version,
      dbName: SharedBasicAppSettingsDbAdapter.DB_NAME,
      isSharedDb: true,
    });
  }

  override onUpgradeNeeded(event: IDBVersionChangeEvent, db: IDBDatabase): void {
    const dbStores = SharedBasicAppSettingsDbAdapter.DB_STORES;

    createDbStoreIfNotExists(db, dbStores.Choices.name, () => ({
      keyPath: [...dbStores.Choices.keyPath],
    }));

    createDbStoreIfNotExists(db, dbStores.AppThemes.name, () => ({
      keyPath: dbStores.AppThemes.keyPath,
      autoIncrement: true,
    }));

    createDbStoreIfNotExists(db, dbStores.KeyboardShortcuts.name, () => ({
      keyPath: dbStores.KeyboardShortcuts.keyPath,
    }));
  }
}
