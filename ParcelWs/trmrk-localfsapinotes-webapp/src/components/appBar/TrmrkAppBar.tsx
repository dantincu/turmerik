import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { AppBarData, AppData } from "../../services/appData";
import { setAppOptionsMenuIsOpen, setAppSettingsMenuIsOpen } from "../../store/appBarDataSlice";

import AppTabsBar from "./AppTabsBar";
import AppPageBar from "./AppPageBar";
import AppSettingsMenu from "./AppSettingsMenu";
import AppOptionsMenu from "./AppOptionsMenu";

export default function TrmrkAppBar() {
  const appBarData = useSelector((state: { appBarData: AppBarData }) => state.appBarData);
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const dispatch = useDispatch();

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

  return (<AppBar sx={{ position: "relative", height: "100%" }} className={["trmrk-app-header" ].join(" ")}>
      <Box className="trmrk-top-bar">
        <IconButton sx={{ float: "left" }}
            onClick={handleSettingsClick}>
            <MenuIcon />
        </IconButton>
        <AppTabsBar />
        <IconButton sx={{ float: "right" }}
            onClick={handleOptionsClick}>
          <MoreVertIcon /></IconButton>
      </Box>
      <AppPageBar />
      <AppSettingsMenu menuAnchorEl={settingsMenuIconBtnEl!} />
      <AppOptionsMenu menuAnchorEl={optionsMenuIconBtnEl!} />
    </AppBar>);
}
