import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';

import trmrk from "trmrk";

import { attachDefaultHandlersToDbOpenRequest, databaseOpenErrMsg, datastoreCreateErrMsg, datastoreNameValidationMsg, getErrMsg } from "../../services/indexedDb";

export default function CreateDatastoreModalView({
    databaseName,
    mainElRef,
    modalClosed
  }: {
    databaseName: string,
    mainElRef: React.ForwardedRef<Element>
    modalClosed: (saved: boolean) => void
  }) {
  const [ datastoreName, setDatastoreName ] = useState<string>("");
  const [ datastoreAutoIncrement, setDatastoreAutoIncrement ] = useState(false);
  const [ datastoreKeyPathStr, setDatastoreKeyPathStr ] = useState<string>("");

  const [ saving, setSaving ] = useState(false);
  const [ error, setError ] = useState<string | null>(null);
  const [ warning, setwarning ] = useState<string | null>(null);

  const [ datastoreNameValidationError, setDatastoreNameValidationError ] = useState<string | null>(null);
  const [ datastoreKeyPathValidationError, setDatastoreKeyPathValidationError ] = useState<string | null>(null);

  const validateDatastoreName = (text: string) => {
    let err: string | null = null;

    if (!trmrk.isNonEmptyStr(text)) {
      err = datastoreNameValidationMsg;
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

  const getDatastoreKeyPath = () => {
    let datastoreKeyPath: string[] | null = null;

    const keyPath = datastoreKeyPathStr.split('\n').map(
        part => part.trim()
      ).filter(part => part);
    
    if (keyPath.length) {
      datastoreKeyPath = keyPath;
    }

    return datastoreKeyPath;
  }

  const saveDatastoreClick = () => {
    setError(null);
    setwarning(null);

    if (datastoreName && !datastoreNameValidationError && !datastoreKeyPathValidationError) {
      setSaving(true);
      
      const datastoreKeyPath = getDatastoreKeyPath();
      var req = indexedDB.open(databaseName!);

      attachDefaultHandlersToDbOpenRequest(req, databaseOpenErrMsg, success => {
        if (success) {
          try {
            const db = req.result;

            db.createObjectStore(datastoreName, {
              autoIncrement: datastoreAutoIncrement,
              keyPath: datastoreKeyPath,
            });

            modalClosed(true);
          } catch (err) {
            const errMsg = getErrMsg(err);
            setError(errMsg);
          }

          setSaving(false);
        }
      }, errMsg => {
        setError(errMsg);
      }, warnMsg => {
        setwarning(warnMsg);
      });
    } else if (!datastoreName) {
      setDatastoreNameValidationError(datastoreNameValidationMsg);
    }
  }

  const cancelCreateDatastoreClick = () => {
    modalClosed(false);
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

  return (<DialogContent className="trmrk-modal trmrk-modal-full-viewport" ref={mainElRef} tabIndex={-1}>
      <Typography id="trmrk-modal-title" variant="h5" component="h2">
        Create datastore
      </Typography>
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
        { datastoreNameValidationError ? <Typography className="trmrk-error">{ datastoreNameValidationError }</Typography> : null }
      </Box>
      { error ? <Box className="trmrk-form-field"><label className="trmrk-error">{ error }</label></Box> : null }
      { warning ? <Box className="trmrk-form-field"><label className="trmrk-warning">{ warning }</label></Box> : null }
      { saving ? <Box className="trmrk-loading dot-elastic" sx={{ left: "1em" }}></Box> : null }
      <Box className="trmrk-form-field">
        <Button className="trmrk-main-button" disabled={saving} sx={{ color: "#080" }} onClick={saveDatastoreClick}>Save</Button>
        <Button className="trmrk-main-button" disabled={saving} onClick={cancelCreateDatastoreClick}>Cancel</Button>
      </Box>
    </DialogContent>);
  }
