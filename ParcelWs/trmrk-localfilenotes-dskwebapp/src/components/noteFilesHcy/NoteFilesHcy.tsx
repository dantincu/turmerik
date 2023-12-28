import React, { useEffect, useState } from "react";

import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import './styles.scss';

import NotFound from "../notFound/NotFound";

const NoteFilesHcy = ({ noteIdnf }: { noteIdnf ?: string | null | undefined}) => {
  if (trmrk.isNonEmptyStr(noteIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<Container sx={{ position: "relative" }} maxWidth="xl"></Container>);
  }
}

export default NoteFilesHcy;
