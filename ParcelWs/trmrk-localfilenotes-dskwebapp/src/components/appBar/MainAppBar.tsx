import React from "react";

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import './styles.scss';

import AppOptionsMenu from "./AppOptionsMenu";
import { AppBarDataContext, isDocEditMode, createAppBarContext } from "../../app/AppContext";

import AppSettingsMenu from "./AppSettingsMenu";
import AppTabsBar from "./AppTabsBar";
import AppPageBar from "./AppPageBar";

export default function MainAppBar () {
  const appBarData = React.useContext(AppBarDataContext);
  const appBarOpts = appBarData.appBarOpts;

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);
  const [optionsMenuIconBtnEl, setOptionsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuIconBtnEl(event.currentTarget);
    appBarData.setAppSettingsMenuIsOpen(true);
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setOptionsMenuIconBtnEl(event.currentTarget);
    appBarData.setAppOptionsMenuIsOpen(true);
  };

  return (<AppBar sx={{ position: "relative", height: "100%" }} className={["trmrk-app-bar", appBarOpts.appBarCssClass].join(" ")}>
      <div className="trmrk-top-bar">
        <IconButton sx={{ float: "left" }}
            onClick={handleSettingsClick}>
            <MenuIcon />
        </IconButton>
        <AppTabsBar />
        <IconButton sx={{ float: "right" }}
            onClick={handleOptionsClick}>
          <MoreVertIcon /></IconButton>
      </div>
      <AppPageBar appPage={appBarOpts.appPage} />
      <AppSettingsMenu menuAnchorEl={settingsMenuIconBtnEl!} />
      <AppOptionsMenu menuAnchorEl={optionsMenuIconBtnEl!}
        appPage={appBarOpts.appPage} />
    </AppBar>);
}
