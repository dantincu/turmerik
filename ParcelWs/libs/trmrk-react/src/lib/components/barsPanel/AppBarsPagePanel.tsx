import React from "react";
import { Link, useSearchParams, URLSearchParamsInit, ParamKeyValuePair } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';

import AppBar  from "@mui/material/AppBar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
  showTabsModalUrlQueryKey?: string | null | undefined;
  currentTabsDialogTitleCssClass?: string | null | undefined;
  currentTabsDialogContentCssClass?: string | null | undefined;
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

  const showTabsModalUrlQueryKey = React.useMemo(
    () => props.showTabsModalUrlQueryKey ?? "show-current-tabs",
    [ props.showTabsModalUrlQueryKey ]);

  const showCurrentTabsModal = React.useMemo(
    () => urlSearchParams.get(showTabsModalUrlQueryKey) === trmrk.jsonBool.true,
    [urlSearchParams]);

  const onCloseCurrentTabsModal = React.useCallback(() => {
    const newUrlSearchParamsInit = extractParams(
      urlSearchParams,
      paramsArr => removekeys(
        paramsArr,
        [showTabsModalUrlQueryKey]));

    setUrlSearchParams(newUrlSearchParamsInit);
  }, [urlSearchParams,
    showCurrentTabsModal]);

  const onTabsBtnSingleClick = React.useCallback((ev: React.MouseEvent | React.TouchEvent, coords: TouchOrMouseCoords) => {
    const newUrlSearchParamsInit = extractParams(
      urlSearchParams,
      paramsArr => {
        paramsArr.push([showTabsModalUrlQueryKey, trmrk.jsonBool.true]);
        return paramsArr;
      });

    setUrlSearchParams(newUrlSearchParamsInit);
  }, [urlSearchParams,
    showCurrentTabsModal]);

  React.useEffect(() => {
  }, [
    urlSearchParams,
    showCurrentTabsModal,
    isCompactMode,
    isDarkMode,
    appTheme ]);

  return (<AppBarsPanel {...props} showHomeBtn={false}
    panelClassName={[props.panelClassName, "trmrk-app-bars-page-panel"].join(" ")}
    appHeaderChildren={<React.Fragment>
        <ClickableElement component={IconButton} componentProps={{
            className: "trmrk-icon-btn"
          }} onSinglePress={onTabsBtnSingleClick}><MatUIIcon iconName="tabs" /></ClickableElement>
        { props.appHeaderChildren }
      </React.Fragment>}>
      <TrmrkDialog open={showCurrentTabsModal} onClose={onCloseCurrentTabsModal}
        appThemeCssClass={appTheme.cssClassName} isCompactMode={isCompactMode}
        dialogTitleCssClass={["trmrk-current-tabs-dialog-title", props.currentTabsDialogTitleCssClass].join(" ")}
        dialogContentCssClass={["trmrk-current-tabs-dialog-content", props.currentTabsDialogContentCssClass].join(" ")}
        title="Currently Open Tabs">
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
    </AppBarsPanel>);
}
