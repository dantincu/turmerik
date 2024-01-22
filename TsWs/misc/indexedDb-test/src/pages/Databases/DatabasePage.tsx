import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import Modal from '@mui/material/Modal';
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

import trmrk from "trmrk";

import { attachDefaultHandlersToDbOpenRequest, databaseOpenErrMsg, databaseDeleteErrMsg, getObjectStoreNames, getErrMsg } from "../../services/indexedDb";

import { setCurrentRoutePathName, getCurrentRoutePathName } from "../../store/appDataSlice";
import { routes, getRoute, defaultPageNotFoundHtmlDocTitle } from "../../services/routes";
import { appRoutes, dbNameParam } from "../../services/routes";
import DeleteDatabaseModalView from "./DeleteDatabaseModalView";
import CreateDatastoreModalView from "../DataStores/CreateDatastoreModalView";
import DeleteDatastoreModalView from "../DataStores/DeleteDatastoreModalView";
import NotFound from "../../components/notFound/NotFound";

export default function DatabasePage({
    showDataStoresListDetails
  }: {
    showDataStoresListDetails: boolean
  }) {
  const dispatch = useDispatch();
  const currentRoutePathName = useSelector(getCurrentRoutePathName);
  const [ searchParams ] = useSearchParams();
  const dbName = searchParams.get(dbNameParam);
  const isValidDbName = trmrk.isNonEmptyStr(dbName);

  const [ isLoading, setIsloading ] = useState(false);
  const [ isLoaded, setIsLoaded ] = useState(false);

  const [ dbVersion, setDbVersion ] = useState<number | null>(null);
  const [ showDeleteDatabaseModal, setShowDeleteDatabaseModal ] = useState(false);
  const [ objectStoreNames, setObjectStoreNames ] = useState<string[] | null>(null);
  const [ datastoreToDelete, setDatastoreToDelete ] = useState<string | null>(null);
  const [ error, setError ] = useState<Error | any | null>(null);
  const [ warning, setwarning ] = useState<string | null>(null);

  const navigate = useNavigate();

  const deleteDatabaseClick = () => {
    setShowDeleteDatabaseModal(true);
  }

  const deleteDatabaseModalIsClosed = (deleted: boolean) => {
    setShowDeleteDatabaseModal(false);

    if (deleted) {
      navigate(appRoutes.databasesRoot);
    }
  }

  const datastoreClick = (datastore: string) => {
    const route = getRoute(routes.datastore.pathname, dbName, datastore);
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

          attachDefaultHandlersToDbOpenRequest(req, databaseOpenErrMsg, success => { 
            setIsLoaded(true);
            setIsloading(false);

            if (success) {
              const db = req.result;
              setDbVersion(db.version);
              
              try {
                const objStoreNames = getObjectStoreNames(db);
                setObjectStoreNames(objStoreNames);
              } catch (err) {
                setError(getErrMsg(err));
              }
            }
          }, errMsg => {
            setIsLoaded(true);
            setIsloading(false);
            setError(errMsg);
          }, warnMsg => {
            setwarning(warnMsg);
          });
        }
      }
    } else {
      dispatch(setCurrentRoutePathName(defaultPageNotFoundHtmlDocTitle));
    }
  }, [ currentRoutePathName, isLoading, isLoaded, dbVersion ]);

  const DeleteDatabaseModalViewEl = React.forwardRef<Element>((props, ref) => (
    <DeleteDatabaseModalView databaseName={dbName!} modalClosed={deleteDatabaseModalIsClosed} mainElRef={ref} />));

  const objectStoresUrl = getRoute({
    routeName: appRoutes.datastoresRoot,
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
    </Box>
    <Box className="trmrk-form-field">
      <InputLabel className="trmrk-name">Database name</InputLabel>
      <Box className="trmrk-value">{ dbName }</Box>
    </Box>
    <Box className="trmrk-form-field">
      <InputLabel className="trmrk-name">Database version</InputLabel>
      <Box className="trmrk-value">{ dbVersion }</Box>
    </Box>
    <Typography variant="h6" component="h1"><Link to={objectStoresUrl}>Object Stores</Link></Typography>
    { objectStoreNames ? <ul className="trmrk-page-list">{ objectStoreNames.map(name =>
      <li key={name} className="trmrk-page-list-item" onClick={() => datastoreClick(name)}>
        <Box className="trmrk-item-label">{ name }</Box>
      </li>) }
    </ul> : null }
    <Modal
      open={showDeleteDatabaseModal}
      hideBackdrop={true}
    >
      <DeleteDatabaseModalViewEl />
    </Modal>
  </Box>);
  }
}
