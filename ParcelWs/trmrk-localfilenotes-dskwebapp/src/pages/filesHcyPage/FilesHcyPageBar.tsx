import React from "react";
import { useParams } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';

import { core as trmrk } from "trmrk";

import AddressBar from "../../components/addressBar/AddressBar";
import { AppDataContext, updateAppTitle } from "../../app/AppContext";
import { validateRootedPath } from "../../services/notes/notePath";

export default function FilesHcyPageBar() {
  const { idnf } = useParams();
  const appData = React.useContext(AppDataContext);

  React.useEffect(() => {
    updateAppTitle(appData, idnf);
  }, []);

  if (trmrk.isNonEmptyStr(idnf, true)) { 
    
  }

  const onAddressChanged = (newAddress: string) => {

  }

  const addressValidator = (newAddress: string) => {
    let errMsg: string | null = null;

    if (trmrk.isNonEmptyStr(newAddress)) {
      errMsg = validateRootedPath(appData.appConfig, newAddress);
    }

    return errMsg;
  };

  return (<div className="trmrk-app-page-bar trmrk-files-hcy-page-bar">
    <span className="trmrk-label">File Path</span>
    <AddressBar address={idnf ?? "asdf"} onAddressChanged={onAddressChanged} addressValidator={addressValidator}
      className="trmrk-main-address-bar" /></div>)
}
