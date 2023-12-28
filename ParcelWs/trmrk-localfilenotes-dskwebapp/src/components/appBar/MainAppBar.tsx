import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import AppBar from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import './styles.scss';

import AppOptionsMenu from "./AppOptionsMenu";
import AppSettingsMenu from "./AppSettingsMenu";
import AppTabsBar from "./AppTabsBar";
import AppPageBar from "./AppPageBar";

import { AppData, AppBarData, AppPagesData } from "../../services/appData";
import { setAppSettingsMenuIsOpen, setAppOptionsMenuIsOpen } from "../../store/appDataSlice";

export default function MainAppBar () {
  const appBarData = useSelector<{ appData: AppData }, AppBarData>(state => state.appData.appBarData);
  const appPages = useSelector<{ appData: AppData }, AppPagesData>(state => state.appData.appPages);
  const dispatch = useDispatch();

  const appBarOpts = appBarData.appBarOpts;

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);
  const [optionsMenuIconBtnEl, setOptionsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuIconBtnEl(event.currentTarget);
    dispatch(setAppSettingsMenuIsOpen(true));
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setOptionsMenuIconBtnEl(event.currentTarget);
    dispatch(setAppOptionsMenuIsOpen(true));
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
      <AppPageBar appPage={appPages.currentAppPage} />
      <AppSettingsMenu menuAnchorEl={settingsMenuIconBtnEl!} />
      <AppOptionsMenu menuAnchorEl={optionsMenuIconBtnEl!}
        appPage={appPages.currentAppPage} />
    </AppBar>);
}
