export const databaseCreateErrMsg = "Could not create the database";
export const databaseDeleteErrMsg = "Could not delete the database";

export const databaseNameValidationMsg = "The database name is required";

export const databaseNumberValidationMsg =
  "The database version must be a positive integer number";

export const getDbRequestErrMsg = (req: IDBRequest, defaultErrMsg: string) => {
  let errMsg: string;
  let errRetrievedSuccessfully = true;

  try {
    errMsg = req.error?.message?.toString() ?? defaultErrMsg;
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
  getDbRequestErrMsg(req, databaseCreateErrMsg);

export const getDeleteDbRequestErrMsg = (req: IDBRequest) =>
  getDbRequestErrMsg(req, databaseDeleteErrMsg);

export const attachDefaultHandlersToDbOpenRequest = (
  req: IDBOpenDBRequest,
  defaultErrMsg: string,
  setReqFinished: (success: boolean) => void,
  setError: (errMessage: string) => void,
  setWarning: (warnMessage: string) => void
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

  req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
    const warnMsg = getDbRequestWarningMsg("database needs upgrade", e);
    setWarning(warnMsg);
  };
};
