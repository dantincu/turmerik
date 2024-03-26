import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { FormGroup } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Snackbar from '@mui/material/Snackbar';

import IndexedDbCreateDbStore, { IndexedDbCreateDbStoreProps } from "./IndexedDbCreateDbStore";
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
  showCreateSuccessMsg?: boolean | null | undefined;
}

export default function IndexedDbEditDb(
  props: IndexedDbEditDbProps
  ) {
  const [ dbName, setDbName ] = React.useState("");
  const [ dbNameErr, setDbNameErr ] = React.useState<string | null>(null);

  const [ dbVersion, setDbVersion ] = React.useState<number | null>(1);
  const [ dbVersionErr, setDbVersionErr ] = React.useState<string | null>(null);

  const [ dbStoresArr, setDbStoresArr ] = React.useState<IndexedDbStore[]>([]);
  
  const createDbAddDatastoreReqsCount = useSelector(devModuleIndexedDbBrowserSelectors.getEditDbAddDatastoreReqsCount);
  const createDbAddDatastoreReqsCountRef = React.useRef(0);

  const [ isFirstRender, setIsFirstRender ] = React.useState(true);

  const [ saving, setSaving ] = React.useState(false);
  const [ error, setError ] = React.useState<string | null>(null);
  const [ warning, setWarning ] = React.useState<string | null>(null);

  const [ showCreateSuccessMsg, setShowCreateSuccessMsg ] = React.useState(props.showCreateSuccessMsg ?? false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCreateSuccessMsgClose = () => {
    setShowCreateSuccessMsg(false);
  }

  const dbNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbName = e.target.value;
    setDbName(newDbName);

    let dbNameErr: string | null = null;

    if (newDbName.length === 0) {
      dbNameErr = "The database name is required";
    }

    setDbNameErr(dbNameErr);
  }

  const dbVersionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbVersionStr = e.target.value;
    let dbVersionErr: string | null = null;

    if (newDbVersionStr.length > 0) {
      const newDbversion = parseFloat(newDbVersionStr);
      setDbVersion(newDbversion);

      if (newDbversion <= 0) {
        dbVersionErr = "The database version must be a positive number";
      }
    } else {
      setDbVersion(null);
      dbVersionErr = "The database version number is required";
    }

    setDbVersionErr(dbVersionErr);
  }

  const addDbStoreClicked = () => {
    dispatch(devModuleIndexedDbBrowserReducers.incEditDbAddDatastoreReqsCount());
  }

  const getFormCanBeSubmitted = (
    dbNameErr: string | null,
    dbVersionErr: string | null,
    dbStoresArr: IndexedDbStore[]) => (dbNameErr ?? null) === null && (dbVersionErr ?? null) === null && (
      dbStoresArr.find(store => store.hasError) ?? null) === null;

  const createDbStoreNameChangedHandler = (idx: number) => (newDbStoreName: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.dbStoreName = newDbStoreName;
    dbStore.hasError = hasError;

    setDbStoresArr(newDbStoresArr);
  }

  const createDbStoreAutoIncrementChangedHandler = (idx: number) => (newAutoIncrement: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.autoIncrement = newAutoIncrement;
    setDbStoresArr(newDbStoresArr);
  };

  const createDbStoreKeyPathChangedHandler = (idx: number) => (newKeyPath: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.keyPath = newKeyPath;
    dbStore.hasError = hasError;

    setDbStoresArr(newDbStoresArr);
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
          navigate(`${props.basePath}/edit-db?showCreateSuccessMsg=true`);
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
    } else if (createDbAddDatastoreReqsCount !== createDbAddDatastoreReqsCountRef.current) {
      createDbAddDatastoreReqsCountRef.current = createDbAddDatastoreReqsCount;

      const newDbStoresArr = [...dbStoresArr];

      newDbStoresArr.push({
        dbStoreName: "",
        autoIncrement: true,
        keyPath: "",
        hasError: true
      });

      setDbStoresArr(newDbStoresArr);
    }

  }, [ createDbAddDatastoreReqsCount,
    createDbAddDatastoreReqsCountRef,
    dbStoresArr,
    saving,
    error,
    warning,
    dbNameErr,
    dbVersionErr,
    props.showCreateSuccessMsg,
    showCreateSuccessMsg ]);

  return (<Paper className="trmrk-page-form trmrk-indexeddb-create-db">
    <Snackbar className="trmrk-snackbar"
      open={showCreateSuccessMsg}
      autoHideDuration={600000}
      onClose={onCreateSuccessMsgClose}
      message="Database created successfully"
      action={<React.Fragment>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={onCreateSuccessMsgClose}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </React.Fragment>}
    />
    <FormGroup className="trmrk-form-group">
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbName" required>Database name</InputLabel>
        <Input name="dbName" onChange={dbNameChanged} value={dbName} fullWidth />
        { (dbNameErr ?? null) !== null ? <FormHelperText error>{dbNameErr}</FormHelperText> : null }
      </FormControl>
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbVersion" required>Database version number</InputLabel>
        <Input name="dbVersion" type="number" onChange={dbVersionChanged} value={dbVersion} fullWidth inputProps={{
          min: 1,
        }} />
        { (dbVersionErr ?? null) !== null ? <FormHelperText error>{dbVersionErr}</FormHelperText> : null }
      </FormControl>
    </FormGroup>
    <FormControl className="trmrk-form-field">
      <Typography component="h2" variant="h5" className="trmrk-form-group-title">
        Db Stores <IconButton className="trmrk-icon-btn" onClick={addDbStoreClicked}><AddIcon /></IconButton></Typography>
    </FormControl>
    { dbStoresArr.map((dbStore, idx) => <IndexedDbCreateDbStore
        model={dbStore} key={idx}
        dbStoreNameChanged={createDbStoreNameChangedHandler(idx)}
        autoIncrementChanged={createDbStoreAutoIncrementChangedHandler(idx)}
        keyPathChanged={createDbStoreKeyPathChangedHandler(idx)} /> ) }
    <div className="trmrk-buttons-group">
        <Button className="trmrk-btn trmrk-btn-text trmrk-btn-text-primary" onClick={onSaveClick}>Save</Button>
        <Button onClick={onCancelClick}>Cancel</Button>
    </div>
    { (error ?? null) !== null ? <FormHelperText error>{error}</FormHelperText> : null }
    { (warning ?? null) !== null ? <FormHelperText className="trmrk-warning">{warning}</FormHelperText> : null }
  </Paper>);
}
