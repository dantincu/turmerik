import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import { reducer, actions, AppData } from "../../app/app-data";
import { AppDataContext } from "../../app/AppContext";
import NotFound from "../../components/notFound/NotFound";
import FilesHcy from "../../components/filesHcy/FilesHcy";

const FilesHcyPage = ({ parentDirPath }: { parentDirPath ?: string | null | undefined}) => {
  const appData = React.useContext(AppDataContext);

  if (trmrk.isNonEmptyStr(parentDirPath, true)) { 
    
  }

  return (<Container sx={{ position: "relative" }} maxWidth="xl"></Container>);
}

export default FilesHcyPage;
