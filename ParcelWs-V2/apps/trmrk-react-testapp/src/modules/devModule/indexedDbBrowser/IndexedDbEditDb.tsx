import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from '@mui/material/Snackbar';

import IndexedDbEditDbStore, { IndexedDbEditDbStoreProps } from "./IndexedDbEditDbStore";
import { devModuleIndexedDbBrowserReducers, devModuleIndexedDbBrowserSelectors } from "../../../store/devModuleIndexedDbBrowserSlice";

import { IndexedDbDatabase, IndexedDbStore } from "./models";

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatabaseNameValidationMsg,
  getDfDatabaseNumberValidationMsg,
  dfDatabaseNumberValidationMsg,
  IDbObjectStoreInfo,
  getCreateDbRequestErrMsg
} from "../../../services/indexedDb";

export interface IndexedDbEditDbProps {
  basePath: string;
  dbName?: string | null | undefined;
  isNewDb: boolean | null | undefined;
  showCreateSuccessMsg?: boolean | null | undefined;
}

const dbNameReqErrMsg = "The database name is required";
const dbVersionNameReqErrMsg = "The database version number is required";
const dbVersionNameReqToBePositiveNumErrMsg = "The database version number must be a positive number";

const validateDbName = (dbName: string) => {
  let dbNameErr: string | null = null;

  if (dbName.length === 0) {
    dbNameErr = dbNameReqErrMsg;
  }

  return dbNameErr;
}

const validateDbVersionNumber = (dbVersionStr: string): [ string | null, number | null ] => {
  let dbVersionErr: string | null = null;
  let dbversion: number | null = null;

  if (dbVersionStr.length > 0) {
    dbversion = parseFloat(dbVersionStr);

    if (dbversion <= 0) {
      dbVersionErr = dbVersionNameReqToBePositiveNumErrMsg;
    }
  } else {
    dbVersionErr = dbVersionNameReqErrMsg;
  }

  return [ dbVersionErr, dbversion ];
}

export default function IndexedDbEditDb(
  props: IndexedDbEditDbProps
  ) {
  const [ dbName, setDbName ] = React.useState(props.dbName ?? "");
  const [ dbNameErr, setDbNameErr ] = React.useState<string | null>("");

  const [ dbVersionStr, setDbVersionStr ] = React.useState<string>("1");
  const [ dbVersion, setDbVersion ] = React.useState<number | null>(1);
  const [ dbVersionErr, setDbVersionErr ] = React.useState<string | null>(null);

  const [ dbStoresArr, setDbStoresArr ] = React.useState<IndexedDbStore[]>([]);
  
  const editDbAddDatastoreReqsCount = useSelector(devModuleIndexedDbBrowserSelectors.getEditDbAddDatastoreReqsCount);
  const editDbAddDatastoreReqsCountRef = React.useRef(0);

  const [ isFirstRender, setIsFirstRender ] = React.useState(true);

  const [ saving, setSaving ] = React.useState(false);
  const [ error, setError ] = React.useState<string | null>(null);
  const [ warning, setWarning ] = React.useState<string | null>(null);

  const [ showEditSuccessMsg, setShowEditSuccessMsg ] = React.useState(props.showCreateSuccessMsg ?? false);
  const [ validateDbStoresReqsCount, setValidateDbStoresReqsCount ] = React.useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCreateSuccessMsgClose = () => {
    setShowEditSuccessMsg(false);
  }

  const dbNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbName = e.target.value;
    setDbName(newDbName);

    const dbNameErr = validateDbName(newDbName);
    setDbNameErr(dbNameErr);
    refreshError(dbNameErr, dbVersionErr, dbStoresArr);
  }

  const dbVersionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbVersionStr = e.target.value;
    setDbVersionStr(newDbVersionStr);

    const [ dbVersionErr, newDbversion ] = validateDbVersionNumber(newDbVersionStr);

    setDbVersion(newDbversion);
    setDbVersionErr(dbVersionErr);
    refreshError(dbNameErr, dbVersionErr, dbStoresArr);
  }

  const addDbStoreClicked = () => {
    dispatch(devModuleIndexedDbBrowserReducers.incEditDbAddDatastoreReqsCount());
  }

  const getFormCanBeSubmitted = (
    dbNameErr: string | null,
    dbVersionErr: string | null,
    dbStoresArr: IndexedDbStore[]) => (dbNameErr ?? null) === null && (dbVersionErr ?? null) === null && (
      dbStoresArr.find(store => store.dbStoreNameHasError || store.dbStoreKeyPathHasError) ?? null) === null;

  const editDbStoreNameChangedHandler = (idx: number, dbStoresArr: IndexedDbStore[]) => (newDbStoreName: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.dbStoreName = newDbStoreName;
    dbStore.dbStoreNameHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, dbVersionErr, newDbStoresArr);
  }

  const editDbStoreAutoIncrementChangedHandler = (idx: number, dbStoresArr: IndexedDbStore[]) => (newAutoIncrement: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.autoIncrement = newAutoIncrement;
    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, dbVersionErr, newDbStoresArr);
  };

  const editDbStoreKeyPathChangedHandler = (idx: number, dbStoresArr: IndexedDbStore[]) => (newKeyPath: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.keyPath = newKeyPath;
    dbStore.dbStoreKeyPathHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, dbVersionErr, newDbStoresArr);
  }

  const editDbStoreNameHasErrorChangedHandler = (idx: number) => (hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];
    dbStore.dbStoreNameHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, dbVersionErr, newDbStoresArr);
  }

  const editDbStoreKeyPathHasErrorChangedHandler = (idx: number) => (hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];
    dbStore.dbStoreKeyPathHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, dbVersionErr, newDbStoresArr);
  }

  const refreshError = (
    dbNameErr: string | null,
    dbVersionErr: string | null,
    dbStoresArr: IndexedDbStore[]) => {
    const formCanBeSubmitted = getFormCanBeSubmitted(dbNameErr, dbVersionErr, dbStoresArr);
    console.log("formCanBeSubmitted", formCanBeSubmitted, dbNameErr, dbVersionErr, dbStoresArr);

    if (formCanBeSubmitted) {
      setError(null);
    }
  }

  const onSaveClick = () => {
    setError(null);
    setWarning(null);

    let hasError: boolean;

    const addedStores = dbStoresArr.map(
      store => store);

    if (!getFormCanBeSubmitted(dbNameErr, dbVersionErr, dbStoresArr)) {
      hasError = true;
      setError("Please fix the current errors before submiting the changes");

      const dbNameErr = validateDbName(dbName);
      const [ dbVersionErr ] = validateDbVersionNumber(dbVersionStr);

      setDbNameErr(dbNameErr)
      setDbVersionErr(dbVersionErr);

      setValidateDbStoresReqsCount(validateDbStoresReqsCount + 1);
    } else {
      setSaving(true);
      var req = indexedDB.open(dbName, dbVersion ?? undefined);

      attachDefaultHandlersToDbOpenRequest(req, dfDatabaseOpenErrMsg, success => {
        if (success) {
          let errMsg: string | null = null;

          try {
            req.result.close();
          } catch (err) {
            hasError = true;
            errMsg = (err as Error).message ?? "Could not close the database connection";
          }
          
          setWarning(null);
          setError(errMsg);

          if (props.isNewDb) {
            navigate(`${props.basePath}/edit-db?showCreateSuccessMsg=true`);
          } else {
            setShowEditSuccessMsg(true);
          }
        } else {
          setWarning(null);
        }

        setSaving(false);
      }, errMsg => {
        hasError = true;
        setError(errMsg);
      }, warnMsg => {
        setWarning(warnMsg);
      }, e => {
        try {
          const db = req.result;

          for (let store of addedStores) {
            db.createObjectStore(store.dbStoreName, {
              keyPath: store.keyPath,
              autoIncrement: store.autoIncrement,
            });
          }
        } catch (err) {
          hasError = true;
          const errMsg = (err as Error).message ?? "Could not upgrade the database";
          setError(errMsg);
        }
      });
    }
  }

  const onCancelClick = () => {
    navigate(props.basePath);
  }

  React.useEffect(() => {
    if (isFirstRender) {
      dispatch(devModuleIndexedDbBrowserReducers.resetEditDbAddDatastoreReqsCount());
      setIsFirstRender(false);
    } else if (editDbAddDatastoreReqsCount !== editDbAddDatastoreReqsCountRef.current) {
      editDbAddDatastoreReqsCountRef.current = editDbAddDatastoreReqsCount;

      const newDbStoresArr = [...dbStoresArr];

      newDbStoresArr.push({
        dbStoreName: "",
        autoIncrement: true,
        keyPath: "",
        dbStoreNameHasError: true
      });

      setDbStoresArr(newDbStoresArr);
    } else {
      if (!props.isNewDb) {

      }
    }
  }, [ editDbAddDatastoreReqsCount,
    editDbAddDatastoreReqsCountRef,
    props.dbName,
    dbName,
    dbVersion,
    dbStoresArr,
    saving,
    error,
    warning,
    dbNameErr,
    dbVersionErr,
    props.showCreateSuccessMsg,
    showEditSuccessMsg,
    props.isNewDb,
    validateDbStoresReqsCount ]);

  return (<Paper className="trmrk-page-form trmrk-indexeddb-create-db">
    <Snackbar open={showEditSuccessMsg} autoHideDuration={6000} onClose={onCreateSuccessMsgClose}>
      <Alert
        onClose={onCreateSuccessMsgClose}
        severity="success"
        variant="filled"
        sx={{ width: '100%' }}
      >
        Database saved successfully
      </Alert>
    </Snackbar>
    <Box className="trmrk-flex-rows-group">
      <Box className="trmrk-flex-row">
        <Box className="trmrk-cell"><label htmlFor="dbName">Database name</label></Box>
        <Box className="trmrk-cell"><Input id="dbName" onChange={dbNameChanged} value={dbName} required fullWidth readOnly={!!props.isNewDb} /></Box>
          { (dbNameErr ?? null) !== null ? <Box className="trmrk-cell"><FormHelperText error>{dbNameErr}</FormHelperText></Box> : null }
      </Box>
      <Box className="trmrk-flex-row">
        <Box className="trmrk-cell"><label htmlFor="dbVersion">Database version number</label></Box>
        <Box className="trmrk-cell"><Input id="dbVersion" type="number" onChange={dbVersionChanged}
          value={dbVersion} required fullWidth inputProps={{ min: 1 }} /></Box>
          { (dbVersionErr ?? null) !== null ? <Box className="trmrk-cell"><FormHelperText error>{dbVersionErr}</FormHelperText></Box> : null }
      </Box>
    </Box>
    <Box className="trmrk-flex-row">
      <Box className="trmrk-cell">
      <Typography component="h2" variant="h5" className="trmrk-form-group-title">
        Db Stores <IconButton className="trmrk-icon-btn" onClick={addDbStoreClicked}><AddIcon /></IconButton></Typography>
      </Box>
    </Box>
    { dbStoresArr.map((dbStore, idx) => <IndexedDbEditDbStore
        model={dbStore} key={idx} idx={idx}
        validateReqsCount={validateDbStoresReqsCount}
        dbStoreNameChanged={editDbStoreNameChangedHandler(idx, dbStoresArr)}
        autoIncrementChanged={editDbStoreAutoIncrementChangedHandler(idx, dbStoresArr)}
        keyPathChanged={editDbStoreKeyPathChangedHandler(idx, dbStoresArr)}
        dbStoreNameHasErrorChanged={editDbStoreNameHasErrorChangedHandler(idx)}
        keyPathHasErrorChanged={editDbStoreKeyPathHasErrorChangedHandler(idx)} /> ) }
    <Box className="trmrk-flex-row">
      <Box className="trmrk-cell trmrk-buttons-group">
        <Button className="trmrk-btn trmrk-btn-text trmrk-btn-text-primary" onClick={onSaveClick}>Save</Button>
        <Button onClick={onCancelClick}>Cancel</Button>
      </Box>
    </Box>
    { (error ?? null) !== null ? <Box className="trmrk-flex-row"><Box className="trmrk-cell"><FormHelperText error>{error}</FormHelperText></Box></Box> : null }
    { (warning ?? null) !== null ? <Box className="trmrk-flex-row"><Box className="trmrk-cell"><FormHelperText className="trmrk-warning">{warning}</FormHelperText></Box></Box> : null }
  </Paper>);
}
