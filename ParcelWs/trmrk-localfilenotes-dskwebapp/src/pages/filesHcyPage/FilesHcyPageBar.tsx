import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { core as trmrk } from "trmrk";

import AddressBar from "../../components/addressBar/AddressBar";
import { AppDataContext, updateAppTitle } from "../../app/AppContext";
import { validateRootedPath } from "../../services/notes/notePath";

export default function FilesHcyPageBar() {
  const appData = React.useContext(AppDataContext);
  const navigate = useNavigate();

  const onAddressChanged = (newAddress: string) => {
    console.log("newAddress", newAddress);
    const idnf = encodeURIComponent(newAddress);
    navigate(`files/${idnf}`);
  }

  const addressValidator = (newAddress: string) => {
    let errMsg: string | null = null;

    if (trmrk.isNonEmptyStr(newAddress)) {
      errMsg = validateRootedPath(appData.appConfig, newAddress);
    }

    return errMsg;
  };

  return (<div className="trmrk-app-page-bar trmrk-files-hcy-page-bar">
      <IconButton className="trmrk-icon-button"><ArrowLeftIcon /></IconButton>
      <IconButton className="trmrk-icon-button"><ArrowRightIcon /></IconButton>
      <AddressBar address={appData.currentIdnf ?? ""}
        onAddressChanged={onAddressChanged}
        addressValidator={addressValidator}
        className="trmrk-main-address-bar" />
    </div>)
}
