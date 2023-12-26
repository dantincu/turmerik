import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import './styles.scss';

import { appCtxReducer, appCtxActions, AppData } from "../../app/appData";
import { AppDataContext } from "../../app/AppContext";
import NotFound from "../notFound/NotFound";

const FilesHcyTree = ({ crntDirPath }: { crntDirPath ?: string | null | undefined}) => {
  const appData = React.useContext(AppDataContext);

  if (trmrk.isNonEmptyStr(crntDirPath, true)) { 
    
  }
  return (<div></div>);
}

export default FilesHcyTree;