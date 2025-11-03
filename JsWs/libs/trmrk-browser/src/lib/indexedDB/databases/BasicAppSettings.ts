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

export interface AppSettingsChoice<TValue = any> {
  key: string;
  catKey: string;
  value: TValue;
}

export interface AppSessionSettingsChoice<TValue = any> extends AppSettingsChoice<TValue> {
  sessionId: string;
}

export interface AppSessionTabSettingsChoice<TValue = any>
  extends AppSessionSettingsChoice<TValue> {
  tabId: string;
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

export class BasicAppSettingsDbStores {
  public readonly choices = new DbStoreAdapter(BasicAppSettingsDbAdapter.DB_STORES.Choices.name);

  public readonly sessionChoices = new DbStoreAdapter(
    BasicAppSettingsDbAdapter.DB_STORES.SessionChoices.name
  );

  public readonly tabChoices = new DbStoreAdapter(
    BasicAppSettingsDbAdapter.DB_STORES.SessionTabChoices.name
  );

  public readonly appThemes = new DbStoreAdapter(
    BasicAppSettingsDbAdapter.DB_STORES.AppThemes.name
  );

  public readonly keyboardShortcuts = new DbStoreAdapter(
    BasicAppSettingsDbAdapter.DB_STORES.KeyboardShortcuts.name
  );
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
            namesOf(() => cast<AppSettingsChoice>(), [(v) => v.catKey, (v) => v.key])
          ),
        },
        SessionChoices: {
          name: '',
          keyPath: Object.freeze(
            namesOf(
              () => cast<AppSessionSettingsChoice>(),
              [(v) => v.catKey, (v) => v.key, (v) => v.sessionId]
            )
          ),
        },
        SessionTabChoices: {
          name: '',
          keyPath: Object.freeze(
            namesOf(
              () => cast<AppSessionTabSettingsChoice>(),
              [(v) => v.catKey, (v) => v.key, (v) => v.tabId]
            )
          ),
          indexes: Object.freeze(
            mapObjProps(
              {
                sessionId: {
                  name: '',
                  keyPath: Object.freeze(
                    namesOf(() => cast<AppSessionTabSettingsChoice>(), [(v) => v.tabId])
                  ),
                },
              },
              (propVal, propName) => Object.freeze({ ...propVal, name: propName })
            )
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

    createDbStoreIfNotExists(db, dbStores.SessionChoices.name, () => ({
      keyPath: [...dbStores.SessionChoices.keyPath],
    }));

    createDbStoreIfNotExists(db, dbStores.SessionTabChoices.name, () => ({
      keyPath: [...dbStores.SessionTabChoices.keyPath],
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
