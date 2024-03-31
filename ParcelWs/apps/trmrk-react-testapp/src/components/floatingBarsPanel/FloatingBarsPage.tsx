import React from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import AppBar  from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import SettingsMenu from "trmrk-react/src/components/settingsMenu/SettingsMenu";
import AppearenceSettingsMenu from "trmrk-react/src/components/settingsMenu/AppearenceSettingsMenu";
import OptionsMenu from "trmrk-react/src/components/settingsMenu/OptionsMenu";
import { AppDataSelectors, AppDataReducers } from "trmrk-react/src/redux/appData";
import { AppBarSelectors, AppBarReducers } from "trmrk-react/src/redux/appBarData";
import { getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName,
  setIsCompactModeToLocalStorage,
  setIsDarkModeToLocalStorage } from "trmrk-browser/src/domUtils/core";

import "./FloatingBarsPage.scss";

import FloatingBarsPanel, { FloatingBarsPanelScrollData } from "./FloatingBarsPanel";

export interface FloatingBarsPageProps {
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  basePath: string;
  className?: string | null | undefined;
  headerClassName?: string | null | undefined;
  appBarClassName?: string | null | undefined;
  settingsMenuClassName?: string | null | undefined;
  settingsMenuListClassName?: string | null | undefined;
  appearenceMenuClassName?: string | null | undefined;
  appearenceMenuListClassName?: string | null | undefined;
  optionsMenuClassName?: string | null | undefined;
  optionsMenuListClassName?: string | null | undefined;
  footerClassName?: string | null | undefined;
  bodyClassName?: string | null | undefined;
  headerRowsCount?: number | null | undefined;
  footerRowsCount?: number | null | undefined;
  panelScrollableY?: boolean | null | undefined;
  panelBodyScrollableX?: boolean | null | undefined;
  appBarChildren?: React.ReactNode | Iterable<React.ReactNode> | null;
  settingsMenuChildren?: React.ReactNode | Iterable<React.ReactNode> | null;
  appearenceMenuChildren?: React.ReactNode | Iterable<React.ReactNode> | null;
  footerContent: React.ReactNode | Iterable<React.ReactNode> | null;
  children: React.ReactNode | Iterable<React.ReactNode>;
  appBarRefreshBtnClicked?: (() => boolean | null | undefined | void);
  resized?: ((data: FloatingBarsPanelScrollData) => void) | null | undefined;
  scrolled?: ((data: FloatingBarsPanelScrollData) => void) | null | undefined;
}

export default function FloatingBarsPage(props: FloatingBarsPageProps) {
  const fwProps = {...props}

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

  React.useEffect(() => {

  }, [props.headerRowsCount,
    props.footerRowsCount,
    props.appBarRefreshBtnClicked,
    props.resized,
    props.scrolled,
    props.panelScrollableY,
    props.panelBodyScrollableX,
    props.headerRowsCount,
    props.footerRowsCount]);

  return (<FloatingBarsPanel
      {...fwProps}
      className={["trmrk-ftbs-page", props.className ?? "",
        appThemeClassName, appModeCssClass.value].join(" ")}
      headerClassName={["trmrk-ftbs-page-header", props.headerClassName ?? ""].join(" ")}
      footerClassName={["trmrk-ftbs-page-footer", props.footerClassName ?? ""].join(" ")}
      bodyClassName={["trmrk-ftbs-page-body", props.bodyClassName ?? ""].join(" ")}
      headerRowsCount={props.headerRowsCount ?? 1}
      footerRowsCount={props.footerRowsCount ?? 0}
      headerContent={<AppBar className={["trmrk-ftbs-page-app-bar", props.appBarClassName ?? ""].join(" ")}>
        <IconButton onClick={handleSettingsClick} className="trmrk-icon-btn trmrk-settings-btn"><MenuIcon /></IconButton>
        <Link to={props.basePath}><IconButton className="trmrk-icon-btn trmrk-home-btn"><HomeIcon /></IconButton></Link>
        { showOptionsMenuBtn ? <IconButton
          onClick={handleOptionsClick}
          className="trmrk-icon-btn trmrk-options-btn">
            <MoreHorizIcon /></IconButton> : null }
        { props.appBarChildren }
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
      </AppBar>}>
        {props.children}
      </FloatingBarsPanel>);
}
