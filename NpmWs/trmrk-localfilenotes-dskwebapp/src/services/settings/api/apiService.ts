import localforage from "localforage";

import { core as trmrk } from "trmrk";
import { ApiService, ApiServiceType } from "trmrk-axios";
import { browser as trmrkBrowserCore } from "trmrk-browser-core";

import { browser as trmrkBrowser } from "trmrk-browser";

export const apiSvc = new ApiService();

export const dbVersion = 1;

export class DefaultCacheDb {
  private readonly _appConfig: LocalForage;

  constructor() {
    this._appConfig = localforage.createInstance({
      name: "users-all",
      version: dbVersion,
      storeName: "appConfig",
    });
  }

  public get appConfig() {
    return this._appConfig;
  }
}

export class MainCacheDb {
  private _userUuid: string;
  private readonly _dbName: string;
  private readonly _entries: LocalForage;

  constructor(userUuid: string) {
    this._userUuid = userUuid;
    this._dbName = `user-${userUuid}`;

    this._entries = this.createStore("entries");
    console.log("MainCacheDb initialized", userUuid);
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

export class AxiosLocalForage extends trmrkBrowser.axiosLocalForage
  .AxiosLocalForage {
  private readonly _dfCacheDb: DefaultCacheDb;

  private _mainCacheDb: MainCacheDb | null;

  constructor(apiSvc: ApiServiceType) {
    super(apiSvc);

    this._dfCacheDb = new DefaultCacheDb();
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

    this._mainCacheDb = new MainCacheDb(userUuid);
    this.apiSvc.clientUserUuid = userUuid;
  }
}

export const cachedApiSvc = new AxiosLocalForage(apiSvc);
