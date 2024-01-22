import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';

import trmrk from "trmrk";

import { MtblRefValue } from "trmrk/src/core";

import { attachDefaultHandlersToDbOpenRequest, dfDatabaseOpenErrMsg, dfDatastoreCreateErrMsg, dfDatastoreNameValidationMsg, getErrMsg } from "../../services/indexedDb";

import { EditedDbObjectStore } from "./DataTypes";

export default function EditDatastoreModalView({
    initialData,
    dataFactory
  }: {
    initialData: EditedDbObjectStore
    dataFactory: React.MutableRefObject<(() => EditedDbObjectStore) | null>
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

  useEffect(() => {
    dataFactory.current = () => ({
      storeName: datastoreName,
      autoIncrement: datastoreAutoIncrement,
      keyPathStr: datastoreKeyPathStr,
      hasError: !!(datastoreNameValidationError || datastoreKeyPathValidationError)
    } as EditedDbObjectStore);

    return () => {
      dataFactory.current = null;
    };
  }, []);

  return (<Box className="trmrk-edit-item trmrk-edit-datastore">
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
