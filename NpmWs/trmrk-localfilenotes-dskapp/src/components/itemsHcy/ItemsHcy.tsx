import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";
import { DriveItem, FileType, OfficeLikeFileType } from "trmrk/src/drive-item";

import { reducer, actions, AppData } from "../../app/app-data";
import { AppDataContext } from "../../app/AppContext";
import NotFound from "../notFound/NotFound";

const ItemsHcy = ({ parentIdnf, className, childItemsRetriever }: { parentIdnf?: string | null | undefined, className: string, childItemsRetriever: (prIdnf: string) => Promise<DriveItem[]> }) => {
  const appData = React.useContext(AppDataContext);

  if (trmrk.isNonEmptyStr(parentIdnf, true)) { 
    
  }

  return (<div className={["trmrk-items-hcy", className].join(" ")}>

  </div>);
}

export default ItemsHcy;
