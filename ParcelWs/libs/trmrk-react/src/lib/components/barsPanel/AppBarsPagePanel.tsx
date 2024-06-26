import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import IconButton from "@mui/material/IconButton";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";

import trmrk from "../../../trmrk";

import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../redux/appData";

import { getAppTheme } from "../../app-theme/core";

import MatUIIcon from "../icons/MatUIIcon";
import ClickableElement from "../clickableElement/ClickableElement";

import { extractParams, removekeys } from "../../services/reactRouterDom/core";

import AppBarsPanel, { AppBarsPanelProps } from "./AppBarsPanel";
import { TouchOrMouseCoords } from "../../../trmrk-browser/domUtils/touchAndMouseEvents";

import TrmrkDialog from "../dialog/TrmrkDialog";

export interface AppBarsPagePanelProps extends AppBarsPanelProps {
  showCurrentlyOpenTabsModalUrlQueryKey?: string | null | undefined;
  showQuickSwitchTabsModalUrlQueryKey?: string | null | undefined;
  currentTabsDialogTitleCssClass?: string | null | undefined;
  currentTabsDialogContentCssClass?: string | null | undefined;
  showDocPositionNavButtons?: boolean | null | undefined;
  showDocEditUndoRedoButtons?: boolean | null | undefined;
  docPositionBackBtnEnabled?: boolean | null | undefined;
  docPositionForwardBtnEnabled?: boolean | null | undefined;
  docEditUndoBtnEnabled?: boolean | null | undefined;
  docEditRedoBtnEnabled?: boolean | null | undefined;
  tabsNavBackBtnEnabled?: boolean | null | undefined;
  tabsNavForwardBtnEnabled?: boolean | null | undefined;
  appFooterMainRowChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  appFooterContextRowChildren?: React.ReactNode | Iterable<React.ReactNode> | null | undefined;
  onTabsGoBackBtnSingleClick?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onTabsGoForwardBtnSingleClick?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onTabsGoBackBtnLongPress?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
  onTabsGoForwardBtnLongPress?: ((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => void) | null | undefined;
}

export default function AppBarsPagePanel(props: AppBarsPagePanelProps) {
  const [ urlSearchParams, setUrlSearchParams ] = useSearchParams();

  const isCompactMode = useSelector(props.appDataSelectors.getIsCompactMode);
  const isDarkMode = useSelector(props.appDataSelectors.getIsDarkMode);

  const appTheme = React.useMemo(
    () => getAppTheme({
      isDarkMode: isDarkMode,
    }), [isDarkMode]
  );

  const showCurrentlyOpenTabsModalUrlQueryKey = React.useMemo(
    () => props.showCurrentlyOpenTabsModalUrlQueryKey ?? "show-currently-open-tabs",
    [ props.showCurrentlyOpenTabsModalUrlQueryKey ]);

  const showQuickSwitchTabsModalUrlQueryKey = React.useMemo(
    () => props.showCurrentlyOpenTabsModalUrlQueryKey ?? "show-quick-switch-tabs",
    [ props.showCurrentlyOpenTabsModalUrlQueryKey ]);

  const showCurrentlyOpenTabsModal = React.useMemo(
    () => urlSearchParams.get(showCurrentlyOpenTabsModalUrlQueryKey) === trmrk.jsonBool.true,
    [urlSearchParams]);

  const onCloseCurrentlyOpenTabsModal = React.useCallback(() => {
    const newUrlSearchParamsInit = extractParams(
      urlSearchParams,
      paramsArr => removekeys(
        paramsArr,
        [showCurrentlyOpenTabsModalUrlQueryKey]));

    setUrlSearchParams(newUrlSearchParamsInit);
  }, [urlSearchParams,
    showCurrentlyOpenTabsModal]);

  const showQuickSwitchTabsModal = React.useMemo(
    () => urlSearchParams.get(showQuickSwitchTabsModalUrlQueryKey) === trmrk.jsonBool.true,
    [urlSearchParams]);

  const onCloseQuickSwitchTabsModal = React.useCallback(() => {
    const newUrlSearchParamsInit = extractParams(
      urlSearchParams,
      paramsArr => removekeys(
        paramsArr,
        [showQuickSwitchTabsModalUrlQueryKey]));

    setUrlSearchParams(newUrlSearchParamsInit);
  }, [urlSearchParams,
    showCurrentlyOpenTabsModal]);

  const onTabsBtnSinglePress = React.useCallback((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => {
    const newUrlSearchParamsInit = extractParams(
      urlSearchParams,
      paramsArr => {
        paramsArr.push([showCurrentlyOpenTabsModalUrlQueryKey, trmrk.jsonBool.true]);
        return paramsArr;
      });

    setUrlSearchParams(newUrlSearchParamsInit);
  }, [urlSearchParams,
    showCurrentlyOpenTabsModal]);

  const onTabsBtnLongPressOrRightClick = React.useCallback((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => {
    const newUrlSearchParamsInit = extractParams(
      urlSearchParams,
      paramsArr => {
        paramsArr.push([showQuickSwitchTabsModalUrlQueryKey, trmrk.jsonBool.true]);
        return paramsArr;
      });

    setUrlSearchParams(newUrlSearchParamsInit);
  }, [urlSearchParams,
    showCurrentlyOpenTabsModal]);

  const onTabsGoBackBtnSingleClick = React.useCallback((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => {
    if (props.onTabsGoBackBtnSingleClick) {
      props.onTabsGoBackBtnSingleClick(ev, coords);
    }
  }, []);

  const onTabsGoForwardBtnSingleClick = React.useCallback((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => {
    if (props.onTabsGoForwardBtnSingleClick) {
      props.onTabsGoForwardBtnSingleClick(ev, coords);
    }
  }, []);

  const onTabsGoBackBtnLongPress = React.useCallback((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => {
    if (props.onTabsGoBackBtnLongPress) {
      props.onTabsGoBackBtnLongPress(ev, coords);
    }
  }, []);

  const onTabsGoForwardBtnLongPress = React.useCallback((ev: MouseEvent | TouchEvent, coords: TouchOrMouseCoords) => {
    if (props.onTabsGoForwardBtnLongPress) {
      props.onTabsGoForwardBtnLongPress(ev, coords);
    }
  }, []);

  React.useEffect(() => {
  }, [
    urlSearchParams,
    showCurrentlyOpenTabsModal,
    isCompactMode,
    isDarkMode,
    appTheme,
    props.showDocPositionNavButtons,
    props.showDocEditUndoRedoButtons,
    props.docPositionBackBtnEnabled,
    props.docPositionForwardBtnEnabled ]);

  return (<AppBarsPanel {...props} showHomeBtn={false}
    panelClassName={[props.panelClassName, "trmrk-app-bars-page-panel"].join(" ")}
    appHeaderChildren={<React.Fragment>
        <ClickableElement component={IconButton} componentProps={{
            className: "trmrk-icon-btn"
          }} onSinglePress={onTabsBtnSinglePress}
            onLongPressOrSingleRightClick={onTabsBtnLongPressOrRightClick}><MatUIIcon iconName="tabs" /></ClickableElement>
        <ClickableElement component={IconButton} componentProps={{
            className: "trmrk-icon-btn", disabled: !props.tabsNavBackBtnEnabled
          }} onSinglePress={onTabsGoBackBtnSingleClick}
            onLongPress={onTabsGoBackBtnLongPress}><ArrowBackIcon /></ClickableElement>
        <ClickableElement component={IconButton} componentProps={{
            className: "trmrk-icon-btn", disabled: !props.tabsNavForwardBtnEnabled
          }} onSinglePress={onTabsGoForwardBtnSingleClick}
            onLongPress={onTabsGoForwardBtnLongPress}><ArrowForwardIcon /></ClickableElement>
        { props.appHeaderChildren }
      </React.Fragment>}
    appFooterMainRowChildren={<React.Fragment>
      { props.showDocPositionNavButtons ? <IconButton className="trmrk-icon-btn" disabled={!props.docPositionBackBtnEnabled}><ArrowCircleLeftIcon /></IconButton> : null }
      { props.showDocPositionNavButtons ? <IconButton className="trmrk-icon-btn" disabled={!props.docPositionForwardBtnEnabled}><ArrowCircleRightIcon /></IconButton> : null }
      { props.showDocEditUndoRedoButtons ? <IconButton className="trmrk-icon-btn" disabled={!props.docEditUndoBtnEnabled}><UndoIcon /></IconButton> : null }
      { props.showDocEditUndoRedoButtons ? <IconButton className="trmrk-icon-btn" disabled={!props.docEditUndoBtnEnabled}><RedoIcon /></IconButton> : null }
      { props.appFooterMainRowChildren }
      </React.Fragment>}
    appFooterContextRowChildren={<React.Fragment>
        { props.appFooterContextRowChildren }
      </React.Fragment>}>
      { props.children }
      <TrmrkDialog open={showCurrentlyOpenTabsModal} onClose={onCloseCurrentlyOpenTabsModal}
        appThemeCssClass={appTheme.cssClassName}
        dialogTitleCssClass={["trmrk-currently-open-tabs-dialog-title", props.currentTabsDialogTitleCssClass].join(" ")}
        dialogContentCssClass={["trmrk-currently-open-tabs-dialog-content", props.currentTabsDialogContentCssClass].join(" ")}
        title="Currently Open Tabs" fullWidth={true} maxWidth={false}>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
          <p>asdfasdf</p>
        </TrmrkDialog>
      <TrmrkDialog open={showQuickSwitchTabsModal} onClose={onCloseQuickSwitchTabsModal}
        appThemeCssClass={appTheme.cssClassName}
        dialogTitleCssClass={["trmrk-quick-switch-tabs-dialog-title", props.currentTabsDialogTitleCssClass].join(" ")}
        dialogContentCssClass={["trmrk-quick-switch-tabs-dialog-content", props.currentTabsDialogContentCssClass].join(" ")}
        title="Quick Switch Tabs">
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
          <p>qwerwqerqw</p>
        </TrmrkDialog>
    </AppBarsPanel>);
}
