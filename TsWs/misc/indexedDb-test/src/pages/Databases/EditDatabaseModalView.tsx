import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import { v4 as uuidv4 } from 'uuid';

import trmrk from "trmrk";

import ErrorEl from "../../components/error/ErrorEl";

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatabaseNameValidationMsg,
  getDfDatabaseNumberValidationMsg,
  dfDatabaseNumberValidationMsg,
  IDbObjectStoreInfo
} from "../../services/indexedDb";

import { EditedDbObjectStore, EditedDbObjectStoreImpl, EditedDatabase } from "./DataTypes";

import EditDatastore from "./EditDatastore";

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
  const minVersionNumber = dfDbVersionNumber ?? 1;
  const databaseNumberValidationMsg = dbToEdit ? dfDatabaseNumberValidationMsg : getDfDatabaseNumberValidationMsg(minVersionNumber);

  const dbStoresRef = React.useRef<EditedDbObjectStore[]>([]);

  const removeStore = (store: EditedDbObjectStore) => {
    console.log("removeStore", store, dbStoresRef.current);
    const idx = dbStoresRef.current!.findIndex(obj => obj.uuid === store.uuid);

    if (idx >= 0) {
      console.log("removeStore", store, idx);
      const newDbStores = [...dbStoresRef.current!];
      newDbStores.splice(idx, 1);
      setDbStores(newDbStores);
    }
  }

  const convertDataStore = (store: IDbObjectStoreInfo) => {
    const retStore: EditedDbObjectStore = new EditedDbObjectStoreImpl({
      ...store,
      uuid: uuidv4(),
      onRemoved: () => removeStore(retStore)} as EditedDbObjectStore);

    return retStore;
  };

  dbStoresRef.current = dbToEdit?.datastores.map(store => convertDataStore(store)) ?? []

  const [ databaseName, setDatabaseName ] = useState<string>(dbToEdit?.databaseName ?? "");
  const [ databaseVersionNumber, setDatabaseVersionNumber ] = useState<number | null>(dfDbVersionNumber);
  const [ databaseVersion, setDatabaseVersion ] = useState<string>(dfDbVersionNumber?.toString() ?? "");
  const [ dbStores, setDbStores ] = useState<EditedDbObjectStore[]>(dbStoresRef.current);

  const [ saving, setSaving ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);
  const [ warning, setwarning ] = useState<string | null>(null);

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
          err = databaseNumberValidationMsg;
        } else if (dbToEdit) {
          if (value < minVersionNumber) {
            err = databaseNumberValidationMsg;
          }
        }
      } catch (exc) {
        value = null;
        err = databaseNumberValidationMsg;
      }
    } else if (dbToEdit) {
      err = databaseNumberValidationMsg;
    }

    return [ err, value ];
  }

  const saveDatabaseClick = () => {
    setError(null);
    setwarning(null);

    if (databaseName && !databaseNameValidationError && !databaseVersionValidationError) {
      setSaving(true);
      
      var req = indexedDB.open(databaseName, databaseVersionNumber ?? undefined);

      attachDefaultHandlersToDbOpenRequest(req, dfDatabaseOpenErrMsg, success => {
        setSaving(false);

        if (success) {
          req.result.close();
          modalClosed(true);
        }
      }, errMsg => {
        setError(errMsg);
      }, warnMsg => {
        setwarning(warnMsg);
      });
    } else if (!databaseName) {
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

  const onAddDatastoreClick = () => {
    dbStoresRef.current = [...dbStores, convertDataStore({} as IDbObjectStoreInfo)];
    setDbStores(dbStoresRef.current);
  }

  useEffect(() => {
    dbStoresRef.current = dbStores;
  }, [ dbStores, dbStoresRef ]);

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
        { dbStores.length ? "Data Stores" : "No Data Stores" }
      </Typography>
      { dbStores.map(dataStore =>
        <EditDatastore key={dataStore.uuid} initialData={dataStore} />) }
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
