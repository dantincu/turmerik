import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Menu from '@mui/material/Menu';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import RefreshIcon from '@mui/icons-material/Refresh';

import './styles.scss';

import { AppBarArgs } from "./AppBarArgs";
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";
import ToggleAppModeBtn from "./ToggleAppModeBtn";
import AppBarMainIcon from "./AppBarMainIcon";
import AppBarOptionsIcon from "./AppBarOptionsIcon";
import { AppDataContext, getAppThemeCssClassName } from "../../app/AppContext";

export default function MainAppBar ({
  args
}: {
  args: AppBarArgs
}) {
  const appData = React.useContext(AppDataContext);
  const appBarOpts = appData.appBarOpts;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const settingsOpen = Boolean(anchorEl);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setAnchorEl(null);
  };

  return (<div className="trmrk-app-nav-bar">
      <AppBar sx={{ position: "relative", height: "2.5em" }} className={["trmrk-app-bar", appBarOpts.appBarCssClass].join(" ")}>
        <Grid gridRow={0}>
          <IconButton sx={{ float: "left" }}
              onClick={handleSettingsClick}><MenuIcon /></IconButton>
          <AppBarMainIcon appPage={appBarOpts.appPage} />
          <Typography variantMapping={{"h6": "label"}} variant="h6"
            sx={{ position: "relative", display:"inline-flex", top: "0.2em",
            overflow: "hidden", whiteSpace: "nowrap" }} className="trmrk-app-title">
              {appData.appTitle}</Typography>
          <IconButton sx={{ float: "right" }}><RefreshIcon /></IconButton>
          <AppBarOptionsIcon appPage={appBarOpts.appPage} />
        </Grid>
        <Menu className={["trmrk-app-settings-menu", getAppThemeCssClassName(appData)].join(" ")}
            open={settingsOpen}
            onClose={handleSettingsClose}
            onClick={handleSettingsClose}
            anchorEl={anchorEl}>
          <ToggleAppModeBtn args={args} setAnchorEl={el => setAnchorEl(el)} />
          <ToggleDarkModeBtn args={args} setAnchorEl={el => setAnchorEl(el)} />
        </Menu>
      </AppBar>
    </div>);
}
