import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/system/Box";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Menu from '@mui/material/Menu';
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import './styles.scss';
import trmrkLogo from "../../assets/Icon-32x30-nobg.png";

import { AppBarArgs } from "./AppBarArgs";
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";

export default function LoadingAppBar ({
  args
}: {
  args: AppBarArgs
}) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<AppBar sx={{ position: "relative" }}>
    <Grid>
      <Grid gridRow={0}>
        <IconButton sx={{ color: "#FFF", width: "2em" }}>
          <Box component="img" className="trmrk-icon" src={trmrkLogo} />
        </IconButton>
        <Typography variantMapping={{"h6": "label"}} variant="h6" sx={{ position: "relative", top: "0.2em" }}>Turmerik Local File Notes</Typography>
        <IconButton sx={{ color: "#FFF", width: "2em", float: "right" }}
            onClick={handleClick}><MoreVertIcon /></IconButton>
      </Grid>
    </Grid>
    <Menu 
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorEl={anchorEl}>
      <ToggleDarkModeBtn />
    </Menu>
  </AppBar>);
}
