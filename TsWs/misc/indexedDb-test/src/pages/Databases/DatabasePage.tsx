import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

import { attachDefaultHandlersToDbOpenRequest, databaseCreateErrMsg, databaseNameValidationMsg, databaseNumberValidationMsg } from "../../services/indexedDb";

import { appRoutes, dbNameParam } from "../../services/routes";

export default function DatabasePage({
  }: {
  }) {
  const { dbName } = useParams();

  const [ isLoading, setIsloading ] = useState(false);
  const [ database, setDatabase ] = useState<IDBDatabase | null>(null);
  const [ error, setError ] = useState<Error | any | null>(null);
  const [ warning, setwarning ] = useState<string | null>(null);

  console.log("dbName", dbName);

  useEffect(() => {
    if (!database && !error && !warning) {
      if (!isLoading) {
        setIsloading(true);
      } else {
        var req = indexedDB.open(dbName!);

        attachDefaultHandlersToDbOpenRequest(req, databaseCreateErrMsg, success => {
          setIsloading(false);

          if (success) {
            setDatabase(req.result);
          }
        }, errMsg => {
          setError(errMsg);
        }, warnMsg => {
          setwarning(warnMsg);
        });
      }
    }
  }, [ isLoading ]);

  if (isLoading) {
    return (<Box className="trmrk-page trmrk-database-page">
    <Typography variant="h5" component="h1">Database</Typography>
    <Box className="trmrk-loading dot-elastic" sx={{ left: "1em" }}></Box>
  </Box>);
  } else {
    return (<Box className="trmrk-page trmrk-database-page">
    <Typography variant="h5" component="h1">Database</Typography>
    <Box className="trmrk-form-field">
    <InputLabel>Database name</InputLabel>
    <Box>{ database?.name }</Box>
    </Box>
  </Box>);
  }
}
