import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import styled from "@emotion/styled";

import { appRoutes, routes, getRoute } from "../../services/routes";

import ErrorEl from "../../components/error/ErrorEl";
import CreateDatabaseModalView from "./CreateDatabaseModalView";
import DeleteDatabaseModalView from "./DeleteDatabaseModalView";

export default function DatabasesListPage({
  }: {
  }) {
  const [ databases, setDatabases ] = useState<IDBDatabaseInfo[] | null>(null);
  const [ error, setError ] = useState<Error | any | null>(null);

  const [ createDatabaseModalIsOpen, setCreateDatabaseModalIsOpen ] = useState(false);
  const [ databaseToDelete, setDatabaseToDelete ] = useState<IDBDatabaseInfo | null>(null);

  const mainActionButtonsDisabled = !databases && !error;

  const navigate = useNavigate();

  const createDatabaseClick = () => {
    setCreateDatabaseModalIsOpen(true);
  }

  const createDatabaseModalClosed = (saved: boolean) => {
    setCreateDatabaseModalIsOpen(false);

    if (saved) {
      setDatabases(null);
    }
  }

  const deleteDatabaseModalIsClosed = (deleted: boolean) => {
    setDatabaseToDelete(null);

    if (deleted) {
      setDatabases(null);
    }
  }

  const databaseClick = (database: IDBDatabaseInfo) => {
    const route = getRoute(routes.databases, database.name);
    navigate(route);
  }

  const deleteDatabaseClick = (database: IDBDatabaseInfo) => {
    setDatabaseToDelete(database);
  }

  const loadDatabases = () => {
    indexedDB.databases().then(databases => {
      setDatabases(databases);
    }, reason => {
      setError(reason);
    });
  }

  useEffect(() => {
    if (!databases && !error) {
      loadDatabases();
    }
  }, [ databases, error ]);

  const CreateDatabaseModalViewEl = React.forwardRef<Element>((props, ref) => (
    <CreateDatabaseModalView modalClosed={createDatabaseModalClosed} mainElRef={ref} />));
    
  const DeleteDatabaseModalViewEl = React.forwardRef<Element, { databaseName: string | undefined }>(({ databaseName }, ref) => (
    <DeleteDatabaseModalView databaseName={databaseName} modalClosed={deleteDatabaseModalIsClosed} mainElRef={ref} />));

  return (<Box className="trmrk-page trmrk-databases-list-page">
    <Typography variant="h5" component="h1">Existing databases</Typography>
    <Box className="trmrk-page-actions">
      <IconButton disabled={mainActionButtonsDisabled} className="trmrk-main-icon-button" onClick={createDatabaseClick}>
        <AddIcon className="trmrk-add-icon" /></IconButton>
    </Box>
    { databases ? <ul className="trmrk-databases-list">{ databases.map(db => <li key={db.name} className="trmrk-databases-list-item">
      <Box className="trmrk-item-label" onClick={() => databaseClick(db)}>{ db.name }</Box>
      <Box className="trmrk-item-summary">
        <Box className="trmrk-summary-item">
          <span className="trmrk-name">Version:</span>
          <span className="trmrk-value">{ db.version }</span>
        </Box>
      </Box>
      <Box className=".trmrk-item-action-buttons" onClick={() => deleteDatabaseClick(db)}>
        <IconButton className="trmrk-icon-button"><DeleteIcon className="trmrk-delete-icon" /></IconButton>
      </Box>
    </li>) }</ul> : error ? <ErrorEl
      errCaption={"Could not load databases"}
      errMessage={error.message?.toString() ?? "Something went wrong"} /> : <Box
        className="trmrk-loading dot-elastic" sx={{ left: "1em" }}></Box> }
      <Modal
        open={createDatabaseModalIsOpen}
        hideBackdrop={true}
      >
        <CreateDatabaseModalViewEl />
      </Modal>
      <Modal
        open={!!databaseToDelete}
        hideBackdrop={true}
      >
        <DeleteDatabaseModalViewEl databaseName={databaseToDelete?.name} />
      </Modal>
  </Box>);
}
