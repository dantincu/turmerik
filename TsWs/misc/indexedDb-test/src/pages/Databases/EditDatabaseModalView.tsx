import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';

import trmrk from "trmrk";

import ErrorEl from "../../components/error/ErrorEl";

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatabaseNameValidationMsg,
  getDfDatabaseNumberValidationMsg,
  dfDatabaseNumberValidationMsg
} from "../../services/indexedDb";

import { EditedDbObjectStore, EditedDatabase } from "./DataTypes";

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

  const [ databaseName, setDatabaseName ] = useState<string>(dbToEdit?.databaseName ?? "");
  const [ databaseVersionNumber, setDatabaseVersionNumber ] = useState<number | null>(dfDbVersionNumber);
  const [ databaseVersion, setDatabaseVersion ] = useState<string>(dfDbVersionNumber?.toString() ?? "");

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

  return (<DialogContent className="trmrk-modal trmrk-modal-full-viewport" ref={mainElRef} tabIndex={-1}>
      <Typography id="trmrk-modal-title" variant="h5" component="h2">
        Create database
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
      { error ? <Box className="trmrk-form-field"><label className="trmrk-error">{ error }</label></Box> : null }
      { warning ? <Box className="trmrk-form-field"><label className="trmrk-warning">{ warning }</label></Box> : null }
      { saving ? <Box className="trmrk-loading dot-elastic" sx={{ left: "1em" }}></Box> : null }
      <Box className="trmrk-form-field">
        <Button className="trmrk-main-button" disabled={saving} sx={{ color: "#080" }} onClick={saveDatabaseClick}>Save</Button>
        <Button className="trmrk-main-button" disabled={saving} onClick={cancelCreateDatabaseClick}>Cancel</Button>
      </Box>
    </DialogContent>);
  }
