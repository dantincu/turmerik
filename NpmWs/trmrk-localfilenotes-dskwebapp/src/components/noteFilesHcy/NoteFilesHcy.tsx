import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import { reducer, actions, AppData } from "../../app/appData";
import { AppDataContext } from "../../app/AppContext";
import NotFound from "../notFound/NotFound";

const NoteFilesHcy = ({ noteIdnf }: { noteIdnf ?: string | null | undefined}) => {
  const appData = React.useContext(AppDataContext);

  if (trmrk.isNonEmptyStr(noteIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container sx={{ position: "relative" }} maxWidth="xl"></Container>);
  }
}

export default NoteFilesHcy;
