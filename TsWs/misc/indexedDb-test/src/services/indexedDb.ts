export const databaseCreateErrMsg = "Could not create the database";
export const databaseDeleteErrMsg = "Could not delete the database";

export const databaseNameValidationMsg = "The database name is required";

export const databaseNumberValidationMsg =
  "The database version must be a positive integer number";

export const getDbRequestErrMsg = (
  req: IDBRequest,
  defaultErrMsg: string,
  e: IDBVersionChangeEvent | null
) => {
  let errMsg: string;
  let errRetrievedSuccessfully = true;

  try {
    errMsg = req.error?.message?.toString() ?? databaseCreateErrMsg;
  } catch (innerErr) {
    /* I've seen the following error being thrown when trying to access the error from the request object on the blocked handler when trying to
    delete a database with the name being a single space character:
    InvalidStateError: Failed to read the 'error' property from 'IDBRequest': The request has not finished */
    errRetrievedSuccessfully = false;
    errMsg = (innerErr as Error).message?.toString() ?? databaseCreateErrMsg;
  }

  if (e) {
    errMsg = [
      errMsg,
      `Old Version: ${e.oldVersion}`,
      `New Version: ${e.newVersion}`,
    ].join("; ");
  }

  return errMsg;
};

export const getCreateDbRequestErrMsg = (
  req: IDBRequest,
  e: IDBVersionChangeEvent | null
) => getDbRequestErrMsg(req, databaseCreateErrMsg, e);

export const getDeleteDbRequestErrMsg = (
  req: IDBRequest,
  e: IDBVersionChangeEvent | null
) => getDbRequestErrMsg(req, databaseDeleteErrMsg, e);

export const attachDefaultHandlersToDbOpenRequest = (
  req: IDBOpenDBRequest,
  defaultErrMsg: string,
  setReqFinished: (success: boolean) => void,
  setError: (errMessage: string) => void
) => {
  req.onsuccess = (e: Event) => {
    setReqFinished(true);
  };

  req.onerror = (e: Event) => {
    setReqFinished(false);
    const errMSg = getDbRequestErrMsg(req, defaultErrMsg, null);
    setError(errMSg);
  };

  req.onblocked = (e: IDBVersionChangeEvent) => {
    setReqFinished(false);
    const errMSg = getDbRequestErrMsg(req, defaultErrMsg, e);
    setError(errMSg);
  };

  req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
    setReqFinished(false);
    const errMSg = getDbRequestErrMsg(req, defaultErrMsg, e);
    setError(errMSg);
  };
};
