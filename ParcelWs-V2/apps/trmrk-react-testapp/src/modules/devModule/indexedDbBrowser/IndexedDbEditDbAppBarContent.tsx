import React from "react";
import { useDispatch } from "react-redux";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import { devModuleIndexedDbBrowserReducers } from "../../../store/devModuleIndexedDbBrowserSlice";

export interface IndexedDbEditDbAppBarContentProps {
}

export default function IndexedDbEditDbAppBarContent(
  props: IndexedDbEditDbAppBarContentProps
  ) {
  const dispatch = useDispatch();

  const addDbStoreClicked = () => {
    dispatch(devModuleIndexedDbBrowserReducers.incEditDbAddDatastoreReqsCount());
  }

  return (<div className="trmrk-indexeddb-edit-db-app-bar-content">
    <IconButton className="trmrk-icon-btn" sx={{ marginLeft: "5em" }} onClick={addDbStoreClicked}><AddIcon /></IconButton>
    <Typography variant="h4" component="h1" className="trmrk-page-title">Edit Database</Typography>
    </div>);
}
