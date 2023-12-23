import {core as $hgUW1$core} from "trmrk";
import {SyncLock as $hgUW1$SyncLock} from "trmrk/src/sync-lock";


function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
var $8a29e9b0d3dc349c$exports = {};

$parcel$export($8a29e9b0d3dc349c$exports, "absUriRegex", () => $8a29e9b0d3dc349c$export$ed01c7b5cbb7da30);
$parcel$export($8a29e9b0d3dc349c$exports, "getNewUri", () => $8a29e9b0d3dc349c$export$c4dc95a7fd9235ea);
$parcel$export($8a29e9b0d3dc349c$exports, "getRelUri", () => $8a29e9b0d3dc349c$export$b6551c57acf17daf);

const $8a29e9b0d3dc349c$export$ed01c7b5cbb7da30 = /^[\w\-_]+\:\/\/([\w\-_]+\.?)+(\:[0-9]+)?(\/[\w\-\?\.\+_&=#,]*)*$/g;
const $8a29e9b0d3dc349c$export$c4dc95a7fd9235ea = (query, hash, path, host, preserveQueryDelim)=>{
    const queryStr = query?.toString();
    const partsArr = [
        host,
        path
    ].filter((part)=>(0, $hgUW1$core).isNonEmptyStr(part, true));
    let newUri = partsArr.join("/");
    if (preserveQueryDelim || (0, $hgUW1$core).isNonEmptyStr(queryStr, true)) newUri = [
        newUri,
        queryStr
    ].join("?");
    if ((0, $hgUW1$core).isNonEmptyStr(hash)) newUri += hash;
    return newUri;
};
const $8a29e9b0d3dc349c$export$b6551c57acf17daf = (queryParams, queryParamsTransformer, hashTransformer, pathTransformer, preserveQueryDelim)=>{
    queryParamsTransformer(queryParams);
    hashTransformer ??= (hash)=>hash;
    pathTransformer ??= (path)=>{
        if (typeof path === "string") {
            if (path.startsWith("/")) path = path.substring(1);
            if (path.endsWith("/")) path = path.substring(0, path.length - 1);
        }
        return path;
    };
    const hash = hashTransformer(location.hash);
    const path = pathTransformer(location.pathname);
    const newUri = $8a29e9b0d3dc349c$export$c4dc95a7fd9235ea(queryParams, hash, path, null, preserveQueryDelim);
    return newUri;
};


var $164e082ca02a4afc$exports = {};

$parcel$export($164e082ca02a4afc$exports, "TrmrkIdxedDB", () => $164e082ca02a4afc$export$d5f7715735bcafa4);
$parcel$export($164e082ca02a4afc$exports, "createDBStore", () => $164e082ca02a4afc$export$c479d14805eafbd9);
$parcel$export($164e082ca02a4afc$exports, "getOrCreateDbStore", () => $164e082ca02a4afc$export$530ecc3dcdde9876);

class $164e082ca02a4afc$export$d5f7715735bcafa4 {
    constructor(dfTimeout){
        this._db = null;
        this.syncLock = new (0, $hgUW1$SyncLock)(dfTimeout);
    }
    init(opts) {
        this.dbName = opts.dbName;
        this.version = opts.dbVersion;
        this.onerror = opts.onIdxedDBerror;
        this.onupgradeneeded = opts.onIdxedDBupgradeneeded;
        this.onblocked = opts.onIdxedDBblocked;
        this.onsuccess = opts.onIdxedDBSuccess;
    }
    getDb(dbVersion = null) {
        return this.syncLock.get(()=>new Promise((resolve, reject)=>{
                if (this._db) resolve(this._db);
                else {
                    dbVersion ??= this.version;
                    if (dbVersion === 0) dbVersion = undefined;
                    const dbReq = indexedDB.open(this.dbName, dbVersion);
                    this.reqOnSuccess(dbReq, resolve);
                    this.reqOnError(dbReq, reject);
                    this.reqOnBlocked(dbReq, reject);
                    dbReq.onupgradeneeded = (ev)=>{
                        if (this.onupgradeneeded) {
                            const innerDbReq = indexedDB.open(this.dbName);
                            this.reqOnSuccess(innerDbReq, resolve);
                            this.reqOnError(innerDbReq, reject);
                            this.reqOnBlocked(innerDbReq, reject);
                            innerDbReq.onupgradeneeded = (ev)=>{
                                this.onblocked?.call(this, ev);
                                reject(ev);
                            };
                        } else reject(ev);
                    };
                    dbReq.onerror = (ev)=>{
                        this.onerror?.call(this, ev);
                        reject(ev);
                    };
                    dbReq.onblocked = (ev)=>{
                        this.onblocked?.call(this, ev);
                        reject(ev);
                    };
                }
            }));
    }
    async withDb(action, dbVersion = null) {
        let resp;
        try {
            var db = await this.getDb(dbVersion);
            resp = action(db);
        } catch (err) {
            resp = {
                cacheError: err
            };
        }
        return resp;
    }
    reqOnSuccess(dbReq, resolve) {
        dbReq.onsuccess = (ev)=>{
            this._db = ev.target.result;
            this.onsuccess?.call(this, ev, this._db);
            resolve(this._db);
        };
    }
    reqOnError(dbReq, reject) {
        dbReq.onerror = (ev)=>{
            this.onerror?.call(this, ev);
            reject(ev);
        };
    }
    reqOnBlocked(dbReq, reject) {
        dbReq.onblocked = (ev)=>{
            this.onblocked?.call(this, ev);
            reject(ev);
        };
    }
}
const $164e082ca02a4afc$export$c479d14805eafbd9 = (db, objStName, keyPath, opts)=>{
    const objSt = db.createObjectStore(objStName, {
        keyPath: keyPath
    });
    for (let idx of opts.idxesArr){
        const paramOpts = idx.dbOpts ?? {};
        paramOpts.unique ??= idx.unique ?? false;
        objSt.createIndex(idx.name, idx.keyPath, paramOpts);
    }
    return objSt;
};
const $164e082ca02a4afc$export$530ecc3dcdde9876 = (db, objStNamesArr, objStName, keyPath, opts)=>{
    if (!(objStName in objStNamesArr)) $164e082ca02a4afc$export$c479d14805eafbd9(db, objStName, keyPath, opts);
};


const $5b3b70ff7e227d24$export$ff8c88762cce97a1 = {
    ...$164e082ca02a4afc$exports
};


const $149c1bd638913645$export$3f2684e5d7cb1006 = {
    ...$8a29e9b0d3dc349c$exports,
    indexedDB: $5b3b70ff7e227d24$export$ff8c88762cce97a1
};


export {$149c1bd638913645$export$3f2684e5d7cb1006 as browser};
//# sourceMappingURL=index.js.map
