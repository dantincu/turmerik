import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { v4 as uuidv4 } from 'uuid';

import trmrk from "trmrk";

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatabaseDeleteErrMsg,
  getObjectStoresInfoAgg,
  getErrMsg,
  IDbObjectStoreInfo,
  IDbIndexInfo
} from "../../services/indexedDb";

import { setCurrentRoutePathName, getCurrentRoutePathName } from "../../store/appDataSlice";
import { routes, getRoute, defaultPageNotFoundHtmlDocTitle } from "../../services/routes";
import { appRoutes, dbNameParam, dbStoreNameParam, dbStoreRecordPkParam } from "../../services/routes";
import { EditedDbObjectStore, EditedDbObjectStoreImpl } from "./DataTypes";

import DeleteDatabaseModalView from "./DeleteDatabaseModalView";
import EditDatabaseModalView from "./EditDatabaseModalView";
import NotFound from "../../components/notFound/NotFound";

export default function DatabasePage({
  }: {
  }) {
  const dispatch = useDispatch();
  const currentRoutePathName = useSelector(getCurrentRoutePathName);
  const [ searchParams ] = useSearchParams();

  const dbName = searchParams.get(dbNameParam);
  const dbStoreName = searchParams.get(dbStoreNameParam);
  const dbStoreRecordPk = searchParams.get(dbStoreRecordPkParam);

  const isValidDbName = trmrk.isNonEmptyStr(dbName);

  const [ isLoading, setIsloading ] = useState(false);
  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ dbVersion, setDbVersion ] = useState<number | null>(null);
  const [ dbStores, setDbStores ] = useState<IDbObjectStoreInfo[] | null>(null);

  const [ error, setError ] = useState<Error | any | null>(null);
  const [ warning, setWarning ] = useState<string | null>(null);

  const [ showDeleteDatabaseModal, setShowDeleteDatabaseModal ] = useState(false);
  const [ showEditDatabaseModal, setShowEditDatabaseModal ] = useState(false);

  const navigate = useNavigate();

  const deleteDatabaseClick = () => {
    setShowDeleteDatabaseModal(true);
  }

  const editDatabaseClick = () => {
    setShowEditDatabaseModal(true);
  }

  const deleteDatabaseModalIsClosed = (deleted: boolean) => {
    setShowDeleteDatabaseModal(false);

    if (deleted) {
      navigate(appRoutes.databasesRoot);
    }
  }

  const editDatabaseModalIsClosed = (saved: boolean) => {
    setShowEditDatabaseModal(false);

    if (saved) {
      setIsLoaded(false);
    }
  }

  const datastoreClick = (datastore: IDbObjectStoreInfo) => {
    const route = getRoute(routes.database.pathname, dbName, datastore.storeName);
    navigate(route);
  }

  useEffect(() => {
    if (currentRoutePathName !== routes.database.pathname) {
      dispatch(setCurrentRoutePathName(routes.database.pathname));
    } else if (isValidDbName) {
      if (!isLoaded) {
        if (!isLoading) {
          setIsloading(true);
        } else {
          var req = indexedDB.open(dbName!);

          attachDefaultHandlersToDbOpenRequest(req, dfDatabaseOpenErrMsg, success => { 
            setIsLoaded(true);
            setIsloading(false);

            if (success) {
              const db = req.result;
              setDbVersion(db.version);
              
              try {
                const objStoreNames = getObjectStoresInfoAgg(db);
                setDbStores(objStoreNames);
              } catch (err) {
                setError(getErrMsg(err));
              }
            }
          }, errMsg => {
            setIsLoaded(true);
            setIsloading(false);
            setError(errMsg);
          }, warnMsg => {
            setWarning(warnMsg);
          });
        }
      }
    } else {
      dispatch(setCurrentRoutePathName(defaultPageNotFoundHtmlDocTitle));
    }
  }, [ currentRoutePathName, isLoading, isLoaded, dbVersion ]);

  const DeleteDatabaseModalViewEl = React.forwardRef<Element>((props, ref) => (
    <DeleteDatabaseModalView databaseName={dbName!} modalClosed={deleteDatabaseModalIsClosed} mainElRef={ref} />));

  const EditDatabaseModalViewEl = React.forwardRef<Element>((props, ref) => (
    <EditDatabaseModalView dbToEdit={{
      databaseName: dbName!,
      databaseVersion: dbVersion ?? 1,
      datastores: dbStores!
    }} modalClosed={editDatabaseModalIsClosed} mainElRef={ref} />));

  const objectStoresUrl = getRoute({
    routeName: appRoutes.database,
    dbName,
    startsWithSlash: false
  });

  if (!isValidDbName) {
    return (<NotFound />);
  } else if (isLoading) {
    return (<Box className="trmrk-page trmrk-database-page">
    <Box className="trmrk-loading dot-elastic" sx={{ left: "1em" }}></Box>
  </Box>);
  } else {
    return (<Box className="trmrk-page trmrk-database-page">
    <Box className="trmrk-page-actions">
      <IconButton disabled={isLoading} className="trmrk-main-icon-button" onClick={deleteDatabaseClick}>
        <DeleteIcon className="trmrk-delete-icon" /></IconButton>
      <IconButton disabled={isLoading} className="trmrk-main-icon-button" onClick={editDatabaseClick}>
        <EditIcon className="trmrk-edit-icon" /></IconButton>
    </Box>
    <Box className="trmrk-form-field">
      <InputLabel className="trmrk-name">Database name</InputLabel>
      <Box className="trmrk-value">{ dbName }</Box>
    </Box>
    <Box className="trmrk-form-field">
      <InputLabel className="trmrk-name">Database version</InputLabel>
      <Box className="trmrk-value">{ dbVersion }</Box>
    </Box>
    { error ? <Box className="trmrk-form-field"><label className="trmrk-error">{ error }</label></Box> : null }
    { warning ? <Box className="trmrk-form-field"><label className="trmrk-warning">{ warning }</label></Box> : null }

    { dbStoreName ? <Link to={objectStoresUrl}>All Data Stores</Link> : null }

    <Typography variant="h6" component="h2">
      { dbStoreName ? "Data Store" : dbStores?.length ? "Data Stores" : "No Data Stores" }
    </Typography>
    
    { dbStores ? <ul className="trmrk-page-list">{ dbStores.map(dataStore =>
      <li key={dataStore.storeName} className="trmrk-page-list-item" onClick={() => datastoreClick(dataStore)}>
        <Box className="trmrk-item-label">{ dataStore.storeName }</Box>
      </li>) }
    </ul> : null }
    <Modal
      open={showDeleteDatabaseModal}
      hideBackdrop={true}
    >
      <DeleteDatabaseModalViewEl />
    </Modal>
    <Modal
      open={showEditDatabaseModal}
      hideBackdrop={true}
    >
      <EditDatabaseModalViewEl />
    </Modal>
  </Box>);
  }
}
