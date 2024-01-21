import React, { useEffect, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import DialogContent from '@mui/material/DialogContent';

import trmrk from "trmrk";

import ErrorEl from "../../components/error/ErrorEl";

import { attachDefaultHandlersToDbOpenRequest, databaseDeleteErrMsg } from "../../services/indexedDb";

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
  const [ error, setError ] = useState<string | null>(null);
  const [ warning, setwarning ] = useState<string | null>(null);

  const deleteDatabaseClick = () => {
    setError(null);
    setwarning(null);
    setDeleting(true);
    
    var req = indexedDB.deleteDatabase(databaseName!);

    attachDefaultHandlersToDbOpenRequest(req, databaseDeleteErrMsg, success => {
      setDeleting(false);

      if (success) {
        modalClosed(true);
      }
    }, errMsg => {
      setError(errMsg);
    }, warnMsg => {
      setwarning(warnMsg);
    });
  }

  const cancelDeleteDatabaseClick = () => {
    modalClosed(false);
  }

  return (<DialogContent className="trmrk-modal" ref={mainElRef} tabIndex={-1}>
      <Typography id="trmrk-modal-title" variant="h5" component="h2">
        Delete database
      </Typography>
      <p>Are you sure you want to delete database</p>
      <p className="trmrk-item-label">{ databaseName }</p>
      <p>?</p>
      { error ? <Box className="trmrk-form-field"><label className="trmrk-error">{ error }</label></Box> : null }
      { warning ? <Box className="trmrk-form-field"><label className="trmrk-warning">{ warning }</label></Box> : null }
      { deleting ? <Box className="trmrk-loading dot-elastic" sx={{ left: "1em" }}></Box> : null }
      <Box className="trmrk-form-field">
        <Button className="trmrk-main-button" disabled={deleting} sx={{ color: "#F00" }} onClick={deleteDatabaseClick}>Delete</Button>
        <Button className="trmrk-main-button" disabled={deleting} onClick={cancelDeleteDatabaseClick}>Cancel</Button>
      </Box>
    </DialogContent>);
  }
