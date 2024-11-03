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
import OptionsMenu from "../settingsMenu/OptionsMenu";

import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../redux/appData";

import { getAppTheme, currentAppTheme } from "../../app-theme/core";

import { appModeCssClass, getAppModeCssClassName,
  setIsCompactModeToLocalStorage,
  setIsDarkModeToLocalStorage } from "../../../trmrk-browser/domUtils/core";

import { isAndroid, isIPad, isIPhone, isMobile } from "../../../trmrk-browser/domUtils/constants";

import BarsPanel, { BarsPanelElems } from "./BarsPanel";
import ToggleAppBarBtn from "./ToggleAppBarBtn";

export interface AppBarsPanelProps {
  basePath?: string | null | undefined;
  showHomeBtn?: boolean | null | undefined;
  onPanelElems?: ((elems: BarsPanelElems) => void) | null | undefined;
  panelClassName?: string | null | undefined;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
  appBarClassName?: string | null | undefined;
  appHeaderChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  appFooterMainRowChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  appFooterContextRowChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  children: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  appBarRefreshBtnClicked?: (() => boolean | null | undefined | void);
  settingsMenuClassName?: string | null | undefined;
  settingsMenuListClassName?: string | null | undefined;
  appearenceMenuClassName?: string | null | undefined;
  appearenceMenuListClassName?: string | null | undefined;
  optionsMenuClassName?: string | null | undefined;
  optionsMenuListClassName?: string | null | undefined;
  settingsMenuChildren?: React.ReactNode | Iterable<React.ReactNode> | null;
  appearenceMenuChildren?: React.ReactNode | Iterable<React.ReactNode> | null;
}

export default function AppBarsPanel(props: AppBarsPanelProps) {
  const showAppHeader = useSelector(props.appBarSelectors.getShowAppHeader);
  const showAppHeaderOverride = useSelector(props.appBarSelectors.getShowAppHeaderOverride);
  const showAppFooter = useSelector(props.appBarSelectors.getShowAppFooter);
  const showAppFooterOverride = useSelector(props.appBarSelectors.getShowAppFooterOverride);
  const showAppHeaderToggleBtn = useSelector(props.appBarSelectors.getShowAppHeaderToggleBtn);
  const showAppFooterToggleBtn = useSelector(props.appBarSelectors.getShowAppFooterToggleBtn);
  const appFooterRowsCount = useSelector(props.appBarSelectors.getAppFooterRowsCount);

  const isCompactMode = useSelector(props.appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(props.appDataSelectors.getIsDarkMode);

  const appSettingsMenuIsOpen = useSelector(
    props.appBarSelectors.getAppSettingsMenuIsOpen
  );

  const appearenceMenuIsOpen = useSelector(
    props.appBarSelectors.getAppearenceMenuIsOpen
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

  const handleSettingsMenuClosed = React.useCallback(() => {
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
  }, []);

  const handleAppearenceMenuClosed = React.useCallback(() => {
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
  }, []);

  const handleOptionsMenuClosed = React.useCallback(() => {
    dispatch(props.appBarReducers.setOptionsMenuIsOpen(false));
  }, []);

  const appearenceMenuOpen = React.useCallback(() => {
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(true));
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
    showAppHeaderOverride,
    showAppFooter,
    showAppFooterOverride,
    showAppHeaderToggleBtn,
    showAppFooterToggleBtn,
    appFooterRowsCount,
    isCompactMode,
    isDarkMode,
    appSettingsMenuIsOpen,
    appearenceMenuIsOpen,
    showOptionsMenuBtn,
    optionsMenuIsOpen,
    settingsMenuIconBtnEl,
    appearenceMenuIconBtnEl,
    textCaretPositionerMenuIconBtnEl,
    optionsMenuIconBtnEl,
    props.showHomeBtn ]);

  return (<BarsPanel onPanelElems={props.onPanelElems}
      panelClassName={[
      appThemeClassName,
      appModeCssClass.value,
      props.panelClassName ?? "",
      "trmrk-app-bars-panel",
      `trmrk-app-footer-height-is-x${appFooterRowsCount}`,
      isMobile ? "trmrk-device-mobile" : "",
      isAndroid ? "trmrk-device-android" : "",
      isIPad ? "trmrk-device-ipad" : "",
      isIPhone ? "trmrk-device-iphone" : "" ].join(" ")}
      showHeader={ showAppHeaderOverride ?? showAppHeader }
      showFooter={ showAppFooterOverride ?? showAppFooter }
      scrollableX={true}
      scrollableY={isCompactMode}
      headerChildren={<AppBar className={["trmrk-app-bar", props.appBarClassName ?? ""].join(" ")}>
        <IconButton onClick={handleSettingsClick} className="trmrk-icon-btn trmrk-settings-btn"><MenuIcon /></IconButton>
        { props.showHomeBtn ? <Link to={props.basePath ?? "/"}><IconButton className="trmrk-icon-btn trmrk-home-btn"><HomeIcon /></IconButton></Link> : null }
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
          showMenu={appSettingsMenuIsOpen}
          menuAnchorEl={settingsMenuIconBtnEl!}
          menuClosed={handleSettingsMenuClosed}
          appearenceMenuOpen={appearenceMenuOpen}>
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
        <OptionsMenu
          className={props.optionsMenuClassName}
          menuListClassName={props.optionsMenuListClassName}
          appTheme={appTheme}
          showMenu={optionsMenuIsOpen}
          menuClosed={handleOptionsMenuClosed}
          menuAnchorEl={optionsMenuIconBtnEl!}
          refreshBtnClicked={appBarRefreshBtnClicked} />
      </AppBar>}
      footerChildren={<AppBar className={["trmrk-app-bar", props.appBarClassName ?? ""].join(" ")} component="footer">
        { appFooterRowsCount > 1 ? <div className="trmrk-row">{ props.appFooterContextRowChildren }</div> : null }
        <div className="trmrk-row">{ props.appFooterMainRowChildren }</div>
      </AppBar>}
      afterBodyChildren={<React.Fragment>
        { (showAppHeaderToggleBtn && showAppHeaderOverride === null) ? <ToggleAppBarBtn
            appBarToggled={appHeaderToggled}
            showAppBar={showAppHeader}
            togglesHeader={true} /> : null }
        { (showAppFooterToggleBtn && showAppFooterOverride === null) ? <ToggleAppBarBtn
          appBarToggled={appFooterToggled}
          showAppBar={showAppFooter}
          togglesHeader={false} /> : null }
      </React.Fragment>}>
        { props.children }
  </BarsPanel>)
}
