import React from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import { devModuleIndexedDbBrowserReducers } from "../../store/devModuleIndexedDbBrowserSlice";

export interface IndexDbCreateDbAppBarContentProps {
}

export default function IndexDbCreateDbAppBarContent(
  props: IndexDbCreateDbAppBarContentProps
  ) {
    const dispatch = useDispatch();

  const addDbStoreClicked = () => {
    dispatch(devModuleIndexedDbBrowserReducers.incCreateDbAddDatastoreReqsCount());
  }

  return (<div className="trmrk-indexeddb-create-db-app-bar-content">
    <IconButton className="trmrk-icon-btn" sx={{ marginLeft: "5em" }} onClick={addDbStoreClicked}><AddIcon /></IconButton>
    <Typography variant="h4" component="h1" className="trmrk-page-title">Create Database</Typography>
    </div>);
}
