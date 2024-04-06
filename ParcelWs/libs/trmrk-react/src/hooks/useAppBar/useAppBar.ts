import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  setIsDarkModeToLocalStorage,
  setIsCompactModeToLocalStorage,
  appModeCssClass,
  getAppModeCssClassName,
} from "trmrk-browser/src/domUtils/core";

import { MtblRefValue } from "trmrk/src/core";

import { AppTheme, getAppTheme, currentAppTheme } from "../../app-theme/core";

import {
  FloatingTopBarPanelHeaderData,
  FloatingTopBarPanelHeaderOffset,
} from "../../components/floatingTopBarPanel/FloatingTopBarPanel_V1";

import { AppDataSelectors, AppDataReducers } from "../../redux/appData_V1";
import { AppBarReducers, AppBarSelectors } from "../../redux/appBarData_V1";

import {
  FloatingVariable,
  updateFloatingVariableValue,
} from "../../components/floatingTopBarPanel/FloatingTopBarPanel_V1";

export interface UseAppBarProps {
  appDataSelectors: AppDataSelectors;
  appDataReducers: AppDataReducers;
  appBarSelectors: AppBarSelectors;
  appBarReducers: AppBarReducers;
  floatingVariable?: FloatingVariable | null | undefined;
  appHeaderBeforeScrolling?:
    | ((
        data: FloatingTopBarPanelHeaderData
      ) => boolean | null | undefined | void)
    | null
    | undefined;
  appHeaderScrolling?:
    | ((
        data: FloatingTopBarPanelHeaderData,
        offset: FloatingTopBarPanelHeaderOffset
      ) => void)
    | null
    | undefined;
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
  appBarHeightRefreshReqsCount: number;
  appBarScrollRefreshReqsCount: number;
  appTheme: AppTheme;
  currentAppTheme: MtblRefValue<AppTheme>;
  appThemeClassName: string;
  appModeCssClass: MtblRefValue<string>;
  floatingVariable?: FloatingVariable | null | undefined;
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
  appHeaderBeforeScrolling: (
    data: FloatingTopBarPanelHeaderData
  ) => boolean | null | undefined | void;
  appHeaderScrolling: (
    data: FloatingTopBarPanelHeaderData,
    offset: FloatingTopBarPanelHeaderOffset
  ) => void;
  updateHeaderHeight: (newAppBarRowsCount: number) => void;
}

export const useAppBar = (props: UseAppBarProps): UseAppBarResult => {
  const [appHeaderHeight, setAppHeaderHeight] = React.useState<number | null>(
    null
  );

  const appBarRowHeightPx = React.useRef(40);
  const headerRef = React.useRef<HTMLDivElement>();
  const bodyRef = React.useRef<HTMLDivElement>();

  const appBarRowsCount = useSelector(props.appBarSelectors.getAppBarRowsCount);

  const appBarHeightRefreshReqsCount = useSelector(
    props.appBarSelectors.getAppBarHeightRefreshReqsCount
  );

  const appBarScrollRefreshReqsCount = useSelector(
    props.appBarSelectors.getAppBarScrollRefreshReqsCount
  );

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

  const appBarToggled = React.useCallback((showAppBar: boolean) => {
    dispatch(props.appDataReducers.setShowAppBar(showAppBar));
  }, []);

  const appHeaderBeforeScrolling = React.useCallback(
    (data: FloatingTopBarPanelHeaderData) => {
      let handleScroll: boolean | null | undefined | void = true;

      if (props.appHeaderBeforeScrolling) {
        handleScroll = props.appHeaderBeforeScrolling(data);
      }

      return handleScroll;
    },
    [props.appHeaderBeforeScrolling]
  );

  const appHeaderScrolling = React.useCallback(
    (
      data: FloatingTopBarPanelHeaderData,
      offset: FloatingTopBarPanelHeaderOffset
    ) => {
      headerRef.current = data.headerEl;
      bodyRef.current = data.bodyEl;

      if (appHeaderHeight === null) {
        setAppHeaderHeight(data.headerHeight);
      }

      if (props.appHeaderScrolling) {
        props.appHeaderScrolling(data, offset);
      }
    },
    [headerRef, bodyRef, appHeaderHeight, props.appHeaderScrolling]
  );

  const updateHeaderHeight = React.useCallback(
    (newAppBarRowsCount: number) => {
      const headerEl = headerRef.current;
      const bodyEl = bodyRef.current;

      if (headerEl && bodyEl) {
        const newHeaderHeight = newAppBarRowsCount * appBarRowHeightPx.current;

        headerEl.style.height = `${newHeaderHeight}px`;
        headerEl.style.top = "0px";

        updateFloatingVariableValue(
          bodyEl,
          newHeaderHeight,
          props.floatingVariable
        );

        if (newHeaderHeight !== appHeaderHeight) {
          setAppHeaderHeight(newHeaderHeight);
        }
      }
    },
    [headerRef, bodyRef, appHeaderHeight, appBarRowHeightPx]
  );

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
    appBarHeightRefreshReqsCount,
    appBarScrollRefreshReqsCount,
    appTheme,
    currentAppTheme,
    appThemeClassName,
    appModeCssClass,
    floatingVariable: props.floatingVariable,
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
    appHeaderBeforeScrolling,
    appHeaderScrolling,
    updateHeaderHeight,
  };
};