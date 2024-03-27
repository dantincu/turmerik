export const dfDatabaseOpenErrMsg = "Could not open the database";
export const dfDatabaseDeleteErrMsg = "Could not delete the database";

export const dfDatabaseNameValidationMsg = "The database name is required";

export const dfDatabaseNumberValidationMsg =
  "The database version must be a positive integer number";

export const getDfDatabaseNumberValidationMsg = (minVersionNumber: number) =>
  [
    dfDatabaseNumberValidationMsg,
    "greater than or equal to",
    minVersionNumber,
  ].join(" ");

export const dfDatastoreCreateErrMsg = "Could not create the data store";
export const dfDatastoreDeleteErrMsg = "Could not delete the data store";
export const dfDatastoreNameValidationMsg = "The datastore name is required";

export const getErrMsg = (error: Error | any | null | undefined) =>
  error?.message?.toString();

export const getDbRequestErrMsg = (req: IDBRequest, defaultErrMsg: string) => {
  let errMsg: string;
  let errRetrievedSuccessfully = true;

  try {
    errMsg = getErrMsg(req.error) ?? defaultErrMsg;
  } catch (innerErr) {
    /* I've seen the following error being thrown when trying to access the error from the request object on the blocked handler when trying to
    delete a database with the name being a single space character:
    InvalidStateError: Failed to read the 'error' property from 'IDBRequest': The request has not finished */
    errRetrievedSuccessfully = false;
    errMsg = (innerErr as Error).message?.toString() ?? defaultErrMsg;
  }

  return errMsg;
};

export const getDbRequestWarningMsg = (msg: string, e: IDBVersionChangeEvent) =>
  [msg, `Old Version: ${e.oldVersion}`, `New Version: ${e.newVersion}`].join(
    "; "
  );

export const getCreateDbRequestErrMsg = (req: IDBRequest) =>
  getDbRequestErrMsg(req, dfDatabaseOpenErrMsg);

export const getDeleteDbRequestErrMsg = (req: IDBRequest) =>
  getDbRequestErrMsg(req, dfDatabaseDeleteErrMsg);

export const attachDefaultHandlersToDbOpenRequest = (
  req: IDBOpenDBRequest,
  defaultErrMsg: string,
  setReqFinished: (success: boolean) => void,
  setError: (errMessage: string) => void,
  setWarning: (warnMessage: string) => void,
  onupgradeneeded?: ((e: IDBVersionChangeEvent) => void) | null | undefined
) => {
  req.onsuccess = (e: Event) => {
    setReqFinished(true);
  };

  req.onerror = (e: Event) => {
    setReqFinished(false);
    const errMSg = getDbRequestErrMsg(req, defaultErrMsg);
    setError(errMSg);
  };

  req.onblocked = (e: IDBVersionChangeEvent) => {
    const warnMsg = getDbRequestWarningMsg("request is being blocked", e);
    setWarning(warnMsg);
  };

  req.onupgradeneeded =
    onupgradeneeded ??
    ((e: IDBVersionChangeEvent) => {
      const warnMsg = getDbRequestWarningMsg("database needs upgrade", e);
      setWarning(warnMsg);
    });
};

export const domStrListToArr = (list: DOMStringList) => {
  const arr: string[] = [];

  for (let i = 0; i < list.length; i++) {
    const str = list[i];
    arr.push(str);
  }

  return arr;
};

export const serializeKeyPath = (
  keyPath: string | string[],
  joinStr?: string | null | undefined
) => {
  if (typeof keyPath === "object") {
    keyPath = keyPath.join(joinStr ?? "\n");
  }

  return keyPath;
};

export const getObjectStoreNames = (db: IDBDatabase) =>
  domStrListToArr(db.objectStoreNames);

export interface IDbDatabaseInfo {
  name?: string;
  version?: number;
}

export interface IDbIndexInfo {
  name: string;
  keyPath: string | string[];
  multiEntry: boolean;
  unique: boolean;
}

export interface IDbObjectStoreInfo {
  storeName: string;
  autoIncrement: boolean;
  keyPath: string | string[];
  serializedKeyPath: string;
  indexNames: string[];
  indexes: IDbIndexInfo[];
}

export const getDbInfo = (dbInfo: IDBDatabaseInfo): IDbDatabaseInfo => ({
  name: dbInfo.name,
  version: dbInfo.version,
});

export const getObjectStoresInfoAgg = (
  db: IDBDatabase
): IDbObjectStoreInfo[] => {
  let objStoresArr: IDbObjectStoreInfo[] = [];
  const objStoreNamesArr = getObjectStoreNames(db);

  if (objStoreNamesArr.length > 0) {
    const transaction = db.transaction(objStoreNamesArr, "readonly");

    objStoresArr = objStoreNamesArr.map((objStoreName) =>
      getObjectStoreInfo(transaction.objectStore(objStoreName))
    );
  }

  return objStoresArr;
};

export const getObjectStoreIndexInfo = (index: IDBIndex) => {
  const info: IDbIndexInfo = {
    name: index.name,
    keyPath: index.keyPath,
    multiEntry: index.multiEntry,
    unique: index.unique,
  };

  return info;
};

export const getObjectStoreInfo = (objStore: IDBObjectStore) => {
  const info = {
    storeName: objStore.name,
    autoIncrement: objStore.autoIncrement,
    keyPath: objStore.keyPath,
    serializedKeyPath: serializeKeyPath(objStore.keyPath),
    indexNames: domStrListToArr(objStore.indexNames),
  } as IDbObjectStoreInfo;

  info.indexes = info.indexNames.map((indexName) =>
    getObjectStoreIndexInfo(objStore.index(indexName))
  );

  return info;
};
