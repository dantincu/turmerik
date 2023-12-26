import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import { core as trmrk } from "trmrk";

import './styles.scss';

import { appCtxReducer, appCtxActions, AppData } from "../../app/appData";
import { AppDataContext } from "../../app/AppContext";
import NotFound from "../notFound/NotFound";

const NotesHcy = ({ crntNoteIdnf }: { crntNoteIdnf?: string | null | undefined }) => {
  const appData = React.useContext(AppDataContext);

  if (trmrk.isNonEmptyStr(crntNoteIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<div></div>);
  }
}

export default NotesHcy;
