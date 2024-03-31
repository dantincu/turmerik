import React from "react";
import { useSelector } from "react-redux";

import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/Input';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import FormHelperText from '@mui/material/FormHelperText';
import Box from "@mui/material/Box";

import trmrk from "trmrk";

import { IndexedDbDatabase, IndexedDbStore } from "./models";

import { deserializeKeyPath } from "../../../services/indexedDb";

export interface IndexedDbEditDbStoreProps {
  model: IndexedDbStore;
  idx: number;
  validateReqsCount?: number | null | undefined;
  dbStoreNameChanged: (newDbStoreName: string, hasError: boolean) => void;
  autoIncrementChanged: (newAutoIncrement: boolean) => void;
  keyPathChanged: (newKeyPath: string, hasError: boolean) => void;
  dbStoreNameHasErrorChanged: (hasError: boolean) => void;
  keyPathHasErrorChanged: (hasError: boolean) => void;
}

export const dbStoreNameReqErrMsg = "The DB Store name is required";
export const dbStoreKeyPathReqErrMsg = "The Key Path name is required";
export const dbStoreKeyPathValidErrMsg = "The Key Path name is invalid";

export const validateDbStoreName = (dbStoreName: string) => {
  let dbStoreNameErr: string | null = null;

  if (dbStoreName.length === 0) {
    dbStoreNameErr = dbStoreNameReqErrMsg;
  }

  return dbStoreNameErr;
}

export const validateDbStoreKeyPath = (dbStoreKeyPath: string, fullValidation?: boolean | null | undefined) => {
  let dbStoreKeyPathErr: string | null = null;

  if (dbStoreKeyPath.length === 0) {
    dbStoreKeyPathErr = dbStoreKeyPathReqErrMsg;
  } else if (fullValidation) {
    const keyPathParts = deserializeKeyPath(dbStoreKeyPath, true) as string[];

    if (keyPathParts.filter(part => !trmrk.isNonEmptyStr(part, true)).length > 0) {
      dbStoreKeyPathErr = dbStoreKeyPathValidErrMsg;
    }
  }

  return dbStoreKeyPathErr;
}

export default function IndexedDbEditDbStore(
  props: IndexedDbEditDbStoreProps
) {
  const [ validateReqsCount, setValidateReqsCount ] = React.useState(props.validateReqsCount ?? 0);
  const [ dbStoreName, setDbStoreName ] = React.useState(props.model.dbStore.storeName);
  const [ dbStoreNameErr, setDbStoreNameErr ] = React.useState<string | null>(null);

  const [ autoIncrement, setAutoIncrement ] = React.useState(props.model.dbStore.autoIncrement);

  const [ keyPath, setKeyPath ] = React.useState(props.model.dbStore.serializedKeyPath);
  const [ keyPathErr, setKeyPathErr ] = React.useState<string | null>(null);

  const autoIncrementElRef = React.createRef<HTMLButtonElement>();

  const dbStoreNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbStoreName = e.target.value;
    setDbStoreName(newDbStoreName);

    const newDbStoreNameErr = validateDbStoreName(newDbStoreName);
    setDbStoreNameErr(newDbStoreNameErr);

    props.dbStoreNameChanged(newDbStoreName, !!newDbStoreNameErr);
  }

  const autoIncrementChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (props.model.canBeEdited) {
      setAutoIncrement(checked);
      props.autoIncrementChanged(checked);
    }
  }

  const autoIncrementClicked = (e: MouseEvent): any => {
    e.preventDefault();
    return false;
  }

  const keyPathChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newKeyPath = e.target.value;
    setKeyPath(newKeyPath);

    const newkeyPathErr = validateDbStoreKeyPath(newKeyPath);
    setKeyPathErr(newkeyPathErr);

    props.keyPathChanged(newKeyPath, !!newkeyPathErr);
  }

  React.useEffect(() => {
    const autoIncrementEl = autoIncrementElRef.current;
    let autoIncrementCheckBox: HTMLInputElement | null = null;

    if (!props.model.canBeEdited && autoIncrementEl) {
      autoIncrementCheckBox = autoIncrementEl.querySelector("input[type=checkbox]") as HTMLInputElement;
      autoIncrementCheckBox.addEventListener("click", autoIncrementClicked);
    }

    if ((props.validateReqsCount ?? 0) !== validateReqsCount) {
      setValidateReqsCount(props.validateReqsCount ?? 0);

      const newDbStoreNameErr = validateDbStoreName(dbStoreName);
      const newkeyPathErr = validateDbStoreKeyPath(keyPath, true);

      setDbStoreNameErr(newDbStoreNameErr);
      setKeyPathErr(newkeyPathErr);

      props.dbStoreNameHasErrorChanged((newDbStoreNameErr ?? null) !== null);
      props.keyPathHasErrorChanged((newkeyPathErr ?? null) !== null);
    }

    if (autoIncrementCheckBox) {
      autoIncrementCheckBox.removeEventListener("click", autoIncrementClicked);
    }
  }, [ props.model.dbStore.storeName,
    dbStoreName,
    dbStoreNameErr,
    props.model.dbStore.autoIncrement,
    props.model.dbStore.keyPath,
    keyPath,
    keyPathErr,
    props.idx,
    props.validateReqsCount,
    validateReqsCount,
    autoIncrementElRef ] );

  return (<Paper className="trmrk-flex-rows-group">
    <Box className="trmrk-flex-row">
      <Box className="trmrk-cell"><label className="trmrk-title" htmlFor={`dbStoreName_${props.idx}`}>DB Store Name</label></Box>
      <Box className="trmrk-cell"><Input id={`dbStoreName_${props.idx}`} onChange={dbStoreNameChanged} value={dbStoreName}
        required fullWidth className={[ "trmrk-input", props.model.canBeEdited ? "" : "trmrk-readonly" ].join(" ")}
        readOnly={!props.model.canBeEdited} /></Box>
        { (dbStoreNameErr ?? null) !== null ? <Box className="trmrk-cell"><FormHelperText error className="trmrk-wrap-content">
          {dbStoreNameErr}</FormHelperText></Box> : null }
    </Box>
    <Box className="trmrk-flex-row">
      <Box className="trmrk-cell"><label className="trmrk-title" htmlFor={`dbStoreAutoincrement_${props.idx}`}>Auto increment</label></Box>
      <Box className="trmrk-cell"><Checkbox id={`dbStoreAutoincrement_${props.idx}`} ref={autoIncrementElRef}
        className={[ "trmrk-checkbox", "trmrk-input", props.model.canBeEdited ? "" : "trmrk-readonly" ].join(" ")}
        onChange={autoIncrementChanged} readOnly={!props.model.canBeEdited} checked={autoIncrement} value={autoIncrement} /></Box>
    </Box>
    <Box className="trmrk-flex-row">
      <Box className="trmrk-cell"><label className="trmrk-title" htmlFor={`dbStoreKeyPath_${props.idx}`}>Key Path</label></Box>
      <Box className="trmrk-cell"><TextareaAutosize id={`dbStoreKeyPath_${props.idx}`}
        className={[ "trmrk-textarea-autosize", "trmrk-input", props.model.canBeEdited ? "" : "trmrk-readonly" ].join(" ")}
        onChange={keyPathChanged} value={keyPath} readOnly={!props.model.canBeEdited} required /></Box>
        { (keyPathErr ?? null) !== null ? <Box className="trmrk-cell"><FormHelperText error className="trmrk-wrap-content">
          {keyPathErr}</FormHelperText></Box> : null }
    </Box>
  </Paper>);
}
