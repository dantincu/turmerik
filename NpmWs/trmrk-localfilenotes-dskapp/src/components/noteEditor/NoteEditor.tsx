import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import { reducer, actions, AppData } from "../../app/app-data";
import { AppDataContext } from "../../app/AppContext";
import NotFound from "../notFound/NotFound";

const NoteEditor = ({ noteIdnf }: { noteIdnf?: string | null | undefined }) => {
  const appData = React.useContext(AppDataContext);

  if (trmrk.isNonEmptyStr(noteIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<div></div>);
  }
}

export default NoteEditor;
