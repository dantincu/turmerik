import React, { useEffect, useState } from "react";

import { core as trmrk } from "trmrk";

import './styles.scss';

import NotFound from "../notFound/NotFound";

const NotesHcy = ({ crntNoteIdnf }: { crntNoteIdnf?: string | null | undefined }) => {
  if (trmrk.isNonEmptyStr(crntNoteIdnf, true)) { 
    (<NotFound />);
  } else {
    return (<div></div>);
  }
}

export default NotesHcy;
