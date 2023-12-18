import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import NotFound from "../notFound/NotFound";

const TextFileViewer = ({ fileIdnf }: { fileIdnf?: string | null | undefined }) => {
  if (trmrk.isNonEmptyStr(fileIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<div></div>);
  }
}

export default TextFileViewer;
