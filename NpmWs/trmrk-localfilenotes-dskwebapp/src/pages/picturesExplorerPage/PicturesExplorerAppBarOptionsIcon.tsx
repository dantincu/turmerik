import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function PicturesExplorerAppBarOptionsIcon() {
  return (<IconButton sx={{ float: "right" }}><MoreVertIcon /></IconButton>);
}
