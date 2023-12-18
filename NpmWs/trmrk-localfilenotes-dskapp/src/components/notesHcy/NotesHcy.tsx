import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import NotFound from "../notFound/NotFound";

const Note = ({ crntNoteIdnf }: { crntNoteIdnf?: string | null | undefined }) => {
  if (trmrk.isNonEmptyStr(crntNoteIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<div></div>);
  }
}

export default Note;
