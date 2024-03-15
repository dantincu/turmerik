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
  const [ dbStoresErrIdxesArr, setDbStoresErrIdxesArr ] = React.useState<number[]>([]);

  const [ formCanBeSubmitted, setFormCanBeSubmitted ] = React.useState(false);

  const navigate = useNavigate();

  const createDbAddDatastoreReqsCount = useSelector(
    devModuleIndexedDbBrowserSelectors.getCreateDbAddDatastoreReqsCount);

  const createDbAddDatastoreReqsCountRef = React.useRef(0);

  const dispatch = useDispatch();

  const dbNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbName = e.target.value;
    setDbName(newDbName);

    if (newDbName.length === 0) {
      setDbNameErr("The database name is required");
    } else {
      setDbNameErr(null);
    }
  }

  const dbVersionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbVersionStr = e.target.value;

    if (newDbVersionStr.length > 0) {
      const newDbversion = parseFloat(newDbVersionStr);
      setDbVersion(newDbversion);
      setDbVersionErr(null);
    } else {
      setDbVersion(null);
      setDbVersionErr("The database version number is required");
    }
  }

  const addDbStoreClicked = () => {
    dispatch(devModuleIndexedDbBrowserReducers.incCreateDbAddDatastoreReqsCount());
  }

  const refreshDbStoreErrIdxesArr = (idx: number, hasError: boolean) => {
    const idxOfIdx = dbStoresErrIdxesArr.indexOf(idx);
    let newDbStoreErrIdxesArr: number[] | null = null;

    if (hasError) {
      if (idxOfIdx < 0) {
        newDbStoreErrIdxesArr = [...dbStoresErrIdxesArr];
        newDbStoreErrIdxesArr.push(idx);
        setDbStoresErrIdxesArr(newDbStoreErrIdxesArr);
      }
    } else {
      if (idxOfIdx >= 0) {
        newDbStoreErrIdxesArr = [...dbStoresErrIdxesArr];
        newDbStoreErrIdxesArr.splice(idxOfIdx, 1);
        setDbStoresErrIdxesArr(newDbStoreErrIdxesArr);
      }
    }

    if (newDbStoreErrIdxesArr) {
      setFormCanBeSubmitted(!!newDbStoreErrIdxesArr.length);
    }
    
    return idxOfIdx;
  }

  const createDbStoreNameChangedHandler = (idx: number) => (newDbStoreName: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.dbStoreName = newDbStoreName;
    dbStore.hasError = hasError;

    refreshDbStoreErrIdxesArr(idx, hasError);
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

    refreshDbStoreErrIdxesArr(idx, hasError);
    setDbStoresArr(newDbStoresArr);
  }

  const onSaveClick = () => {

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
        keyPath: ""
      });

      setDbStoresArr(newDbStoresArr);
    }

    console.log("props.basePath", props.basePath);
  }, [ createDbAddDatastoreReqsCount, createDbAddDatastoreReqsCountRef, dbStoresArr, dbStoresErrIdxesArr ]);

  return (<Paper className="trmrk-page-form trmrk-indexeddb-create-db">
    <FormGroup className="trmrk-form-group">
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbName" required>Database name</InputLabel>
        <Input name="dbName" onChange={dbNameChanged} value={dbName} fullWidth />
        { typeof dbNameErr === "string" ? <FormHelperText error>{dbNameErr}</FormHelperText> : null }
      </FormControl>
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbVersion" required>Database version number</InputLabel>
        <Input name="dbVersion" type="number" onChange={dbVersionChanged} value={dbVersion} fullWidth />
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
    <div className="trmrk-form-action-buttons">
        <Button color="primary" onClick={onSaveClick}>Save</Button>
        <Button color="secondary" onClick={onCancelClick}>Cancel</Button>
    </div>
  </Paper>);
}
