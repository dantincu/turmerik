import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from "@mui/material/IconButton";
import Alert, { AlertColor } from "@mui/material/Alert";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import Snackbar from '@mui/material/Snackbar';

import IndexedDbEditDbStore, { IndexedDbEditDbStoreProps } from "./IndexedDbEditDbStore";
import { appBarSelectors, appBarReducers } from "../../../store/appBarDataSlice";
import { appDataSelectors, appDataReducers } from "../../../store/appDataSlice";

import { IndexedDbDatabase, IndexedDbStore } from "./models";
import LoadingDotPulse from '../../../components/loading/LoadingDotPulse';

import {
  attachDefaultHandlersToDbOpenRequest,
  dfDatabaseOpenErrMsg,
  dfDatabaseNameValidationMsg,
  getDfDatabaseNumberValidationMsg,
  dfDatabaseNumberValidationMsg,
  IDbObjectStoreInfo,
  getDbInfo,
  IDbDatabaseInfo,
  getCreateDbRequestErrMsg,
  getObjectStoresInfoAgg,
  deserializeKeyPath
} from "../../../services/indexedDb";

import { searchQuery } from "./data";

import { validateDbStoreKeyPath } from "./IndexedDbEditDbStore";

import { isMobile, isIPhone } from "trmrk-browser/src/domUtils/constants";

import AppBarsPanel from "../../../components/barsPanel/AppBarsPanel";
import TrmrkTextMagnifierPopover from "./TrmrkTextMagnifierPopover";
import MatUIIcon from "trmrk-react/src/components/icons/MatUIIcon";

export interface IndexedDbEditDbProps {
  basePath: string;
  dbName?: string | null | undefined;
  isNewDb: boolean | null | undefined;
  showCreateSuccessMsg?: boolean | null | undefined;
}

const dbNameReqErrMsg = "The database name is required";
const dbVersionNameReqErrMsg = "The database version number is required";
const dbVersionNameReqToBePositiveNumErrMsg = "The database version number must be a positive number";

const validateDbName = (dbName: string) => {
  let dbNameErr: string | null = null;

  if (dbName.length === 0) {
    dbNameErr = dbNameReqErrMsg;
  }

  return dbNameErr;
}

const validateDbVersionNumber = (dbVersionStr: string): [ string | null, number | null ] => {
  let dbVersionErr: string | null = null;
  let dbversion: number | null = null;

  if (dbVersionStr.length > 0) {
    dbversion = parseFloat(dbVersionStr);

    if (dbversion <= 0) {
      dbVersionErr = dbVersionNameReqToBePositiveNumErrMsg;
    }
  } else {
    dbVersionErr = dbVersionNameReqErrMsg;
  }

  return [ dbVersionErr, dbversion ];
}

export default function IndexedDbEditDb(
  props: IndexedDbEditDbProps
  ) {
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ db, setDb ] = React.useState<IDbDatabaseInfo | null>(null);
  const [ loadError, setLoadError ] = React.useState<string | null>((props.dbName ?? null) === null && !props.isNewDb ? "Database name is required" : null);
  const [ loadWarning, setLoadWarning ] = React.useState<string | null>(null);

  const [ dbName, setDbName ] = React.useState(props.dbName ?? "");
  const [ dbNameErr, setDbNameErr ] = React.useState<string | null>("");

  const [ nextDbVersionStr, setnextDbVersionStr ] = React.useState<string>("1");
  const [ nextDbVersion, setnextDbVersion ] = React.useState<number | null>(1);
  const [ nextDbVersionErr, setnextDbVersionErr ] = React.useState<string | null>(null);

  const [ dbStoresArr, setDbStoresArr ] = React.useState<IndexedDbStore[]>([]);
  const [ deletedDbStoresArr, setDeletedDbStoresArr ] = React.useState<IndexedDbStore[]>([]);
  const [ nextDbStoreId, setNextDbStoreId ] = React.useState(1);
  const [ scrollToBottom, setScrollToBottom ] = React.useState(false);

  const [ saving, setSaving ] = React.useState(false);
  const [ error, setError ] = React.useState<string | null>(null);
  const [ warning, setWarning ] = React.useState<string | null>(null);

  const [ editSuccessMsg, setEditSuccessMsg ] = React.useState(
    (props.showCreateSuccessMsg ?? false) === true ? "Database saved successfully" : "");
  
  const [ showEditResultMsg, setShowEditResultMsg ] = React.useState(props.showCreateSuccessMsg ?? false);
  const [ editResultMsgSeverity, setEditResultMsgSeverity ] = React.useState<AlertColor>(props.showCreateSuccessMsg ? "success" : "info");
  const [ validateDbStoresReqsCount, setValidateDbStoresReqsCount ] = React.useState(0);

  const [ showDbNameTextBoxMagnifier, setShowDbNameTextBoxMagnifier ] = React.useState(false);

  const isDarkMode = useSelector(appDataSelectors.getIsDarkMode);

  const bottomElRef = React.createRef<HTMLDivElement>();
  const dbNameTextBoxElRef = React.createRef<HTMLInputElement>();

  const [ dbNameTextBoxEl, setDbNameTextBoxEl ] = React.useState(dbNameTextBoxElRef.current);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onCreateSuccessMsgClose = React.useCallback(() => {
    setEditSuccessMsg("");
    setShowEditResultMsg(false);
  }, [])

  const dbNameChanged = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbName = e.target.value;
    setDbName(newDbName);

    const dbNameErr = validateDbName(newDbName);
    setDbNameErr(dbNameErr);
    refreshError(dbNameErr, nextDbVersionErr, dbStoresArr);
  }, [nextDbVersionErr, dbStoresArr])

  const dbVersionChanged = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbVersionStr = e.target.value;
    setnextDbVersionStr(newDbVersionStr);

    const [ dbVersionErr, newDbversion ] = validateDbVersionNumber(newDbVersionStr);

    setnextDbVersion(newDbversion);
    setnextDbVersionErr(dbVersionErr);
    refreshError(dbNameErr, dbVersionErr, dbStoresArr);
  }, [dbNameErr, dbStoresArr]);

  const addDbStoreClicked = React.useCallback(() => {
    const newDbStoresArr = [...dbStoresArr];

      newDbStoresArr.push({
        dbStore: {
          storeName: "",
          autoIncrement: true,
          keyPath: "",
          serializedKeyPath: "",
          indexes: [],
          indexNames: []
        },
        id: nextDbStoreId,
        dbStoreNameHasError: true,
        dbStoreKeyPathHasError: true,
        canBeEdited: true
      });

      setDbStoresArr(newDbStoresArr);
      setScrollToBottom(true);
      setNextDbStoreId(nextDbStoreId + 1);
  }, [dbStoresArr, nextDbStoreId]);

  const dbStoreRemoveClicked = (id: number, dbStoresArr: IndexedDbStore[]) => () => {
    const newDbStoresArr = [...dbStoresArr];
    const newDeletedDbStoresArr = [...deletedDbStoresArr];

    const idx = newDbStoresArr.findIndex(
      dbStore => dbStore.id === id
    );

    const dbStore = newDbStoresArr[idx];
    newDbStoresArr.splice(idx, 1);
    setDbStoresArr(newDbStoresArr);

    if (!dbStore.canBeEdited) {
      newDeletedDbStoresArr.splice(
        newDeletedDbStoresArr.length, 0, dbStore);
    
      setDeletedDbStoresArr(newDeletedDbStoresArr);      
    }
  };

  const getFormCanBeSubmitted = React.useCallback((
    dbNameErr: string | null,
    dbVersionErr: string | null,
    dbStoresArr: IndexedDbStore[]) => (dbNameErr ?? null) === null && (dbVersionErr ?? null) === null && (
      dbStoresArr.find(store => store.dbStoreNameHasError || store.dbStoreKeyPathHasError || validateDbStoreKeyPath(
        store.dbStore.serializedKeyPath
      ) !== null) ?? null) === null, []);

  const editDbStoreNameChangedHandler = (id: number, dbStoresArr: IndexedDbStore[]) => (newDbStoreName: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];

    const idx = newDbStoresArr.findIndex(
      dbStore => dbStore.id === id
    );

    const dbStore = newDbStoresArr[idx];

    dbStore.dbStore.storeName = newDbStoreName;
    dbStore.dbStoreNameHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, nextDbVersionErr, newDbStoresArr);
  };

  const editDbStoreAutoIncrementChangedHandler = (id: number, dbStoresArr: IndexedDbStore[]) => (newAutoIncrement: boolean) => {
    const newDbStoresArr = [...dbStoresArr];

    const idx = newDbStoresArr.findIndex(
      dbStore => dbStore.id === id
    );

    const dbStore = newDbStoresArr[idx];

    dbStore.dbStore.autoIncrement = newAutoIncrement;
    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, nextDbVersionErr, newDbStoresArr);
  };

  const editDbStoreKeyPathChangedHandler = (id: number, dbStoresArr: IndexedDbStore[]) => (newKeyPath: string, hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];

    const idx = newDbStoresArr.findIndex(
      dbStore => dbStore.id === id
    );

    const dbStore = newDbStoresArr[idx];

    dbStore.dbStore.serializedKeyPath = newKeyPath;
    dbStore.dbStoreKeyPathHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, nextDbVersionErr, newDbStoresArr);
  };

  const editDbStoreNameHasErrorChangedHandler = (id: number) => (hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];

    const idx = newDbStoresArr.findIndex(
      dbStore => dbStore.id === id
    );

    const dbStore = newDbStoresArr[idx];
    dbStore.dbStoreNameHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, nextDbVersionErr, newDbStoresArr);
  };

  const editDbStoreKeyPathHasErrorChangedHandler = (id: number) => (hasError: boolean) => {
    const newDbStoresArr = [...dbStoresArr];

    const idx = newDbStoresArr.findIndex(
      dbStore => dbStore.id === id
    );

    const dbStore = newDbStoresArr[idx];
    dbStore.dbStoreKeyPathHasError = hasError;

    setDbStoresArr(newDbStoresArr);
    refreshError(dbNameErr, nextDbVersionErr, newDbStoresArr);
  };

  const onHideDbNameTextBoxMagnifier = () => {
    setShowDbNameTextBoxMagnifier(false);
  }

  const onShowDbNameTextBoxMagnifier = () => {
    setShowDbNameTextBoxMagnifier(true);
  }

  const refreshError = React.useCallback((
    dbNameErr: string | null,
    dbVersionErr: string | null,
    dbStoresArr: IndexedDbStore[]) => {
    const formCanBeSubmitted = getFormCanBeSubmitted(dbNameErr, dbVersionErr, dbStoresArr);

    if (formCanBeSubmitted) {
      setError(null);
    }
  }, []);

  const load = React.useCallback(() => {
    var req = indexedDB.open(dbName);
    let hasError: boolean;
    
    attachDefaultHandlersToDbOpenRequest(req, dfDatabaseOpenErrMsg, success => {
      if (success) {
        let errMsg: string | null = null;

        try {
          const db = getDbInfo(req.result);
          setDb(db);
          const dbStores = getObjectStoresInfoAgg(req.result);

          const dbStoresArr = dbStores.map((store, idx) => ({
            id: idx + 1,
            dbStore: store,
            canBeEdited: false
          }) as IndexedDbStore);

          setNextDbStoreId(dbStoresArr.length + 1);
          setDbStoresArr(dbStoresArr);
          req.result.close();

          setDbName(db.name ?? "");
          setnextDbVersion((db.version ?? 1) + 1);
          setnextDbVersionStr(db.version?.toString() ?? "");

          setDbNameErr(null);
          setnextDbVersionErr(null);
        } catch (err) {
          hasError = true;
          errMsg = (err as Error).message ?? "Could not close the database connection";
        }
        
        setLoadWarning(null);
        setLoadError(errMsg);
      } else {
        setLoadWarning(null);
      }

      setIsLoading(false);
    },
    errMsg => {
      hasError = true;
      setLoadError(errMsg);
    }, warnMsg => {
      setLoadWarning(warnMsg);
    });
  }, []);

  const onSaveClick = React.useCallback(() => {
    setError(null);
    setWarning(null);

    let hasMigrationError = false;
    let migrated = false;

    const addedStoresArr = dbStoresArr.filter(
      store => store.canBeEdited).map(store => ({
        ...store,
        dbStore: {
          ...store.dbStore,
          keyPath: deserializeKeyPath(store.dbStore.serializedKeyPath)
        }
      }) as IndexedDbStore);

    if (!getFormCanBeSubmitted(dbNameErr, nextDbVersionErr, dbStoresArr)) {
      setError("Please fix the current errors before submiting the changes");
      setScrollToBottom(true);

      const dbNameErr = validateDbName(dbName);
      const [ dbVersionErr ] = validateDbVersionNumber(nextDbVersionStr);

      setDbNameErr(dbNameErr)
      setnextDbVersionErr(dbVersionErr);

      setValidateDbStoresReqsCount(validateDbStoresReqsCount + 1);
    } else {
      setSaving(true);
      var req = indexedDB.open(dbName, nextDbVersion ?? undefined);

      attachDefaultHandlersToDbOpenRequest(req, dfDatabaseOpenErrMsg, success => {
        if (success) {
          let errMsg: string | null = null;

          try {
            req.result.close();
          } catch (err) {
            errMsg = (err as Error).message ?? "Could not close the database connection";
          }
          
          setWarning(null);

          if (!hasMigrationError) {
            setError(errMsg);
            if ((errMsg ?? null) !== null) {
              setScrollToBottom(true);
            }
          }
        } else {
          setWarning(null);
        }

        setSaving(false);

        if (!migrated) {
          setEditResultMsgSeverity("info");
          setEditSuccessMsg("Database opened successfully");
          setShowEditResultMsg(true);
          // load();
        }
      }, errMsg => {
        setError(errMsg);
        setScrollToBottom(true);
      }, warnMsg => {
        setWarning(warnMsg);
        setScrollToBottom(true);
      }, e => {
        try {
          const db = req.result;

          for (let store of deletedDbStoresArr) {
            db.deleteObjectStore(store.dbStore.storeName);
          }

          for (let store of addedStoresArr) {
            db.createObjectStore(store.dbStore.storeName, {
              keyPath: store.dbStore.keyPath,
              autoIncrement: store.dbStore.autoIncrement,
            });
          }
        } catch (err) {
          hasMigrationError = true;
          const errMsg = (err as Error).message ?? "Could not upgrade the database";
          setError(errMsg);
          setScrollToBottom(true);
        }

        if (!hasMigrationError) {
          if (props.isNewDb) {
            const encodedDbName = encodeURIComponent(dbName);
            navigate(`${props.basePath}/edit-db?${searchQuery.showCreateSuccessMsg}=true&${searchQuery.dbName}=${encodedDbName}`);
          } else {
            migrated = true;
            setEditResultMsgSeverity("success");
            setEditSuccessMsg("Database saved successfully");
            setShowEditResultMsg(true);
            load();
          }
        }
      });
    }
  }, [ dbStoresArr, deletedDbStoresArr, nextDbVersion, dbName ]);

  const onCancelClick = React.useCallback(() => {
    navigate(props.basePath);
  }, []);

  React.useEffect(() => {
    const bottomEl = bottomElRef.current;

    if (dbNameTextBoxEl !== dbNameTextBoxElRef.current) {
      setDbNameTextBoxEl(dbNameTextBoxElRef.current);
    } else if (scrollToBottom) {
      setScrollToBottom(false);

      if (bottomEl) {
        bottomEl.scrollIntoView(false);
      }
    } else if (!props.isNewDb && (loadError ?? null) === null && (loadWarning ?? null) === null && !db) {
      if (!isLoading) {
        setIsLoading(true);
      } else {
        load();
      }
    }
  }, [ isLoading,
    loadError,
    loadWarning,
    db,
    props.dbName,
    dbName,
    nextDbVersion,
    dbStoresArr,
    nextDbStoreId,
    deletedDbStoresArr,
    saving,
    error,
    warning,
    dbNameErr,
    nextDbVersionErr,
    props.showCreateSuccessMsg,
    showEditResultMsg,
    props.isNewDb,
    validateDbStoresReqsCount,
    scrollToBottom,
    bottomElRef,
    showDbNameTextBoxMagnifier,
    dbNameTextBoxElRef,
    dbNameTextBoxEl,
    isDarkMode
  ]);

  return (<AppBarsPanel basePath={props.basePath}
      panelClassName="trmrk-page-panel"
      appBarSelectors={appBarSelectors}
      appBarReducers={appBarReducers}
      appDataSelectors={appDataSelectors}
      appDataReducers={appDataReducers}
      appHeaderChildren={<React.Fragment>
        <Typography variant="h4" component="span" className="trmrk-page-title">{ props.isNewDb ? "Create" : "Edit" } Database</Typography>
      </React.Fragment>}
      appFooterChildren={<React.Fragment>
        <IconButton className="trmrk-icon-btn" onClick={onCancelClick}><CancelIcon /></IconButton>
        <IconButton className="trmrk-icon-btn" onClick={onSaveClick}><SaveIcon /></IconButton>
        <IconButton className="trmrk-icon-btn" onClick={addDbStoreClicked}><AddIcon /></IconButton>
      </React.Fragment>}>
    <Box className="trmrk-panel-content trmrk-indexeddb-create-db">
      { isLoading ? <LoadingDotPulse /> : (loadError ?? null) !== null ?
        <FormHelperText error className="trmrk-form-helper-text-row">{loadError}</FormHelperText> : (
          loadWarning ?? null) !== null ? 
        <FormHelperText className="trmrk-warning trmrk-form-helper-text-row">{loadWarning}</FormHelperText>
         : <React.Fragment>
          <Paper className="trmrk-flex-rows-group">
            <Box className="trmrk-flex-row">
              <Box className="trmrk-cell">
                <label className="trmrk-title" htmlFor="dbName">Database name</label>
                <IconButton onClick={onShowDbNameTextBoxMagnifier}><MatUIIcon iconName="highlight_text_cursor" /></IconButton>
              </Box>
              <Box className="trmrk-cell">
                <Input id="dbName" onChange={dbNameChanged} value={dbName}
                  required fullWidth readOnly={!props.isNewDb} ref={dbNameTextBoxElRef}
                  className={[ "trmrk-input", props.isNewDb ? "" : "trmrk-readonly" ].join(" ")} /></Box>
            </Box>
            { (dbNameErr ?? null) !== null ? <FormHelperText error className="trmrk-form-helper-text-row">
              {dbNameErr}</FormHelperText> : null }
            <Box className="trmrk-flex-row">
              <Box className="trmrk-cell"><label className="trmrk-title" htmlFor="dbVersion">Next version number</label></Box>
              <Box className="trmrk-cell"><Input id="dbVersion" type="number" onChange={dbVersionChanged}
                value={nextDbVersion} required fullWidth inputProps={{ min: 1 }}
                className={[ "trmrk-input" ].join(" ")} /></Box>
            </Box>
            { (nextDbVersionErr ?? null) !== null ? <FormHelperText error className="trmrk-form-helper-text-row">
               {nextDbVersionErr}</FormHelperText> : null }
          </Paper>
          <Box className="trmrk-flex-row">
            <Box className="trmrk-cell">
            <Typography component="h2" variant="h5" className="trmrk-form-group-title">
              Db Stores <IconButton className="trmrk-icon-btn" onClick={addDbStoreClicked}><AddIcon /></IconButton></Typography>
            </Box>
          </Box>
          { dbStoresArr.map((dbStore, idx) => <IndexedDbEditDbStore
                model={dbStore} key={dbStore.id} idx={idx}
                validateReqsCount={validateDbStoresReqsCount}
                dbStoreNameChanged={editDbStoreNameChangedHandler(dbStore.id, dbStoresArr)}
                autoIncrementChanged={editDbStoreAutoIncrementChangedHandler(dbStore.id, dbStoresArr)}
                keyPathChanged={editDbStoreKeyPathChangedHandler(dbStore.id, dbStoresArr)}
                dbStoreNameHasErrorChanged={editDbStoreNameHasErrorChangedHandler(dbStore.id)}
                keyPathHasErrorChanged={editDbStoreKeyPathHasErrorChangedHandler(dbStore.id)}
                dbStoreDeleteClicked={dbStoreRemoveClicked(dbStore.id, dbStoresArr)}
                 /> ) }
            { (error ?? null) !== null ? 
              <FormHelperText error className="trmrk-form-helper-text-row">{error}</FormHelperText> : null }
            { (warning ?? null) !== null ? 
              <FormHelperText className="trmrk-warning trmrk-form-helper-text-row">{warning}</FormHelperText> : null }
          </React.Fragment> }
      <div ref={bottomElRef}></div>
      { dbNameTextBoxEl ? <TrmrkTextMagnifierPopover
        isOpen={showDbNameTextBoxMagnifier}
        isDarkMode={isDarkMode}
        anchorEl={dbNameTextBoxEl}
        handleClose={onHideDbNameTextBoxMagnifier}
        text={dbName}
            textIsReadonly={props.isNewDb} /> : null }
      <Snackbar open={showEditResultMsg} autoHideDuration={6000} onClose={onCreateSuccessMsgClose}>
        <Alert
          onClose={onCreateSuccessMsgClose}
          severity={editResultMsgSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          { editSuccessMsg }
        </Alert>
      </Snackbar>
    </Box>
  </AppBarsPanel>);
}
