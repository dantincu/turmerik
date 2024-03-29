import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from '@mui/material/Snackbar';

import IndexedDbEditDbStore, { IndexedDbEditDbStoreProps } from "./IndexedDbEditDbStore";
import { devModuleIndexedDbBrowserReducers, devModuleIndexedDbBrowserSelectors } from "../../../store/devModuleIndexedDbBrowserSlice";

import { IndexedDbDatabase, IndexedDbStore } from "./models";
import LoadingDotPulse from '../../../components/loading/LoadingDotPulse';

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatabaseNameValidationMsg,
  getDfDatabaseNumberValidationMsg,
  dfDatabaseNumberValidationMsg,
  IDbObjectStoreInfo,
  getDbInfo,
  IDbDatabaseInfo,
  getCreateDbRequestErrMsg,
  getObjectStoresInfoAgg
} from "../../../services/indexedDb";

import { searchQuery } from "./data";

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
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ db, setDb ] = React.useState<IDbDatabaseInfo | null>(null);
  const [ loadError, setLoadError ] = React.useState<string | null>((props.dbName ?? null) === null && !props.isNewDb ? "Database name is required" : null);
  const [ loadWarning, setLoadWarning ] = React.useState<string | null>(null);

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

  const [ editSuccessMsg, setEditSuccessMsg ] = React.useState(
    (props.showCreateSuccessMsg ?? false) === true ? "Database saved successfully" : "");
  
  const [ showEditResultMsg, setShowEditResultMsg ] = React.useState(props.showCreateSuccessMsg ?? false);
  const [ editResultMsgSeverity, setEditResultMsgSeverity ] = React.useState<AlertColor>(props.showCreateSuccessMsg ? "success" : "info");
  const [ validateDbStoresReqsCount, setValidateDbStoresReqsCount ] = React.useState(0);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCreateSuccessMsgClose = () => {
    setEditSuccessMsg("");
    setShowEditResultMsg(false);
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

    dbStore.dbStore.storeName = newDbStoreName;
    dbStore.dbStoreNameHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, dbVersionErr, newDbStoresArr);
  }

  const editDbStoreAutoIncrementChangedHandler = (idx: number, dbStoresArr: IndexedDbStore[]) => (newAutoIncrement: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.dbStore.autoIncrement = newAutoIncrement;
    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, dbVersionErr, newDbStoresArr);
  };

  const editDbStoreKeyPathChangedHandler = (idx: number, dbStoresArr: IndexedDbStore[]) => (newKeyPath: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.dbStore.serializedKeyPath = newKeyPath;
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

    if (formCanBeSubmitted) {
      setError(null);
    }
  }

  const load = () => {
    setIsLoading(true);
    var req = indexedDB.open(dbName);

    let hasError: boolean;
    
    attachDefaultHandlersToDbOpenRequest(req, dfDatabaseOpenErrMsg, success => {
      if (success) {
        let errMsg: string | null = null;

        try {
          const db = getDbInfo(req.result);
          setDb(db);
          const dbStores = getObjectStoresInfoAgg(req.result);

          const dbStoresArr = dbStores.map(store => ({
            dbStore: store,
            canBeEdited: false
          }) as IndexedDbStore);

          setDbStoresArr(dbStoresArr);
          req.result.close();

          setDbName(db.name ?? "");
          setDbVersion(db.version ?? null);
          setDbVersionStr(db.version?.toString() ?? "");

          setDbNameErr(null);
          setDbVersionErr(null);
        } catch (err) {
          hasError = true;
          errMsg = (err as Error).message ?? "Could not close the database connection";
        }
        
        setLoadWarning(null);
        setLoadError(errMsg);
      } else {
        setLoadWarning(null);
      }

      setIsLoading(false);
    },
    errMsg => {
      hasError = true;
      setLoadError(errMsg);
    }, warnMsg => {
      setLoadWarning(warnMsg);
    });
  }

  const onSaveClick = () => {
    setError(null);
    setWarning(null);

    let hasError: boolean;
    let hasMigrationError = false;
    let migrated = false;

    const addedStores = dbStoresArr.filter(
      store => store.canBeEdited);

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

          if (!hasMigrationError) {
            setError(errMsg);
          }
        } else {
          setWarning(null);
        }

        setSaving(false);

        if (!migrated) {
          setEditResultMsgSeverity("info");
          setEditSuccessMsg("Database opened successfully");
          setShowEditResultMsg(true);
          // load();
        }
      }, errMsg => {
        hasError = true;
        setError(errMsg);
      }, warnMsg => {
        setWarning(warnMsg);
      }, e => {
        try {
          const db = req.result;

          for (let store of addedStores) {
            db.createObjectStore(store.dbStore.storeName, {
              keyPath: store.dbStore.serializedKeyPath,
              autoIncrement: store.dbStore.autoIncrement,
            });
          }
        } catch (err) {
          hasError = true;
          hasMigrationError = true;
          const errMsg = (err as Error).message ?? "Could not upgrade the database";
          setError(errMsg);
        }

        if (!hasMigrationError) {
          if (props.isNewDb) {
            const encodedDbName = encodeURIComponent(dbName);
            navigate(`${props.basePath}/edit-db?${searchQuery.showCreateSuccessMsg}=true&${searchQuery.dbName}=${encodedDbName}`);
          } else {
            migrated = true;
            setEditResultMsgSeverity("success");
            setEditSuccessMsg("Database saved successfully");
            setShowEditResultMsg(true);
            load();
          }
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
        dbStore: {
          storeName: "",
          autoIncrement: true,
          keyPath: "",
          serializedKeyPath: "",
          indexes: [],
          indexNames: []
        },
        dbStoreNameHasError: true,
        dbStoreKeyPathHasError: true,
        canBeEdited: true
      });

      setDbStoresArr(newDbStoresArr);
    } else {
      if (!props.isNewDb && !isLoading && (loadError ?? null) === null && (loadWarning ?? null) === null && !db) {
        load();
      }
    }
  }, [ isLoading,
    loadError,
    loadWarning,
    db,
    isFirstRender,
    editDbAddDatastoreReqsCount,
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
    showEditResultMsg,
    props.isNewDb,
    validateDbStoresReqsCount ]);

  return (<Box className="trmrk-page-form trmrk-indexeddb-create-db">
    { isLoading ? <LoadingDotPulse /> : (loadError ?? null) !== null ? <Box className="trmrk-flex-row">
      <Box className="trmrk-cell"><FormHelperText error className="trmrk-wrap-content">{loadError}</FormHelperText></Box></Box> : (
        loadWarning ?? null) !== null ? <Box className="trmrk-flex-row">
      <Box className="trmrk-cell"><FormHelperText className="trmrk-warning trmrk-wrap-content">{loadWarning}</FormHelperText></Box>
      </Box> : <React.Fragment>
        <Paper className="trmrk-flex-rows-group">
          <Box className="trmrk-flex-row">
            <Box className="trmrk-cell"><label className="trmrk-title" htmlFor="dbName">Database name</label></Box>
            <Box className="trmrk-cell"><Input id="dbName" onChange={dbNameChanged} value={dbName}
              required fullWidth readOnly={!props.isNewDb}
              className={[ "trmrk-input", props.isNewDb ? "" : "trmrk-readonly" ].join(" ")} /></Box>
              { (dbNameErr ?? null) !== null ? <Box className="trmrk-cell"><FormHelperText error className="trmrk-wrap-content">
                {dbNameErr}</FormHelperText></Box> : null }
          </Box>
          <Box className="trmrk-flex-row">
            <Box className="trmrk-cell"><label className="trmrk-title" htmlFor="dbVersion">Database version number</label></Box>
            <Box className="trmrk-cell"><Input id="dbVersion" type="number" onChange={dbVersionChanged}
              value={dbVersion} required fullWidth inputProps={{ min: 1 }}
              className={[ "trmrk-input", props.isNewDb ? "" : "trmrk-readonly" ].join(" ")} /></Box>
              { (dbVersionErr ?? null) !== null ? <Box className="trmrk-cell"><FormHelperText error className="trmrk-wrap-content">
                {dbVersionErr}</FormHelperText></Box> : null }
          </Box>
        </Paper>
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
          { (error ?? null) !== null ? <Box className="trmrk-flex-row"><Box className="trmrk-cell">
            <FormHelperText error className="trmrk-wrap-content">{error}</FormHelperText></Box></Box> : null }
          { (warning ?? null) !== null ? <Box className="trmrk-flex-row">
            <Box className="trmrk-cell"><FormHelperText className="trmrk-warning trmrk-wrap-content">{warning}</FormHelperText></Box></Box> : null }
        </React.Fragment> }
    <Snackbar open={showEditResultMsg} autoHideDuration={6000} onClose={onCreateSuccessMsgClose}>
      <Alert
        onClose={onCreateSuccessMsgClose}
        severity={editResultMsgSeverity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        { editSuccessMsg }
      </Alert>
    </Snackbar>
  </Box>);
}
