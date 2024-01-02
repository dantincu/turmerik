import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import MauiAppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

export default function TrmrkAppBar() {
  return (<MauiAppBar className="trmrk-app-header" sx={{ position: "relative", height: "100%" }}>

  </MauiAppBar>);
}
