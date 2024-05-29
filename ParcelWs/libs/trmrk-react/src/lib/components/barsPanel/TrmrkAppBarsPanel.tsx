import React from "react";

import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "@reduxjs/toolkit";

import Box from "@mui/material/Box";
import Input from "@mui/material/Input";
import Checkbox from '@mui/material/Checkbox';

import { MtblRefValue } from "../../../trmrk/core";
import { extractTextInput } from "../../../trmrk-browser/domUtils/textInput";
import { getTouchOrMouseCoords, toSingleTouchOrClick } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";
import AppBarsPanel from "./AppBarsPanel";
import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../redux/appData";

import { BarsPanelElems } from "./BarsPanel";

import { setTextCaretPositionerEnabledToLocalStorage,
  setTextCaretPositionerKeepOpenToLocalStorage } from "../../../trmrk-browser/domUtils/core";

import TextInputCaretPositionerPopover from "../../../trmrk-react/components/textCaretInputPositioner/TextCaretPositionerPopover";

export interface TrmrkAppBarsPanelProps {
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

export const currentInputElMtblRef: MtblRefValue<HTMLElement | null> = {
  value: null
};

export const updateCurrentInputEl = (appDataReducers: AppDataReducers, dispatch: Dispatch, inputEl: HTMLElement | null) => {
  currentInputElMtblRef.value = inputEl;
  dispatch(appDataReducers.incTextCaretPositionerCurrentInputElLastSetOpIdx());
}

export default function TrmrkAppBarsPanel(props: TrmrkAppBarsPanelProps) {
  const textCaretPositionerEnabled = useSelector(props.appDataSelectors.getTextCaretPositionerEnabled);
  const textCaretPositionerKeepOpen = useSelector(props.appDataSelectors.getTextCaretPositionerKeepOpen);
  const isAnyMenuOpen = useSelector(props.appBarSelectors.isAnyMenuOpen);

  const dispatch = useDispatch();

  const onTextCaretPositionerKeepOpenToggled = React.useCallback((keepOpen: boolean) => {
    dispatch(props.appDataReducers.setTextCaretPositionerKeepOpen(keepOpen));
    setTextCaretPositionerKeepOpenToLocalStorage(keepOpen);
  }, []);

  const onTextCaretPositionerDisabled = React.useCallback(() => {
    dispatch(props.appDataReducers.setTextCaretPositionerEnabled(false));
    setTextCaretPositionerEnabledToLocalStorage(false);
  }, []);

  React.useEffect(() => {

  }, [
    currentInputElMtblRef.value,
    textCaretPositionerEnabled,
    textCaretPositionerKeepOpen,
    isAnyMenuOpen,
  ]);

  return (<AppBarsPanel basePath={props.basePath}
      appBarSelectors={props.appBarSelectors}
      appBarReducers={props.appBarReducers}
      appDataSelectors={props.appDataSelectors}
      appDataReducers={props.appDataReducers}>
    { props.children }

    { ((currentInputElMtblRef.value || textCaretPositionerKeepOpen) && textCaretPositionerEnabled) ? <TextInputCaretPositionerPopover
      inputEl={currentInputElMtblRef.value}
      inFrontOfAll={!isAnyMenuOpen}
      keepOpen={textCaretPositionerKeepOpen}
      keepOpenToggled={onTextCaretPositionerKeepOpenToggled}
      closeClicked={onTextCaretPositionerDisabled} /> : null }
  </AppBarsPanel>);
}
