import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';

import trmrk from "trmrk";

import ErrorEl from "../../components/error/ErrorEl";

export default function DeleteDatabaseModalView({
    databaseName,
    mainElRef,
    modalClosed
  }: {
    databaseName: string | undefined,
    mainElRef: React.ForwardedRef<Element>
    modalClosed: (saved: boolean) => void
  }) {
  const [ deleting, setDeleting ] = useState(false);
  const [ error, setError ] = useState<Error | any | null>(null);

  const getErrMsg = (req: IDBRequest, e: IDBVersionChangeEvent) => {
    const errMSg = [
      req.error?.message?.toString(),
      `Old Version: ${e.oldVersion}`,
      `New Version: ${e.newVersion}`].join("; ");

    return errMSg;
  }

  const saveDatabaseClick = () => {
    setDeleting(true);
    
    var req = indexedDB.deleteDatabase(databaseName!);

    req.onsuccess = (e: Event) => {
      setDeleting(false);
      modalClosed(true);
    }

    req.onerror = (e: Event) => {
      setDeleting(false);
      setError(req.error);
    };

    req.onblocked = (e: IDBVersionChangeEvent) => {
      setDeleting(false);
      const errMSg = getErrMsg(req, e);
      setError(errMSg);
    };

    req.onupgradeneeded = (e: IDBVersionChangeEvent) => {
      setDeleting(false);
      const errMSg = getErrMsg(req, e);
      setError(errMSg);
    };
  }

  const cancelCreateDatabaseClick = () => {
    modalClosed(false);
  }

  return (<DialogContent className="trmrk-modal" ref={mainElRef} tabIndex={-1}>
      <Typography id="trmrk-modal-title" variant="h5" component="h2">
        Delete database
      </Typography>
      <Box className="trmrk-form-field" sx={{ display: "flex" }}>
        <InputLabel>Are you sure you want to delete database <br /> <label className="trmrk-item-label">{ databaseName }</label> ?</InputLabel>
      </Box>
      { error ? <Box className="trmrk-form-field"><label className="trmrk-error">{ error.message?.toString() ?? "Something went wrong..." }</label></Box> : null }
      <Box className="trmrk-form-field">
        <Button className="trmrk-main-button" disabled={deleting} sx={{ color: "#F00" }} onClick={saveDatabaseClick}>Delete</Button>
        <Button className="trmrk-main-button" disabled={deleting} onClick={cancelCreateDatabaseClick}>Cancel</Button>
      </Box>
    </DialogContent>);
  }
