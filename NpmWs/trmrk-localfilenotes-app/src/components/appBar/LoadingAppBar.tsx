import React, { useEffect, useState } from "react";

import Typography from "@mui/material/Typography";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';

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
          <img src="../../assets/Icon-32x30-nobg.png" />
        </IconButton>
        <Typography variantMapping={{"h6": "label"}} variant="h6" sx={{ position: "relative", top: "0.2em" }}>Turmerik Local File Notes</Typography>
        <IconButton sx={{ color: "#FFF", width: "2em", float: "right" }}
            onClick={handleClick}><MenuIcon /></IconButton>
      </Grid>
    </Grid>
    <Menu 
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        anchorEl={anchorEl}>
      <ToggleDarkModeBtn args={args} setAnchorEl={el => setAnchorEl(el)} />
    </Menu>
  </AppBar>);
}
