import React from "react";
import { useSelector } from "react-redux";

import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { FormGroup } from "@mui/material";

import { IndexedDbDatabase, IndexedDbStore } from "./models";

export interface IndexedDbCreateDbStoreProps {
  model: IndexedDbStore;
  dbStoreNameChanged: (newDbStoreName: string, hasError: boolean) => void;
}

export default function IndexedDbCreateDbStore(
  props: IndexedDbCreateDbStoreProps
) {
  const [ dbStoreName, setDbStoreName ] = React.useState(props.model.dbStoreName);
  const [ dbStoreNameErr, setDbStoreNameErr ] = React.useState<string | null>(null);

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

  React.useEffect(() => {

  }, [ props.model.dbStoreName ] );

  return (<div className="trmrk-indexeddb-create-dbstore">
    <FormGroup className="trmrk-form-group">
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbName" required>DB Store Name</InputLabel>
        <Input name="dbName" onChange={dbStoreNameChanged} value={dbStoreName} fullWidth />
        { typeof dbStoreNameErr === "string" ? <FormHelperText error>{dbStoreNameErr}</FormHelperText> : null }
      </FormControl>
    </FormGroup>
  </div>);
}
