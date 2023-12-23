import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import { reducer, actions, AppData } from "../../app/appData";
import { AppDataContext } from "../../app/AppContext";
import FilesHcyTree from "./FilesHcyTree";

const FilesHcy = ({
    rootDirPath,
    crntDirPath
  }: {
    rootDirPath ?: string | null | undefined,
    crntDirPath ?: string | null | undefined
  }) => {
  const appData = React.useContext(AppDataContext);

  if (trmrk.isNonEmptyStr(crntDirPath, true)) { 
    
  }
  return (<div></div>);
}

export default FilesHcy;
