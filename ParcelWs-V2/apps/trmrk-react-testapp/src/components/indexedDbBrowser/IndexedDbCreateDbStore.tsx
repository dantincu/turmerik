import React from "react";
import { useSelector } from "react-redux";

import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { FormGroup } from "@mui/material";

import { IndexedDbDatabase, IndexedDbStore } from "./models";

export interface IndexedDbCreateDbStoreProps {
  model: IndexedDbStore;
  dbStoreNameChanged: (newDbStoreName: string, hasError: boolean) => void;
  autoIncrementChanged: (newAutoIncrement: boolean) => void;
  keyPathChanged: (newKeyPath: string, hasError: boolean) => void;
}

export default function IndexedDbCreateDbStore(
  props: IndexedDbCreateDbStoreProps
) {
  const [ dbStoreName, setDbStoreName ] = React.useState(props.model.dbStoreName);
  const [ dbStoreNameErr, setDbStoreNameErr ] = React.useState<string | null>(null);

  const [ autoIncrement, setAutoIncrement ] = React.useState(props.model.autoIncrement);

  const [ keyPath, setKeyPath ] = React.useState(props.model.keyPath);
  const [ keyPathErr, setKeyPathErr ] = React.useState<string | null>(null);

  const dbStoreNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbStoreName = e.target.value;
    setDbStoreName(newDbStoreName);
    let newDbStoreNameErr: string | null = null;

    if (newDbStoreName.length === 0) {
      newDbStoreNameErr = "The DB Store name is required"
    } else {
      newDbStoreNameErr = null
    }

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
    let newkeyPathErr: string | null = null;

    if (newKeyPath.length === 0) {
      newkeyPathErr = "The Key Path is required"
    } else {
      newkeyPathErr = null
    }

    setKeyPathErr(newkeyPathErr);
    props.keyPathChanged(newKeyPath, !!newkeyPathErr);
  }

  React.useEffect(() => {
  }, [ props.model.dbStoreName, dbStoreNameErr, props.model.autoIncrement, props.model.keyPath, keyPathErr ] );

  return (<div className="trmrk-indexeddb-create-dbstore">
    <FormGroup className="trmrk-form-group">
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbStoreName" required>DB Store Name</InputLabel>
        <TextField name="dbStoreName" onChange={dbStoreNameChanged} value={dbStoreName} required fullWidth />
        { dbStoreNameErr ? <FormHelperText error>{dbStoreNameErr}</FormHelperText> : null }
      </FormControl>
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="autoIncrement" required>Auto increment</InputLabel>
        <Checkbox name="autoIncrement" className="trmrk-checkbox" onChange={autoIncrementChanged} value={autoIncrement} />
      </FormControl>
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="autoIncrement" required>Key Path</InputLabel>
        <TextField name="autoIncrement" className="trmrk-textarea" onChange={keyPathChanged} value={keyPath} required multiline fullWidth />
        { keyPathErr ? <FormHelperText error>{keyPathErr}</FormHelperText> : null }
      </FormControl>
    </FormGroup>
  </div>);
}
