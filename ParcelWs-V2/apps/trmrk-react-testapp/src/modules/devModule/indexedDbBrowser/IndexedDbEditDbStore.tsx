import React from "react";
import { useSelector } from "react-redux";

import Checkbox from '@mui/material/Checkbox';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Box from "@mui/material/Box";

import { IndexedDbDatabase, IndexedDbStore } from "./models";

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

const dbStoreNameReqErrMsg = "The DB Store name is required";
const dbStoreKeyPathReqErrMsg = "The Key Path name is required";

const validateDbStoreName = (dbStoreName: string) => {
  let dbStoreNameErr: string | null = null;

  if (dbStoreName.length === 0) {
    dbStoreNameErr = dbStoreNameReqErrMsg;
  }

  return dbStoreNameErr;
}

const validateDbStoreKeyPath = (dbStoreKeyPath: string) => {
  let dbStoreKeyPathErr: string | null = null;

  if (dbStoreKeyPath.length === 0) {
    dbStoreKeyPathErr = dbStoreKeyPathReqErrMsg;
  }

  return dbStoreKeyPathErr;
}

export default function IndexedDbEditDbStore(
  props: IndexedDbEditDbStoreProps
) {
  const [ validateReqsCount, setValidateReqsCount ] = React.useState(props.validateReqsCount ?? 0);
  const [ dbStoreName, setDbStoreName ] = React.useState(props.model.dbStoreName);
  const [ dbStoreNameErr, setDbStoreNameErr ] = React.useState<string | null>(null);

  const [ autoIncrement, setAutoIncrement ] = React.useState(props.model.autoIncrement);

  const [ keyPath, setKeyPath ] = React.useState(props.model.keyPath);
  const [ keyPathErr, setKeyPathErr ] = React.useState<string | null>(null);

  const dbStoreNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbStoreName = e.target.value;
    setDbStoreName(newDbStoreName);

    const newDbStoreNameErr = validateDbStoreName(newDbStoreName);
    setDbStoreNameErr(newDbStoreNameErr);

    props.dbStoreNameChanged(newDbStoreName, !!newDbStoreNameErr);
  }

  const autoIncrementChanged = (e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setAutoIncrement(checked);
    props.autoIncrementChanged(checked);
  }

  const keyPathChanged = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newKeyPath = e.target.value;
    setKeyPath(newKeyPath);

    const newkeyPathErr = validateDbStoreKeyPath(newKeyPath);
    setKeyPathErr(newkeyPathErr);

    props.keyPathChanged(newKeyPath, !!newkeyPathErr);
  }

  React.useEffect(() => {
    if ((props.validateReqsCount ?? 0) !== validateReqsCount) {
      setValidateReqsCount(props.validateReqsCount ?? 0);

      const newDbStoreNameErr = validateDbStoreName(dbStoreName);
      const newkeyPathErr = validateDbStoreKeyPath(keyPath);

      setDbStoreNameErr(newDbStoreNameErr);
      setKeyPathErr(newkeyPathErr);

      props.dbStoreNameHasErrorChanged((newDbStoreNameErr ?? null) !== null);
      props.keyPathHasErrorChanged((newkeyPathErr ?? null) !== null);
    }
  }, [ props.model.dbStoreName,
    dbStoreName,
    dbStoreNameErr,
    props.model.autoIncrement,
    props.model.keyPath,
    keyPath,
    keyPathErr,
    props.idx,
    props.validateReqsCount,
    validateReqsCount ] );

  return (<Box className="trmrk-flex-rows-group">
    <Box className="trmrk-flex-row">
      <Box className="trmrk-cell"><label htmlFor={`dbStoreName_${props.idx}`}>DB Store Name</label></Box>
      <Box className="trmrk-cell"><Input id={`dbStoreName_${props.idx}`} onChange={dbStoreNameChanged} value={dbStoreName} required fullWidth /></Box>
        { (dbStoreNameErr ?? null) !== null ? <Box className="trmrk-cell"><FormHelperText error>{dbStoreNameErr}</FormHelperText></Box> : null }
    </Box>
    <Box className="trmrk-flex-row">
      <Box className="trmrk-cell"><label htmlFor={`dbStoreAutoincrement_${props.idx}`}>Auto increment</label></Box>
      <Box className="trmrk-cell"><Checkbox id={`dbStoreAutoincrement_${props.idx}`} className="trmrk-checkbox" onChange={autoIncrementChanged} value={autoIncrement} /></Box>
    </Box>
    <Box className="trmrk-flex-row">
      <Box className="trmrk-cell"><label htmlFor={`dbStoreKeyPath_${props.idx}`}>Key Path</label></Box>
      <Box className="trmrk-cell trmrk-height-x2"><TextField id={`dbStoreKeyPath_${props.idx}`}
        className="trmrk-textarea" onChange={keyPathChanged} value={keyPath}
        required multiline fullWidth /></Box>
        { (keyPathErr ?? null) !== null ? <Box className="trmrk-cell"><FormHelperText error>{keyPathErr}</FormHelperText></Box> : null }
    </Box>
  </Box>);
}
