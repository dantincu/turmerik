import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  AppDataSelectors,
  AppDataReducers,
} from "trmrk-react/src/redux/appData";

import {
  AppBarReducers,
  AppBarSelectors,
} from "trmrk-react/src/redux/appBarData";

export interface UseAppBarProps {
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  appBarRowsCount: number;
}

import { getAppTheme, currentAppTheme } from "trmrk-react/src/app-theme/core";
import { appModeCssClass, getAppModeCssClassName } from "trmrk-react/src/utils";

import {
  AppPanelHeaderData,
  AppPanelHeaderOffset,
} from "trmrk-react/src/components/appPanel/AppPanel";

export const useAppBar = (props: UseAppBarProps) => {
  const [appBarRowsCount, setAppBarRowsCount] = React.useState(
    props.appBarRowsCount
  );

  const [appHeaderHeight, setAppHeaderHeight] = React.useState<number | null>(
    null
  );

  const appBarRowHeightPx = React.useRef(0);
  const headerRef = React.useRef<HTMLDivElement>();
  const bodyRef = React.useRef<HTMLDivElement>();

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

  const dispatch = useDispatch();

  const [settingsMenuIconBtnEl, setSettingsMenuIconBtnEl] =
    React.useState<null | HTMLElement>(null);

  const [appearenceMenuIconBtnEl, setAppearenceMenuIconBtnEl] =
    React.useState<null | HTMLButtonElement>(null);

  const [lastRefreshTmStmp, setLastRefreshTmStmp] = React.useState(new Date());

  const appTheme = getAppTheme({
    isDarkMode: isDarkMode,
  });

  currentAppTheme.value = appTheme;

  const appThemeClassName = appTheme.cssClassName;
  appModeCssClass.value = getAppModeCssClassName(isCompactMode);

  const handleSettingsClick = (event: React.MouseEvent<HTMLElement>) => {
    setSettingsMenuIconBtnEl(event.currentTarget);
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(true));
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

  const appearenceMenuOpen = () => {
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(true));
  };

  const handleCompactModeToggled = (isCompactMode: boolean) => {
    dispatch(props.appDataReducers.setIsCompactMode(isCompactMode));
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
  };

  const handleDarkModeToggled = (isDarkMode: boolean) => {
    dispatch(props.appDataReducers.setIsDarkMode(isDarkMode));
    dispatch(props.appBarReducers.setAppSettingsMenuIsOpen(false));
    dispatch(props.appBarReducers.setAppearenceMenuIsOpen(false));
  };

  const appBarToggled = (showAppBar: boolean) => {
    dispatch(props.appDataReducers.setShowAppBar(showAppBar));
  };

  const appHeaderScrolling = (
    data: AppPanelHeaderData,
    offset: AppPanelHeaderOffset
  ) => {
    headerRef.current = data.headerEl;
    bodyRef.current = data.bodyEl;

    if (appBarRowHeightPx.current === 0) {
      const newAppBarRowHeightPx = Math.round(
        data.headerHeight / appBarRowsCount
      );
      appBarRowHeightPx.current = newAppBarRowHeightPx;
    }

    if (appHeaderHeight === null) {
      setAppHeaderHeight(data.headerHeight);
    }
  };

  useEffect(() => {}, [
    appTheme,
    props.appBarRowsCount,
    appBarRowsCount,
    lastRefreshTmStmp,
    appHeaderHeight,
    showAppBar,
    appSettingsMenuIsOpen,
    appearenceMenuIsOpen,
    appearenceMenuIconBtnEl,
    appBarRowHeightPx,
  ]);

  return {
    appBarRowsCount,
    setAppBarRowsCount,
    appHeaderHeight,
    setAppHeaderHeight,
    appBarRowHeightPx,
    headerRef,
    bodyRef,
    isCompactMode,
    isDarkMode,
    showAppBar,
    showAppBarToggleBtn,
    appSettingsMenuIsOpen,
    appearenceMenuIsOpen,
    settingsMenuIconBtnEl,
    setSettingsMenuIconBtnEl,
    appearenceMenuIconBtnEl,
    setAppearenceMenuIconBtnEl,
    lastRefreshTmStmp,
    setLastRefreshTmStmp,
    appTheme,
    currentAppTheme,
    appThemeClassName,
    appModeCssClass,
    handleSettingsClick,
    appearenceMenuBtnRefAvailable,
    handleSettingsMenuClosed,
    handleAppearenceMenuClosed,
    appearenceMenuOpen,
    handleCompactModeToggled,
    handleDarkModeToggled,
    appBarToggled,
    appHeaderScrolling,
  };
};
