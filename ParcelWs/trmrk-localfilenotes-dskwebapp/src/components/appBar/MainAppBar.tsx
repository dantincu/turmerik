import React from "react";

import AppBar from "@mui/material/AppBar";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import NorthWestIcon from '@mui/icons-material/NorthWest';
import SouthEastIcon from '@mui/icons-material/SouthEast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import CloseIcon from '@mui/icons-material/Close';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import './styles.scss';

import AppOptionsMenu from "./AppOptionsMenu";
import { AppBarData, appBarCtxReducer } from "../../app/appData";
import { AppBarDataContext, isDocEditMode, createAppBarContext } from "../../app/AppContext";

import AppSettingsMenu from "./AppSettingsMenu";

export default function MainAppBar () {
  const appBarInitialState = {
    appBarOpts: {},
    floatingAppBarHeightEm: 2,
    updateFloatingBarTopOffset: true,
    appSettingsMenuOpts: {
      isOpen: false,
      appThemeMenuOpts: {
        isOpen: false
      }
    },
    appOptionsMenuOpts: {
      isOpen: false
    }
  } as AppBarData;

  const [ appBarState, appBarStateDispatch ] = React.useReducer(appBarCtxReducer, appBarInitialState);
  const appBarData = createAppBarContext(appBarState, appBarStateDispatch);

  const appBarOpts = appBarState.appBarOpts;
  const isDocEditModeVal = isDocEditMode(appBarState);

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

  return (
    <AppBarDataContext.Provider value={appBarData}>
      <AppBar sx={{ position: "relative", height: "100%" }} className={["trmrk-app-bar", appBarOpts.appBarCssClass].join(" ")}>
        <Grid gridRow={0}>
          <IconButton sx={{ float: "left" }}
              onClick={handleSettingsClick}>
              <MenuIcon />
            </IconButton>
          <IconButton sx={{ float: "right" }}
              onClick={handleOptionsClick}>
            <MoreVertIcon /></IconButton>
        </Grid>
        {
          appBarOpts.hasContextRow ? <Grid gridRow={1}>
              <IconButton sx={{ float: "right" }}><CloseIcon /></IconButton>
            </Grid> : isDocEditModeVal ? <Grid gridRow={1}>
              <IconButton sx={{ float: "left" }}><ArrowBackIcon /></IconButton>
              <IconButton sx={{ float: "left" }}><ArrowForwardIcon /></IconButton>
              <IconButton sx={{ float: "left" }}><UndoIcon /></IconButton>
              <IconButton sx={{ float: "left" }}><RedoIcon /></IconButton>
            </Grid> : <Grid gridRow={1}>
              <IconButton sx={{ float: "left" }}><NorthWestIcon /></IconButton>
              <IconButton sx={{ float: "left" }}><SouthEastIcon /></IconButton>
              <IconButton sx={{ float: "left" }}><ArrowBackIcon /></IconButton>
              <IconButton sx={{ float: "left" }}><ArrowForwardIcon /></IconButton>
            </Grid>
        }
        <AppSettingsMenu menuAnchorEl={settingsMenuIconBtnEl!} />
        <AppOptionsMenu menuAnchorEl={optionsMenuIconBtnEl!}
          appPage={appBarOpts.appPage} />
      </AppBar>
    </AppBarDataContext.Provider>);
}
