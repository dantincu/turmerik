import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import Typography from "@mui/material/Typography";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import Menu from '@mui/material/Menu';
import { Dropdown } from '@mui/base/Dropdown';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import ArrowRightIcon from '@mui/icons-material/ArrowRightOutlined';

import './styles.scss';

import { AppBarArgs } from "./AppBarArgs";
import ToggleDarkModeBtn from "./ToggleDarkModeBtn";
import ToggleAppModeBtn from "./ToggleAppModeBtn";
import AppBarOptionsIcon from "./AppBarOptionsIcon";
import { AppDataContext, getAppThemeCssClassName } from "../../app/AppContext";

export default function MainAppBar ({
  args
}: {
  args: AppBarArgs
}) {
  const appData = React.useContext(AppDataContext);
  const appBarOpts = appData.appBarOpts;

  const [settingsMenuAnchorEl, setSettingsMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const [appThemeMenuAnchorEl, setAppThemeMenuAnchorEl] = React.useState<null | HTMLElement>(null);

  const settingsMenuOpen = Boolean(settingsMenuAnchorEl);
  const appThemeMenuOpen = Boolean(appThemeMenuAnchorEl);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuClose = () => {
    setSettingsMenuAnchorEl(null);
  };

  const handleAppThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setAppThemeMenuAnchorEl(event.currentTarget);
  };

  const handleAppThemeMenuClose = () => {
    setAppThemeMenuAnchorEl(null);
  };

  return (
    <AppBar sx={{ position: "relative", height: "100%" }} className={["trmrk-app-bar", appBarOpts.appBarCssClass].join(" ")}>
      <Grid gridRow={0}>
        <IconButton sx={{ float: "left" }}
            onClick={handleSettingsClick}><MenuIcon /></IconButton>
        <AppBarOptionsIcon appPage={appBarOpts.appPage} />
      </Grid>
      <Menu className={["trmrk-app-settings-menu", getAppThemeCssClassName(appData)].join(" ")}
          open={settingsMenuOpen}
          onClose={handleSettingsMenuClose}
          anchorEl={settingsMenuAnchorEl}>
        <MenuList dense>
          <MenuItem onClick={handleAppThemeClick}>App Theme <IconButton sx={{ float: "right" }}>
            <ArrowRightIcon /></IconButton></MenuItem>
        </MenuList>
      </Menu>
      <Menu className={["trmrk-app-theme-menu", getAppThemeCssClassName(appData)].join(" ")}
          open={appThemeMenuOpen}
          onClose={handleAppThemeMenuClose}
          onClick={handleAppThemeMenuClose}
          anchorEl={appThemeMenuAnchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          anchorPosition={ { top: 0, left: 100 } }>
        <MenuList dense>
          <ToggleAppModeBtn args={args} setAnchorEl={el => setAppThemeMenuAnchorEl(el)} />
          <ToggleDarkModeBtn args={args} setAnchorEl={el => setAppThemeMenuAnchorEl(el)} />
        </MenuList>
      </Menu>
    </AppBar>);
}
