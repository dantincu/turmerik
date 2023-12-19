import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Menu from '@mui/material/Menu';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';

import { AppBarArgs } from "./AppBarArgs";
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";
import { AppDataContext } from "../../app/AppContext";

export default function MainAppBar ({
  args
}: {
  args: AppBarArgs
}) {
  const appData = React.useContext(AppDataContext);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (<AppBar sx={{ position: "relative" }}>
    <Grid gridRow={0}>
      <Link to={appData.baseLocation}>
        <IconButton sx={{ color: "#FFF", width: "2em" }}>
          <img src="../../assets/Icon-32x30-nobg.png" />
        </IconButton>
      </Link>
      <Typography variantMapping={{"h6": "label"}} variant="h6" sx={{ position: "relative", top: "0.2em" }}>{appData.appTitle}</Typography>
      <IconButton sx={{ color: "#FFF", width: "2em", float: "right" }}
          onClick={handleClick}><MenuIcon /></IconButton>
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
