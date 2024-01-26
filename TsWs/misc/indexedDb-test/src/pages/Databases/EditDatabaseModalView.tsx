import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import trmrk from "trmrk";

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatabaseNameValidationMsg,
  getDfDatabaseNumberValidationMsg,
  dfDatabaseNumberValidationMsg,
  IDbObjectStoreInfo,
  getCreateDbRequestErrMsg
} from "../../services/indexedDb";

import { EditedDbObjectStore, EditedDatabase, mapObjectStoresAgg, convertObjectStore } from "../../services/indexedDbData";

import EditDatastore from "./EditDatastore";
import ExistingDataStoresList from "./ExistingDataStoresList";

export default function EditDatabaseModalView({
    dbToEdit,
    mainElRef,
    modalClosed
  }: {
    dbToEdit?: EditedDatabase | null | undefined,
    mainElRef: React.ForwardedRef<Element>
    modalClosed: (saved: boolean) => void
  }) {
  const dfDbVersionNumber = dbToEdit ? (dbToEdit.databaseVersion ?? 1) + 1 : null;

  const existingDbStoresRef = useRef<EditedDbObjectStore[]>(
    mapObjectStoresAgg(dbToEdit?.datastores ?? []));

  const addedDbStoresRef = useRef<EditedDbObjectStore[]>([]);

  const [ databaseName, setDatabaseName ] = useState<string>(dbToEdit?.databaseName ?? "");
  const [ databaseMinVersionNumber, setDatabaseMinVersionNumber ] = useState(dfDbVersionNumber ?? 1);
  const [ databaseVersionNumber, setDatabaseVersionNumber ] = useState<number | null>(dfDbVersionNumber);
  const [ databaseVersion, setDatabaseVersion ] = useState<string>(dfDbVersionNumber?.toString() ?? "");

  const [ existingDbStores, setExistingDbStores ] = useState<EditedDbObjectStore[]>(existingDbStoresRef.current);
  const [ addedDbStores, setAddedDbStores ] = useState<EditedDbObjectStore[]>(addedDbStoresRef.current);

  const [ saving, setSaving ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);
  const [ warning, setWarning ] = useState<string | null>(null);

  const [ databaseNameValidationError, setDatabaseNameValidationError ] = useState<string | null>(null);
  const [ databaseVersionValidationError, setDatabaseVersionValidationError ] = useState<string | null>(null);

  const validateDatabaseName = (text: string) => {
    let err: string | null = null;

    if (!trmrk.isNonEmptyStr(text)) {
      err = dfDatabaseNameValidationMsg;
    }

    return err;
  }

  const validateDatabaseNumber = (text: string): [ string | null, number | null ] => {
    let err: string | null = null;
    let value: number | null = null;

    if (trmrk.isNonEmptyStr(text)) {
      try {
        value = parseInt(text);

        if (isNaN(value) || value <= 0) {
          value = null;
          err = getDfDatabaseNumberValidationMsg(databaseMinVersionNumber);
        } else if (dbToEdit) {
          if (value < databaseMinVersionNumber) {
            err = getDfDatabaseNumberValidationMsg(databaseMinVersionNumber);
          }
        }
      } catch (exc) {
        value = null;
        err = getDfDatabaseNumberValidationMsg(databaseMinVersionNumber);
      }
    } else if (dbToEdit) {
      err = getDfDatabaseNumberValidationMsg(databaseMinVersionNumber);
    }

    return [ err, value ];
  }

  const saveDatabaseClick = () => {
    setError(null);
    setWarning(null);

    let hasError = false;

    const addedStores = addedDbStoresRef.current.map(
      store => store.dataFactory.factories.findLast(obj => obj)!());

    if (addedStores.find(obj => obj.hasError)) {
      hasError = true;
      setError("Please fix the current errors before submiting the changes");
    } else if (databaseName && !databaseNameValidationError && !databaseVersionValidationError) {
      setSaving(true);
      var req = indexedDB.open(databaseName, databaseVersionNumber ?? undefined);

      attachDefaultHandlersToDbOpenRequest(req, dfDatabaseOpenErrMsg, success => {
        if (!hasError) {
          let errMsg: string | null = null;

          try {
            req.result.close();
          } catch (err) {
            hasError = true;
            errMsg = (err as Error).message ?? "Could not close the database connection";
          }
          
          setWarning(null);
          setError(errMsg);
          setSaving(false);

          if (success && !hasError) {
            modalClosed(true);
          }
        } else {
          setWarning(null);
          setSaving(false);
        }
      }, errMsg => {
        hasError = true;
        setError(errMsg);
      }, warnMsg => {
        setWarning(warnMsg);
      }, e => {
        try {
          const db = req.result;

          for (let store of existingDbStoresRef.current) {
            if (store.isDeleted) {
              db.deleteObjectStore(store.storeName);
            }
          }

          for (let store of addedStores) {
            db.createObjectStore(store.storeName, {
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
    } else if (!databaseName) {
      hasError = true;
      setDatabaseNameValidationError(dfDatabaseNameValidationMsg);
    }
  }

  const cancelCreateDatabaseClick = () => {
    modalClosed(false);
  }

  const onDatabaseNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    setDatabaseName(text);

    const err = validateDatabaseName(text);
    setDatabaseNameValidationError(err);
  }

  const onDatabaseVersionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    setDatabaseVersion(text);

    const [ err, value ] = validateDatabaseNumber(text);
    setDatabaseVersionValidationError(err);
    setDatabaseVersionNumber(value);
  }

  const removeExistingStore = (store: EditedDbObjectStore) => {
    const idx = existingDbStoresRef.current.findIndex(obj => obj.uuid === store.uuid);

    if (idx >= 0) {
      const newDbStores = [...existingDbStoresRef.current];
      const dbStore = {...store};

      dbStore.isDeleted = !dbStore.isDeleted;
      newDbStores[idx] = dbStore;

      setExistingDbStores(newDbStores);
    }
  }

  const removeAddedStore = (store: EditedDbObjectStore) => {
    const idx = addedDbStoresRef.current.findIndex(obj => obj.uuid === store.uuid);

    if (idx >= 0) {
      const newDbStores = [...addedDbStoresRef.current];
      newDbStores.splice(idx, 1);
      setAddedDbStores(newDbStores);
    }
  }

  const onAddDatastoreClick = () => {
    const newDbStore = convertObjectStore({
        storeName: ""
      } as IDbObjectStoreInfo);

    const newAddedDbStores = [...addedDbStoresRef.current, newDbStore];
    setAddedDbStores(newAddedDbStores);
  }

  useEffect(() => {
    existingDbStoresRef.current = existingDbStores;
    addedDbStoresRef.current = addedDbStores;
  }, [ existingDbStores, addedDbStores, databaseVersionNumber, databaseMinVersionNumber, existingDbStoresRef, addedDbStoresRef ]);

  return (<DialogContent className="trmrk-modal trmrk-modal-full-viewport" ref={mainElRef} tabIndex={-1}>
      <Typography id="trmrk-modal-title" variant="h5" component="h2">
        { dbToEdit ? "Edit database" : "Create database" }
      </Typography>
      <Box className="trmrk-form-field">
        <InputLabel>Database name</InputLabel>
        { dbToEdit ? <Box className="trmrk-value">{ dbToEdit.databaseName }</Box> : <TextField
          required
          value={databaseName}
          onChange={onDatabaseNameChanged}
          fullWidth={true}
        /> }
        { databaseNameValidationError ? <Typography className="trmrk-error">{ databaseNameValidationError }</Typography> : null }
      </Box>
      <Box className="trmrk-form-field">
        <InputLabel>Database version</InputLabel>
        <TextField
          value={databaseVersion}
          onChange={onDatabaseVersionChanged}
        />
        { databaseVersionValidationError ? <Typography className="trmrk-error">{ databaseVersionValidationError }</Typography> : null }
      </Box>
      
      <Typography variant="h6" component="h3">
        { (existingDbStores.length + addedDbStores.length) ? "Data Stores" : "No Data Stores" }
      </Typography>
      <ExistingDataStoresList dbStores={existingDbStores} isEditable={true} datastoreDelete={removeExistingStore} />

      { addedDbStores.map(dataStore =>
        <EditDatastore key={dataStore.uuid} initialData={dataStore} datastoreDelete={() => removeAddedStore(dataStore)} />) }
      
      <IconButton onClick={onAddDatastoreClick}><AddIcon /></IconButton>
      { error ? <Box className="trmrk-form-field"><label className="trmrk-error">{ error }</label></Box> : null }
      { warning ? <Box className="trmrk-form-field"><label className="trmrk-warning">{ warning }</label></Box> : null }
      { saving ? <Box className="trmrk-loading dot-elastic" sx={{ left: "1em" }}></Box> : null }
      <Box className="trmrk-form-field">
        <Button className="trmrk-main-button" disabled={saving} sx={{ color: "#080" }} onClick={saveDatabaseClick}>Save</Button>
        <Button className="trmrk-main-button" disabled={saving} onClick={cancelCreateDatabaseClick}>Cancel</Button>
      </Box>
    </DialogContent>);
  }
