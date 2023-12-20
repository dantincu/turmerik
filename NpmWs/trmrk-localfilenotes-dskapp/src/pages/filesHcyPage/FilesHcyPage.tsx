import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import { reducer, actions, AppData } from "../../app/app-data";
import { AppDataContext, updateAppTitle } from "../../app/AppContext";
import NotFound from "../../components/notFound/NotFound";
import FilesHcy from "../../components/filesHcy/FilesHcy";
import AddressBar from "../../components/addressBar/AddressBar";
import { validateRootedFsPath } from "../../services/notes/notePath";

const FilesHcyPage = () => {
  const { idnf } = useParams();
  const appData = React.useContext(AppDataContext);
  
  useEffect(() => {
    updateAppTitle(appData, idnf);
  }, []);

  if (trmrk.isNonEmptyStr(idnf, true)) { 
    
  }

  const onAddressChanged = (newAddress: string) => {

  }

  const addressValidator = (newAddress: string) => {
    let errMsg = validateRootedFsPath(appData.appConfig, newAddress);
    return errMsg;
  };

  return (<Container className="trmrk-files-hcy-page" sx={{ position: "relative" }} maxWidth="xl">
    <AddressBar label="File Path" address={idnf ?? ""} onAddressChanged={onAddressChanged} addressValidator={addressValidator}
      className="trmrk-main-address-bar" />
  </Container>);
}

export default FilesHcyPage;
