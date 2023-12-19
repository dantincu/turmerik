import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import { reducer, actions, AppData } from "../../app/app-data";
import { AppDataContext } from "../../app/AppContext";
import NotFound from "../../components/notFound/NotFound";

const NotesHcyPage = ({ crntNoteIdnf }: { crntNoteIdnf?: string | null | undefined }) => {
  const appData = React.useContext(AppDataContext);

  if (trmrk.isNonEmptyStr(crntNoteIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container sx={{ position: "relative" }} maxWidth="xl"></Container>);
  }
}

export default NotesHcyPage;
