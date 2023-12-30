import localforage from "localforage";

import { core as trmrk } from "trmrk";
import { MtblRefValue } from "trmrk/src/core";
import { ApiService, ApiServiceType } from "trmrk-axios/src/core";

import { AxiosLocalForage as AxiosLocalForageBase } from "trmrk-browser/src/axiosLocalForage/core";

export const apiSvc = new ApiService();

export const dbVersion = 1;

export class DefaultCacheDb {
  private readonly _idxedDbNamePfx: string;
  private readonly _appConfig: LocalForage;

  constructor(idxedDbNamePfx: string) {
    this._idxedDbNamePfx = idxedDbNamePfx;

    this._appConfig = localforage.createInstance({
      name: this._idxedDbNamePfx + "users-all",
      version: dbVersion,
      storeName: "appConfig",
    });
  }

  public get appConfig() {
    return this._appConfig;
  }
}

export class MainCacheDb {
  private readonly _idxedDbNamePfx: string;
  private readonly _userUuid: string;
  private readonly _dbName: string;
  private readonly _entries: LocalForage;

  constructor(idxedDbNamePfx: string, userUuid: string) {
    this._idxedDbNamePfx = idxedDbNamePfx;
    this._userUuid = userUuid;
    this._dbName = this._idxedDbNamePfx + `user-${userUuid}`;

    this._entries = this.createStore("entries");
  }

  public get entries() {
    return this._entries;
  }

  private createStore(storeName: string) {
    const store = localforage.createInstance({
      name: this._dbName,
      version: dbVersion,
      storeName: storeName,
    });

    return store;
  }
}

export class AxiosLocalForage extends AxiosLocalForageBase {
  private readonly _idxedDbNamePfx: string;
  private readonly _dfCacheDb: DefaultCacheDb;

  private _mainCacheDb: MainCacheDb | null;

  constructor(idxedDbNamePfx: string, apiSvc: ApiServiceType) {
    super(apiSvc);
    this._idxedDbNamePfx = idxedDbNamePfx;

    this._dfCacheDb = new DefaultCacheDb(this._idxedDbNamePfx);
    this._mainCacheDb = null;
  }

  public get dfCacheDb() {
    return this._dfCacheDb;
  }

  public get mainCacheDb() {
    if (!this._mainCacheDb) {
      throw new Error("The main cache db has not yet been initialized");
    }

    return this._mainCacheDb;
  }

  public initMainCacheDb(userUuid: string) {
    if (!trmrk.isNonEmptyStr("string")) {
      throw new Error(
        "Cannot initialize the main cache db with empty user uuid"
      );
    }

    this._mainCacheDb = new MainCacheDb(this._idxedDbNamePfx, userUuid);
    this.apiSvc.clientUserUuid = userUuid;
  }
}

export type AxiosLocalForageType = AxiosLocalForage;

// export const cachedApiSvc: AxiosLocalForageType = new AxiosLocalForage(apiSvc);
export const cachedApiSvc = {} as MtblRefValue<AxiosLocalForageType>;
