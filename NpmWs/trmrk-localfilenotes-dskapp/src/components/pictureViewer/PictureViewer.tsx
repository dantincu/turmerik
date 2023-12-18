import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import NotFound from "../notFound/NotFound";

const PictureViewer = ({ parentDirIdnf }: { parentDirIdnf?: string | null | undefined }) => {
  if (trmrk.isNonEmptyStr(parentDirIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<div></div>);
  }
}

export default PictureViewer;
