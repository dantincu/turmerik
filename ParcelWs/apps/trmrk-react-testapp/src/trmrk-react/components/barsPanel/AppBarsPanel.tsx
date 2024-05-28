import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import AppBar  from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import SettingsMenu from "../settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "../settingsMenu/AppearenceSettingsMenu";
import TextCaretPositionerSettingsMenu from "../settingsMenu/TextCaretPositionerSettingsMenu";
import OptionsMenu from "../settingsMenu/OptionsMenu";

import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../redux/appData";

import { getAppTheme, currentAppTheme } from "../../app-theme/core";

import { appModeCssClass, getAppModeCssClassName,
  setIsCompactModeToLocalStorage,
  setIsDarkModeToLocalStorage,
  setTextCaretPositionerEnabledToLocalStorage,
  setTextCaretPositionerKeepOpenToLocalStorage } from "../../../trmrk-browser/domUtils/core";

import { isAndroid, isIPad, isIPhone, isIPadOrIphone, isMobile } from "../../../trmrk-browser/domUtils/constants";

import BarsPanel, { BarsPanelElems } from "./BarsPanel";
import ToggleAppBarBtn from "./ToggleAppBarBtn";

export interface AppBarsPanelProps {
  basePath: string;
  onPanelElems?: ((elems: BarsPanelElems) => void) | null | undefined;
  panelClassName?: string | null | undefined;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
  appBarClassName?: string | null | undefined;
  appHeaderChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  appFooterChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  appBarRefreshBtnClicked?: (() => boolean | null | undefined | void);
  settingsMenuClassName?: string | null | undefined;
  settingsMenuListClassName?: string | null | undefined;
  appearenceMenuClassName?: string | null | undefined;
  appearenceMenuListClassName?: string | null | undefined;
  textCaretPositionerMenuClassName?: string | null | undefined;
  textCaretPositionerMenuListClassName?: string | null | undefined;
  optionsMenuClassName?: string | null | undefined;
  optionsMenuListClassName?: string | null | undefined;
  settingsMenuChildren?: React.ReactNode | Iterable<React.ReactNode> | null;
  appearenceMenuChildren?: React.ReactNode | Iterable<React.ReactNode> | null;
  textCaretPositionerMenuChildren?: React.ReactNode | Iterable<React.ReactNode> | null;
}

export default function AppBarsPanel(props: AppBarsPanelProps) {
  const showAppHeader = useSelector(props.appBarSelectors.getShowAppHeader);
  const showAppFooter = useSelector(props.appBarSelectors.getShowAppFooter);
  const showAppHeaderToggleBtn = useSelector(props.appBarSelectors.getShowAppHeaderToggleBtn);
  const showAppFooterToggleBtn = useSelector(props.appBarSelectors.getShowAppFooterToggleBtn);

  const isCompactMode = useSelector(props.appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(props.appDataSelectors.getIsDarkMode);
  const textCaretPositionerEnabled = useSelector(props.appDataSelectors.getTextCaretPositionerEnabled);
  const textCaretPositionerKeepOpen = useSelector(props.appDataSelectors.getTextCaretPositionerKeepOpen);

  const appSettingsMenuIsOpen = useSelector(
    props.appBarSelectors.getAppSettingsMenuIsOpen
  );

  const appearenceMenuIsOpen = useSelector(
    props.appBarSelectors.getAppearenceMenuIsOpen
  );

  const textCaretPositionerMenuIsOpen = useSelector(
    props.appBarSelectors.getTextCaretPositionerMenuIsOpen
  );

  const showOptionsMenuBtn = useSelector(
    props.appBarSelectors.getShowOptionsMenuBtn
  );

  const optionsMenuIsOpen = useSelector(
    props.appBarSelectors.getOptionsMenuIsOpen
  );

  const dispatch = useDispatch();

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] =
    React.useState<null | HTMLButtonElement>(null);

  const [appearenceMenuIconBtnEl, setAppearenceMenuIconBtnEl] =
    React.useState<null | HTMLButtonElement>(null);

  const [textCaretPositionerMenuIconBtnEl, setTextCaretPositionerMenuIconBtnEl] =
    React.useState<null | HTMLButtonElement>(null);

  const [optionsMenuIconBtnEl, setOptionsMenuIconBtnEl] =
    React.useState<null | HTMLButtonElement>(null);

  const appTheme = getAppTheme({
    isDarkMode: isDarkMode,
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(isCompactMode);

  const handleSettingsClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setSettingsMenuIconBtnEl(event.currentTarget);
      dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(true));
    },
    []
  );

  const handleOptionsClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setOptionsMenuIconBtnEl(event.currentTarget);
      dispatch(props.appBarReducers.setOptionsMenuIsOpen(true));
    },
    []
  );

  const appearenceMenuBtnRefAvailable = React.useCallback(
    (btnRef: HTMLButtonElement | null) => {
      setAppearenceMenuIconBtnEl(btnRef);
    },
    []
  );

  const textCaretPositionerMenuBtnRefAvailable = React.useCallback(
    (btnRef: HTMLButtonElement | null) => {
      setTextCaretPositionerMenuIconBtnEl(btnRef);
    },
    []
  );

  const handleSettingsMenuClosed = React.useCallback(() => {
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
  }, []);

  const handleAppearenceMenuClosed = React.useCallback(() => {
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
  }, []);

  const handleTextCaretPositionerMenuClosed = React.useCallback(() => {
    dispatch(props.appBarReducers.setTextCaretPositionerMenuIsOpen(false));
  }, []);

  const handleOptionsMenuClosed = React.useCallback(() => {
    dispatch(props.appBarReducers.setOptionsMenuIsOpen(false));
  }, []);

  const appearenceMenuOpen = React.useCallback(() => {
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(true));
  }, []);

  const textCaretPositionerMenuOpen = React.useCallback(() => {
    dispatch(props.appBarReducers.setTextCaretPositionerMenuIsOpen(true));
  }, []);

  const handleCompactModeToggled = React.useCallback(
    (isCompactMode: boolean) => {
      dispatch(props.appDataReducers.setIsCompactMode(isCompactMode));
      dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
      dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
      setIsCompactModeToLocalStorage(isCompactMode);
    },
    []
  );

  const handleDarkModeToggled = React.useCallback((isDarkMode: boolean) => {
    dispatch(props.appDataReducers.setIsDarkMode(isDarkMode));
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
    setIsDarkModeToLocalStorage(isDarkMode);
  }, []);

  const handleTextCaretPositionerEnabledToggled = React.useCallback((textCaretPositionerEnabled: boolean) => {
    dispatch(props.appDataReducers.setTextCaretPositionerEnabled(textCaretPositionerEnabled));
    setTextCaretPositionerEnabledToLocalStorage(textCaretPositionerEnabled);
  }, []);

  const handleTextCaretPositionerKeepOpenToggled = React.useCallback((textCaretPositionerKeepOpen: boolean) => {
    dispatch(props.appDataReducers.setTextCaretPositionerKeepOpen(textCaretPositionerKeepOpen));
    setTextCaretPositionerKeepOpenToLocalStorage(textCaretPositionerKeepOpen);
  }, []);
  
  const appBarRefreshBtnClicked = React.useCallback(() => {
    if (props.appBarRefreshBtnClicked) {
      if (!props.appBarRefreshBtnClicked()) {
        handleOptionsMenuClosed();
      }
    } else {
      handleOptionsMenuClosed();
    }
  }, []);

  const appHeaderToggled = React.useCallback((showHeader: boolean) => {
    dispatch(props.appBarReducers.setShowAppHeader(showHeader));
  }, []);

  const appFooterToggled = React.useCallback((showFooter: boolean) => {
    dispatch(props.appBarReducers.setShowAppFooter(showFooter));
  }, []);

  React.useEffect(() => {
  }, [
    showAppHeader,
    showAppFooter,
    showAppHeaderToggleBtn,
    showAppFooterToggleBtn,
    isCompactMode,
    isDarkMode,
    textCaretPositionerEnabled,
    textCaretPositionerKeepOpen,
    appSettingsMenuIsOpen,
    appearenceMenuIsOpen,
    textCaretPositionerMenuIsOpen,
    showOptionsMenuBtn,
    optionsMenuIsOpen,
    settingsMenuIconBtnEl,
    appearenceMenuIconBtnEl,
    textCaretPositionerMenuIconBtnEl,
    optionsMenuIconBtnEl, ]);

  return (<BarsPanel onPanelElems={props.onPanelElems}
      panelClassName={[
      appThemeClassName,
      appModeCssClass.value,
      props.panelClassName ?? "",
      "trmrk-app-bars-panel",
      isMobile ? "trmrk-device-mobile" : "",
      isAndroid ? "trmrk-device-android" : "",
      isIPad ? "trmrk-device-ipad" : "",
      isIPhone ? "trmrk-device-iphone" : "" ].join(" ")}
      showHeader={ showAppHeader }
      showFooter={ showAppFooter }
      scrollableX={true}
      scrollableY={isCompactMode}
      headerChildren={<AppBar className={["trmrk-app-bar", props.appBarClassName ?? ""].join(" ")}>
        <IconButton onClick={handleSettingsClick} className="trmrk-icon-btn trmrk-settings-btn"><MenuIcon /></IconButton>
        <Link to={props.basePath}><IconButton className="trmrk-icon-btn trmrk-home-btn"><HomeIcon /></IconButton></Link>
        { showOptionsMenuBtn ? <IconButton
          onClick={handleOptionsClick}
          className="trmrk-icon-btn trmrk-options-btn">
            <MoreHorizIcon /></IconButton> : null }
        { props.appHeaderChildren }
        <SettingsMenu
          className={props.settingsMenuClassName}
          menuListClassName={props.settingsMenuListClassName}
          appTheme={appTheme}
          appearenceMenuBtnRefAvailable={appearenceMenuBtnRefAvailable}
          textCaretPositionerOptsMenuBtnRefAvailable={textCaretPositionerMenuBtnRefAvailable}
          showMenu={appSettingsMenuIsOpen}
          menuAnchorEl={settingsMenuIconBtnEl!}
          menuClosed={handleSettingsMenuClosed}
          appearenceMenuOpen={appearenceMenuOpen}
          textCaretPositionerMenuOpen={textCaretPositionerMenuOpen}>
            { props.settingsMenuChildren }
        </SettingsMenu>
        <AppearenceSettingsMenu
          className={props.appearenceMenuClassName}
          menuListClassName={props.appearenceMenuListClassName}
          appTheme={appTheme}
          showMenu={appearenceMenuIsOpen}
          isCompactMode={isCompactMode}
          isDarkMode={isDarkMode}
          compactModeToggled={handleCompactModeToggled}
          darkModeToggled={handleDarkModeToggled}
          menuClosed={handleSettingsMenuClosed}
          appearenceMenuClosed={handleAppearenceMenuClosed}
          menuAnchorEl={appearenceMenuIconBtnEl!}>
            { props.appearenceMenuChildren }
        </AppearenceSettingsMenu>
        <TextCaretPositionerSettingsMenu
          className={props.textCaretPositionerMenuClassName}
          menuListClassName={props.textCaretPositionerMenuListClassName}
          appTheme={appTheme}
          showMenu={textCaretPositionerMenuIsOpen}
          enabled={textCaretPositionerEnabled}
          keepOpen={textCaretPositionerKeepOpen}
          enabledToggled={handleTextCaretPositionerEnabledToggled}
          keepOpenToggled={handleTextCaretPositionerKeepOpenToggled}
          menuClosed={handleSettingsMenuClosed}
          textCaretPositionerMenuClosed={handleTextCaretPositionerMenuClosed}
          menuAnchorEl={textCaretPositionerMenuIconBtnEl!}>
            { props.textCaretPositionerMenuChildren }
        </TextCaretPositionerSettingsMenu>
        <OptionsMenu
          className={props.optionsMenuClassName}
          menuListClassName={props.optionsMenuListClassName}
          appTheme={appTheme}
          showMenu={optionsMenuIsOpen}
          menuClosed={handleOptionsMenuClosed}
          menuAnchorEl={optionsMenuIconBtnEl!}
          refreshBtnClicked={appBarRefreshBtnClicked} />
      </AppBar>}
      footerChildren={<AppBar className={["trmrk-app-bar", props.appBarClassName ?? ""].join(" ")}>
        { props.appFooterChildren }
      </AppBar>}>
    { showAppHeaderToggleBtn ? <ToggleAppBarBtn
      appBarToggled={appHeaderToggled}
      showAppBar={showAppHeader}
      togglesHeader={true} /> : null }
    { showAppFooterToggleBtn ? <ToggleAppBarBtn
      appBarToggled={appFooterToggled}
      showAppBar={showAppFooter}
      togglesHeader={false} /> : null }
    { props.children }
  </BarsPanel>)
}
