import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import { } from "../../services/indexedDb";

import { appRoutes, dbNameParam } from "../../services/routes";

export default function DatabasePage({
  }: {
  }) {
  const { dbName } = useParams();

  const [ database, setDatabase ] = useState<IDBDatabaseInfo | null>(null);
  const [ error, setError ] = useState<Error | any | null>(null);

  useEffect(() => {
    
  });

  return (<Box className="trmrk-page trmrk-database-page"></Box>);
}
