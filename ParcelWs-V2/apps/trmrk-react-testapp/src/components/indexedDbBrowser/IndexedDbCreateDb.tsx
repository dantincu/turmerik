import React from "react";
import { useSelector, useDispatch } from "react-redux";

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { FormGroup } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import { devModuleIndexedDbBrowserSelectors, devModuleIndexedDbBrowserReducers } from "../../store/devModuleIndexedDbBrowserSlice";
import IndexedDbCreateDbStore, { IndexedDbCreateDbStoreProps } from "./IndexedDbCreateDbStore";

import { IndexedDbDatabase, IndexedDbStore } from "./models";

export interface IndexedDbCreateDbProps {
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

  const createDbStoreNameChangedHandler = (idx: number) => (newDbStoreName: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];
    const dbStore = newDbStoresArr[idx];

    dbStore.dbStoreName = newDbStoreName;
    dbStore.hasError = hasError;

    const idxOfIdx = dbStoresErrIdxesArr.indexOf(idx);

    if (hasError) {
      if (idxOfIdx < 0) {
        const newDbStoreErrIdxesArr = [...dbStoresErrIdxesArr];
        newDbStoreErrIdxesArr.push(idx);
        setDbStoresErrIdxesArr(newDbStoreErrIdxesArr);
      }
    } else {
      if (idxOfIdx >= 0) {
        const newDbStoreErrIdxesArr = [...dbStoresErrIdxesArr];
        newDbStoreErrIdxesArr.splice(idxOfIdx, 1);
        setDbStoresErrIdxesArr(newDbStoreErrIdxesArr);
      }
    }

    setDbStoresArr(newDbStoresArr);
  }

  React.useEffect(() => {
    if (createDbAddDatastoreReqsCount !== createDbAddDatastoreReqsCountRef.current) {
      createDbAddDatastoreReqsCountRef.current = createDbAddDatastoreReqsCount;

      const newDbStoresArr = [...dbStoresArr];

      newDbStoresArr.push({
        dbStoreName: ""
      });

      setDbStoresArr(newDbStoresArr);
    }

    console.log("newDbStoreErrIdxesArr", dbStoresErrIdxesArr);
  }, [ createDbAddDatastoreReqsCount, createDbAddDatastoreReqsCountRef, dbStoresArr, dbStoresErrIdxesArr ]);

  return (<Paper className="trmrk-indexeddb-create-db">
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
        dbStoreNameChanged={createDbStoreNameChangedHandler(idx)} /> ) }
  </Paper>);
}
