import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  setIsDarkModeToLocalStorage,
  setIsCompactModeToLocalStorage,
} from "../../utils";

import { AppDataSelectors, AppDataReducers } from "../../redux/appData";
import { AppBarReducers, AppBarSelectors } from "../..//redux/appBarData";

export interface UseAppBarProps {
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
}

export interface UseAppBarResult {
  appBarRowsCount: number;
  appHeaderHeight: number | null;
  setAppHeaderHeight: React.Dispatch<React.SetStateAction<number | null>>;
  appBarRowHeightPx: React.MutableRefObject<number>;
  headerRef: React.MutableRefObject<HTMLDivElement | undefined>;
  bodyRef: React.MutableRefObject<HTMLDivElement | undefined>;
  isCompactMode: boolean;
  isDarkMode: boolean;
  showAppBar: boolean;
  showAppBarToggleBtn: boolean;
  appSettingsMenuIsOpen: boolean;
  appearenceMenuIsOpen: boolean;
  showOptionsMenuBtn: boolean;
  optionsMenuIsOpen: boolean;
  settingsMenuIconBtnEl: HTMLButtonElement | null;
  setSettingsMenuIconBtnEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
  appearenceMenuIconBtnEl: HTMLButtonElement | null;
  setAppearenceMenuIconBtnEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
  optionsMenuIconBtnEl: HTMLButtonElement | null;
  setOptionsMenuIconBtnEl: React.Dispatch<
    React.SetStateAction<HTMLButtonElement | null>
  >;
  lastRefreshTmStmp: Date;
  setLastRefreshTmStmp: React.Dispatch<React.SetStateAction<Date>>;
  appTheme: AppTheme;
  currentAppTheme: MtblRefValue<AppTheme>;
  appThemeClassName: string;
  appModeCssClass: MtblRefValue<string>;
  handleSettingsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleOptionsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  appearenceMenuBtnRefAvailable: (btnRef: HTMLButtonElement | null) => void;
  handleSettingsMenuClosed: () => void;
  handleAppearenceMenuClosed: () => void;
  handleOptionsMenuClosed: () => void;
  appearenceMenuOpen: () => void;
  handleCompactModeToggled: (isCompactMode: boolean) => void;
  handleDarkModeToggled: (isDarkMode: boolean) => void;
  appBarToggled: (showAppBar: boolean) => void;
  appHeaderScrolling: (
    data: FloatingTopBarPanelHeaderData,
    offset: FloatingTopBarPanelHeaderOffset
  ) => void;
  updateHeaderHeight: (newAppBarRowsCount: number) => void;
}

import { AppTheme, getAppTheme, currentAppTheme } from "../../app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "../..//utils";

import {
  FloatingTopBarPanelHeaderData,
  FloatingTopBarPanelHeaderOffset,
} from "../../components/floatingTopBarPanel/FloatingTopBarPanel";
import { MtblRefValue } from "trmrk/src/core";

export const useAppBar = (props: UseAppBarProps): UseAppBarResult => {
  const [appHeaderHeight, setAppHeaderHeight] = React.useState<number | null>(
    null
  );

  const appBarRowHeightPx = React.useRef(40);
  const headerRef = React.useRef<HTMLDivElement>();
  const bodyRef = React.useRef<HTMLDivElement>();

  const appBarRowsCount = useSelector(props.appBarSelectors.getAppBarRowsCount);
  const isCompactMode = useSelector(props.appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(props.appDataSelectors.getIsDarkMode);
  const showAppBar = useSelector(props.appDataSelectors.getShowAppBar);

  const showAppBarToggleBtn = useSelector(
    props.appDataSelectors.getShowAppBarToggleBtn
  );

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

  const [lastRefreshTmStmp, setLastRefreshTmStmp] = React.useState(new Date());

  const appTheme = getAppTheme({
    isDarkMode: isDarkMode,
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(isCompactMode);

  const handleSettingsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsMenuIconBtnEl(event.currentTarget);
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(true));
  };

  const handleOptionsClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setOptionsMenuIconBtnEl(event.currentTarget);
    dispatch(props.appBarReducers.setOptionsMenuIsOpen(true));
  };

  const appearenceMenuBtnRefAvailable = (btnRef: HTMLButtonElement | null) => {
    setAppearenceMenuIconBtnEl(btnRef);
  };

  const handleSettingsMenuClosed = () => {
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
  };

  const handleAppearenceMenuClosed = () => {
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
  };

  const handleOptionsMenuClosed = () => {
    dispatch(props.appBarReducers.setOptionsMenuIsOpen(false));
  };

  const appearenceMenuOpen = () => {
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(true));
  };

  const handleCompactModeToggled = (isCompactMode: boolean) => {
    dispatch(props.appDataReducers.setIsCompactMode(isCompactMode));
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
    setIsCompactModeToLocalStorage(isCompactMode);
  };

  const handleDarkModeToggled = (isDarkMode: boolean) => {
    dispatch(props.appDataReducers.setIsDarkMode(isDarkMode));
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
    setIsDarkModeToLocalStorage(isDarkMode);
  };

  const appBarToggled = (showAppBar: boolean) => {
    dispatch(props.appDataReducers.setShowAppBar(showAppBar));
  };

  const appHeaderScrolling = (
    data: FloatingTopBarPanelHeaderData,
    offset: FloatingTopBarPanelHeaderOffset
  ) => {
    headerRef.current = data.headerEl;
    bodyRef.current = data.bodyEl;

    /* if (appBarRowHeightPx.current === 0) {
      const newAppBarRowHeightPx = Math.round(
        data.headerHeight / appBarRowsCount
      );
      appBarRowHeightPx.current = newAppBarRowHeightPx;
    } */

    if (appHeaderHeight === null) {
      setAppHeaderHeight(data.headerHeight);
    }
  };

  const updateHeaderHeight = (newAppBarRowsCount: number) => {
    const headerEl = headerRef.current;
    const bodyEl = bodyRef.current;

    if (headerEl && bodyEl) {
      const newHeaderHeight = newAppBarRowsCount * appBarRowHeightPx.current;

      headerEl.style.height = `${newHeaderHeight}px`;
      bodyEl.style.top = `${newHeaderHeight}px`;
      headerEl.style.top = "0px";

      // dispatch(props.appBarReducers.setAppBarRowsCount(newAppBarRowsCount));
      setAppHeaderHeight(newHeaderHeight);
    }
  };

  useEffect(() => {
    updateHeaderHeight(appBarRowsCount);
  }, [
    appTheme,
    appBarRowsCount,
    lastRefreshTmStmp,
    appHeaderHeight,
    showAppBar,
    showAppBarToggleBtn,
    showOptionsMenuBtn,
    appSettingsMenuIsOpen,
    appearenceMenuIsOpen,
    optionsMenuIsOpen,
    appearenceMenuIconBtnEl,
    appBarRowHeightPx,
  ]);

  return {
    appBarRowsCount,
    appHeaderHeight,
    setAppHeaderHeight,
    appBarRowHeightPx,
    headerRef,
    bodyRef,
    isCompactMode,
    isDarkMode,
    showAppBar,
    showAppBarToggleBtn,
    showOptionsMenuBtn,
    appSettingsMenuIsOpen,
    appearenceMenuIsOpen,
    optionsMenuIsOpen,
    settingsMenuIconBtnEl,
    setSettingsMenuIconBtnEl,
    appearenceMenuIconBtnEl,
    setAppearenceMenuIconBtnEl,
    optionsMenuIconBtnEl,
    setOptionsMenuIconBtnEl,
    lastRefreshTmStmp,
    setLastRefreshTmStmp,
    appTheme,
    currentAppTheme,
    appThemeClassName,
    appModeCssClass,
    handleSettingsClick,
    handleOptionsClick,
    appearenceMenuBtnRefAvailable,
    handleSettingsMenuClosed,
    handleAppearenceMenuClosed,
    handleOptionsMenuClosed,
    appearenceMenuOpen,
    handleCompactModeToggled,
    handleDarkModeToggled,
    appBarToggled,
    appHeaderScrolling,
    updateHeaderHeight,
  };
};
