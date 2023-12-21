import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import './styles.scss';

import { reducer, actions, AppData } from "../../app/appData";
import { AppDataContext, updateAppTitle } from "../../app/AppContext";
import NotFound from "../../components/notFound/NotFound";

const TextFileEditorPage = () => {
  const { idnf } = useParams();
  const appData = React.useContext(AppDataContext);
  
  useEffect(() => {
    updateAppTitle(appData, idnf);
  }, []);

  if (trmrk.isNonEmptyStr(idnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container className="trmrk-text-file-editor-page" sx={{ position: "relative" }} maxWidth="xl">v</Container>);
  }
}

export default TextFileEditorPage;
