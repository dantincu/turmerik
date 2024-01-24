import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from "@mui/icons-material/Delete";

import trmrk from "trmrk";

import { MtblRefValue } from "trmrk/src/core";

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatastoreCreateErrMsg,
  dfDatastoreNameValidationMsg,
  getErrMsg
} from "../../services/indexedDb";

import { EditedDbObjectStore } from "../../services/indexedDbData";

export default function EditDatastore({
    initialData,
  }: {
    initialData: EditedDbObjectStore
  }) {
  const [ datastoreName, setDatastoreName ] = useState<string>(initialData.storeName);
  const [ datastoreAutoIncrement, setDatastoreAutoIncrement ] = useState(initialData.autoIncrement);
  const [ datastoreKeyPathStr, setDatastoreKeyPathStr ] = useState<string>(initialData.keyPathStr);

  const [ datastoreNameValidationError, setDatastoreNameValidationError ] = useState<string | null>(null);
  const [ datastoreKeyPathValidationError, setDatastoreKeyPathValidationError ] = useState<string | null>(null);

  const validateDatastoreName = (text: string) => {
    let err: string | null = null;

    if (!trmrk.isNonEmptyStr(text)) {
      err = dfDatastoreNameValidationMsg;
    }

    return err;
  }

  const validateDatastoreKeyPath = (text: string) => {
    let err: string | null = null;
    return err;
  }

  const onAutoIncrementChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setDatastoreAutoIncrement(checked);
  }

  const onDatastoreNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    setDatastoreName(text);

    const err = validateDatastoreName(text);
    setDatastoreNameValidationError(err);
  }

  const onDatastoreKeyPathChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.currentTarget.value;
    setDatastoreKeyPathStr(text);

    const err = validateDatastoreKeyPath(text);
    setDatastoreKeyPathValidationError(err);
  }

  const dataFactory = () => ({
    storeName: datastoreName,
    autoIncrement: datastoreAutoIncrement,
    keyPathStr: datastoreKeyPathStr,
    hasError: !!(datastoreNameValidationError || datastoreKeyPathValidationError)
  } as EditedDbObjectStore);

  useEffect(() => {
    initialData.dataFactory.subscribe(dataFactory);

    return () => {
      initialData.dataFactory.unsubscribe(dataFactory);
    };
  }, []);

  return (<Box className="trmrk-edit-item trmrk-edit-datastore" sx={{
        border: "1px solid #888",
        marginTop: "1em",
        padding: "1em",
        borderRadius: "5px",
        position: "relative"
      }}>
      <IconButton sx={{ position: "absolute", top: "0em", right: "0em" }} onClick={() => initialData.onRemoved()}><DeleteIcon /></IconButton>
      <Box className="trmrk-form-field">
        <InputLabel>Datastore name</InputLabel>
        <TextField
          required
          value={datastoreName}
          onChange={onDatastoreNameChanged}
          fullWidth={true}
        />
        { datastoreNameValidationError ? <Typography className="trmrk-error">{ datastoreNameValidationError }</Typography> : null }
      </Box>
      <Box className="trmrk-form-field">
        <InputLabel>Autoincrement</InputLabel><Checkbox value={datastoreAutoIncrement} onChange={onAutoIncrementChanged} />
      </Box>
      <Box className="trmrk-form-field">
        <InputLabel>Key path</InputLabel>
        <TextField
          required
          value={datastoreKeyPathStr}
          onChange={onDatastoreKeyPathChanged}
          fullWidth={true}
          multiline={true}
        />
        { datastoreKeyPathValidationError ? <Typography className="trmrk-error">{ datastoreKeyPathValidationError }</Typography> : null }
      </Box>
    </Box>);
  }
