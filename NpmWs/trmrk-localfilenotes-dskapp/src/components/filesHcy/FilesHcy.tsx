import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import NotFound from "../notFound/NotFound";

const FilesHcy = ({ parentDirPath }: { parentDirPath ?: string | null | undefined}) => {
  if (trmrk.isNonEmptyStr(parentDirPath, true)) { 
    
  }
  return (<div></div>);
}

export default FilesHcy;
