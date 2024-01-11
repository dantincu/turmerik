import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { AppBarData } from "../../services/appData";
import { setAppOptionsMenuIsOpen, setAppSettingsMenuIsOpen } from "../../store/appBarDataSlice";
import { routes } from "../../services/routes";
import { getRoute } from "../../services/utils";

import AppTabsBar from "./appTabs/AppTabsBar";
import AppPageBar from "./appPage/AppPageBar";
import AppSettingsMenu from "./topBar/AppSettingsMenu";
import AppOptionsMenu from "./topBar/AppOptionsMenu";

export default function TrmrkAppBar({
    setAppHeaderEl,
  }: {
    setAppHeaderEl: (appHeaderElem: HTMLDivElement) => void;
  }) {
  const appBar = useSelector((state: { appBar: AppBarData }) => state.appBar);
  const dispatch = useDispatch();
  const appHeaderEl = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);
  const [optionsMenuIconBtnEl, setOptionsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuIconBtnEl(event.currentTarget);
    dispatch(setAppSettingsMenuIsOpen(true));
  };

  const handleAppTabsNavBackClick = () => {

  }

  const handleAppTabsNavForwardClick = () => {
    
  }

  const handleHomeClick = (event: React.MouseEvent<HTMLElement>) => {
      navigate(routes.home);
  }

  const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setOptionsMenuIconBtnEl(event.currentTarget);
    dispatch(setAppOptionsMenuIsOpen(true));
  };

  const appTabsNavGoBackBtnDisabled = false;
  const appTabsNavGoForwardBtnDisabled = false;

  useEffect(() => {
    setAppHeaderEl(appHeaderEl.current!);
  }, []);

  return (<AppBar sx={{ position: "relative", height: "100%" }} className={["trmrk-app-header" ].join(" ")} ref={appHeaderEl}>
      <Box className="trmrk-top-bar" sx={{ marginRight: "2.5em" }}>
        { appBar.showTabsNavArrows ? <IconButton sx={{ float: "left" }}
            onClick={handleAppTabsNavBackClick} disabled={appTabsNavGoBackBtnDisabled}>
            <ArrowLeftIcon />
        </IconButton> : <IconButton sx={{ float: "left" }}
            onClick={handleSettingsClick}>
            <MenuIcon />
        </IconButton> }
        { appBar.showTabsNavArrows ? <IconButton sx={{ float: "left" }}
            onClick={handleAppTabsNavForwardClick} disabled={appTabsNavGoForwardBtnDisabled}>
            <ArrowRightIcon />
        </IconButton> : <IconButton sx={{ float: "left" }}
            onClick={handleHomeClick}>
            <HomeIcon />
        </IconButton> }
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
