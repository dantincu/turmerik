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

import { devModuleIndexedDbBrowserSelectors, devModuleIndexedDbBrowserReducers } from "../../store/devModuleIndexedDbBrowserSlice";
import IndexedDbCreateDbStore, { IndexedDbCreateDbStoreProps } from "./IndexedDbCreateDbStore";

import { IndexedDbDatabase, IndexedDbStore } from "./models";

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatabaseNameValidationMsg,
  getDfDatabaseNumberValidationMsg,
  dfDatabaseNumberValidationMsg,
  IDbObjectStoreInfo,
  getCreateDbRequestErrMsg
} from "../../services/indexedDb";

export interface IndexedDbCreateDbProps {
  basePath: string
}

export default function IndexedDbCreateDb(
  props: IndexedDbCreateDbProps
  ) {
  const [ dbName, setDbName ] = React.useState("");
  const [ dbNameErr, setDbNameErr ] = React.useState<string | null>(null);

  const [ dbVersion, setDbVersion ] = React.useState<number | null>(1);
  const [ dbVersionErr, setDbVersionErr ] = React.useState<string | null>(null);

  const [ dbStoresArr, setDbStoresArr ] = React.useState<IndexedDbStore[]>([]);
  const [ formCanBeSubmitted, setFormCanBeSubmitted ] = React.useState(false);

  const [ saving, setSaving ] = React.useState(false);
  const [ error, setError ] = React.useState<string | null>(null);
  const [ warning, setWarning ] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const createDbAddDatastoreReqsCount = useSelector(
    devModuleIndexedDbBrowserSelectors.getCreateDbAddDatastoreReqsCount);

  const createDbAddDatastoreReqsCountRef = React.useRef(0);
  const dispatch = useDispatch();

  const dbNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbName = e.target.value;
    setDbName(newDbName);

    let dbNameErr: string | null = null;

    if (newDbName.length === 0) {
      dbNameErr = "The database name is required";
    }

    setDbNameErr(dbNameErr);

    refreshFormCanBeSubmitted(
      dbNameErr,
      dbVersionErr,
      dbStoresArr);
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

    refreshFormCanBeSubmitted(
      dbNameErr,
      dbVersionErr,
      dbStoresArr);
  }

  const addDbStoreClicked = () => {
    dispatch(devModuleIndexedDbBrowserReducers.incCreateDbAddDatastoreReqsCount());
    setFormCanBeSubmitted(false);
  }

  const refreshFormCanBeSubmitted = (dbNameErr: string | null, dbVersionErr: string | null, dbStoresArr: IndexedDbStore[]) => {
    const newFormCanBeSubmitted = !dbNameErr && !dbVersionErr && !dbStoresArr.find(store => store.hasError);

    if (newFormCanBeSubmitted !== formCanBeSubmitted) {
      setFormCanBeSubmitted(newFormCanBeSubmitted);
    }
  }

  const createDbStoreNameChangedHandler = (idx: number) => (newDbStoreName: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.dbStoreName = newDbStoreName;
    dbStore.hasError = hasError;

    refreshFormCanBeSubmitted(
      dbNameErr,
      dbVersionErr,
      dbStoresArr);

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

    refreshFormCanBeSubmitted(
      dbNameErr,
      dbVersionErr,
      dbStoresArr);

    setDbStoresArr(newDbStoresArr);
  }

  const onSaveClick = () => {
    setError(null);
    setWarning(null);

    let hasError = false;

    const addedStores = dbStoresArr.map(
      store => store);

    if (addedStores.find(obj => obj.hasError)) {
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
    if (createDbAddDatastoreReqsCount !== createDbAddDatastoreReqsCountRef.current) {
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

  }, [ createDbAddDatastoreReqsCount, createDbAddDatastoreReqsCountRef, dbStoresArr, formCanBeSubmitted ]);

  return (<Paper className="trmrk-page-form trmrk-indexeddb-create-db">
    <FormGroup className="trmrk-form-group">
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbName" required>Database name</InputLabel>
        <Input name="dbName" onChange={dbNameChanged} value={dbName} fullWidth />
        { typeof dbNameErr === "string" ? <FormHelperText error>{dbNameErr}</FormHelperText> : null }
      </FormControl>
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbVersion" required>Database version number</InputLabel>
        <Input name="dbVersion" type="number" onChange={dbVersionChanged} value={dbVersion} fullWidth inputProps={{
          min: 1,
        }} />
        { typeof dbVersionErr === "string" ? <FormHelperText error>{dbVersionErr}</FormHelperText> : null }
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
  </Paper>);
}
