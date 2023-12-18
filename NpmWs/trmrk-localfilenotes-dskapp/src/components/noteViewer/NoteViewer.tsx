import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import NotFound from "../notFound/NotFound";

const NoteViewer = ({ noteIdnf }: { noteIdnf?: string | null | undefined }) => {
  if (trmrk.isNonEmptyStr(noteIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<div></div>);
  }
}

export default NoteViewer;
