import React, { useEffect, useRef, lazy, Suspense } from "react";
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
import { getShowTabsNavArrows, setAppOptionsMenuIsOpen, setAppSettingsMenuIsOpen } from "../../store/appBarDataSlice";
import { getShowSetupPage, setNoteBookPath } from "../../store/storageOptionSlice";
import { routes } from "../../services/routes";
import { isScreenPortraitMode } from "../../services/htmlDoc/deviceOrientation";
import { deviceConstants } from "../../services/htmlDoc/deviceConstants";
import { navSvc } from "../../services/navigation/NavigationSvc";

const AppTabsBar = lazy(() => import("./appTabs/AppTabsBar"));
const AppTabsBarPortrait = lazy(() => import("./appTabs/AppTabsBarPortrait"));
import AppSetupTopBar from "./appSetup/AppSetupTopBar";

import AppPageBar from "./appPage/AppPageBar";
import AppSettingsMenu from "./topBar/AppSettingsMenu";
import AppOptionsMenu from "./topBar/AppOptionsMenu";

export default function TrmrkAppBar({
    setAppHeaderEl,
  }: {
    setAppHeaderEl: (appHeaderElem: HTMLDivElement | null) => void;
  }) {
  const showTabsNavArrows = useSelector(getShowTabsNavArrows);
  const showSetupPage = useSelector(getShowSetupPage);
  const dispatch = useDispatch();
  const appHeaderEl = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);
  const [optionsMenuIconBtnEl, setOptionsMenuIconBtnEl] = React.useState<null | HTMLElement>(null);
  const [ isPortraitMode, setIsPortraitMode ] = React.useState(false);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuIconBtnEl(event.currentTarget);
    dispatch(setAppSettingsMenuIsOpen(true));
  };

  const handleAppTabsNavBackClick = () => {

  }

  const handleAppTabsNavForwardClick = () => {
    
  }

  const handleHomeClick = (event: React.MouseEvent<HTMLElement>) => {
    if (showSetupPage) {
      dispatch(setNoteBookPath(""));
    } else {
      navSvc.navigate(() => navigate(routes.home));
    }
  }

  const handleOptionsClick = (event: React.MouseEvent<HTMLElement>) => {
    setOptionsMenuIconBtnEl(event.currentTarget);
    dispatch(setAppOptionsMenuIsOpen(true));
  };

  const onScreenOrientationChanged = () => {
    const isPortraitModeValue = isScreenPortraitMode();
    setIsPortraitMode(isPortraitModeValue);
  }

  const appTabsNavGoBackBtnDisabled = false;
  const appTabsNavGoForwardBtnDisabled = false;

  useEffect(() => {
    setAppHeaderEl(appHeaderEl.current!);

    screen.orientation.addEventListener("change", onScreenOrientationChanged);
    onScreenOrientationChanged();

    return () => {
      screen.orientation.removeEventListener("change", onScreenOrientationChanged);
      setAppHeaderEl(null);
    }
  }, [ appHeaderEl ]);

  return (<AppBar sx={{ position: "relative", height: "100%" }} className={["trmrk-app-header" ].join(" ")} ref={appHeaderEl}>
      <Box className="trmrk-top-bar" sx={{ marginRight: "2.5em" }}>
        { showTabsNavArrows ? <IconButton sx={{ float: "left" }} className="trmrk-icon-btn-main trmrk-nav-back-btn"
            onClick={handleAppTabsNavBackClick} disabled={appTabsNavGoBackBtnDisabled}>
            <ArrowLeftIcon />
        </IconButton> : <IconButton sx={{ float: "left" }} className="trmrk-icon-btn-main trmrk-settings-btn"
            onClick={handleSettingsClick}>
            <MenuIcon />
        </IconButton> }
        { showTabsNavArrows ? <IconButton sx={{ float: "left" }} className="trmrk-icon-btn-main trmrk-nav-forward-btn"
            onClick={handleAppTabsNavForwardClick} disabled={appTabsNavGoForwardBtnDisabled}>
            <ArrowRightIcon />
        </IconButton> : <IconButton sx={{ float: "left" }} className="trmrk-icon-btn-main trmrk-home-btn"
            onClick={handleHomeClick}>
            <HomeIcon />
        </IconButton> }
        { showSetupPage ? <AppSetupTopBar />
          : isPortraitMode ? <Suspense fallback={"..."}>
              <AppTabsBarPortrait />
            </Suspense> : <Suspense fallback={"..."}>
              <AppTabsBar />
            </Suspense>
        }
        <IconButton sx={{ float: "right" }} className="trmrk-icon-btn-main"
            onClick={handleOptionsClick}>
          <MoreVertIcon /></IconButton>
      </Box>
      <AppPageBar />
      <AppSettingsMenu menuAnchorEl={settingsMenuIconBtnEl!} />
      <AppOptionsMenu menuAnchorEl={optionsMenuIconBtnEl!} />
    </AppBar>);
}
