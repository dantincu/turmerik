import React from "react";
import { useSelector } from "react-redux";

import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import { FormGroup } from "@mui/material";

import { devModuleIndexedDbBrowserSelectors } from "../../store/devModuleIndexedDbBrowserSlice";

export interface IndexDbCreateDbProps {
}

export default function IndexDbCreateDb(
  props: IndexDbCreateDbProps
  ) {
  const [ dbName, setDbName ] = React.useState("");
  const [ dbNameErr, setDbNameErr ] = React.useState<string | null>(null);

  const [ dbVersion, setDbVersion ] = React.useState<number | null>(1);
  const [ dbVersionErr, setDbVersionErr ] = React.useState<string | null>(null);

  const createDbAddDatastoreReqsCount = useSelector(
    devModuleIndexedDbBrowserSelectors.getCreateDbAddDatastoreReqsCount);

  const createDbAddDatastoreReqsCountRef = React.useRef(0);

  const dbNameChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbName = e.target.value;
    setDbName(newDbName);

    if (newDbName.length === 0) {
      setDbNameErr("The database name is required");
    } else {
      setDbNameErr(null);
    }
  }

  const dbVersionChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDbVersionStr = e.target.value;

    if (newDbVersionStr.length > 0) {
      const newDbversion = parseFloat(newDbVersionStr);
      setDbVersion(newDbversion);
      setDbVersionErr(null);
    } else {
      setDbVersion(null);
      setDbVersionErr("The database version number is required");
    }
  }

  React.useEffect(() => {
    if (createDbAddDatastoreReqsCount !== createDbAddDatastoreReqsCountRef.current) {
      console.log("createDbAddDatastoreReqsCount", createDbAddDatastoreReqsCount, createDbAddDatastoreReqsCountRef.current);
      createDbAddDatastoreReqsCountRef.current = createDbAddDatastoreReqsCount;
    }
  }, [ createDbAddDatastoreReqsCount, createDbAddDatastoreReqsCountRef ]);

  return (<div className="trmrk-indexeddb-create-db">
    <FormGroup className="trmrk-form-group">
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbName" required>Database name</InputLabel>
        <Input name="dbName" onChange={dbNameChanged} value={dbName} fullWidth />
        { typeof dbNameErr === "string" ? <FormHelperText error>{dbNameErr}</FormHelperText> : null }
      </FormControl>
      <FormControl className="trmrk-form-field">
        <InputLabel htmlFor="dbVersion" required>Database version number</InputLabel>
        <Input name="dbVersion" type="number" onChange={dbVersionChanged} value={dbVersion} fullWidth />
        { typeof dbVersionErr === "string" ? <FormHelperText error>{dbVersionErr}</FormHelperText> : null }
      </FormControl>
    </FormGroup>
    <FormControl className="trmrk-form-field">
    <Typography component="h2" variant="h5" className="trmrk-form-group-title">Db Stores</Typography>
    </FormControl>
  </div>);
}
