import React from "react";
import Typography from "@mui/material/Typography";

export interface IndexDbBrowserAppBarContentProps {
  basePath: string;
}

export default function IndexDbBrowserAppBarContent(
  props: IndexDbBrowserAppBarContentProps
  ) {
  React.useEffect(() => {

  }, [ props.basePath ] );

  return (<div className="trmrk-indexeddb-browser-app-bar-content">
    <Typography variant="h4" component="h1" className="trmrk-page-title">IndexedDb Databases</Typography>
  </div>);
}
