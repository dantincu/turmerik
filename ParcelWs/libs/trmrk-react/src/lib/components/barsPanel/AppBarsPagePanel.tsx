import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import AppBar  from "@mui/material/AppBar";
import IconButton, { IconButtonTypeMap } from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";
import MenuIcon from "@mui/icons-material/Menu";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { AppBarSelectors, AppBarReducers } from "../../redux/appBarData";
import { AppDataSelectors, AppDataReducers } from "../../redux/appData";

import MatUIIcon from "../icons/MatUIIcon";
import ClickableElement from "../clickableElement/ClickableElement";

import AppBarsPanel, { AppBarsPanelProps } from "./AppBarsPanel";

export interface AppBarsPagePanelProps extends AppBarsPanelProps {
  showTabsModalUrlQueryKey?: string | null | undefined;
}

export default function AppBarsPagePanel(props: AppBarsPagePanelProps) {
  const [ urlSearchParams, setUrlSearchParams ] = useSearchParams();

  React.useEffect(() => {
  }, [
    props.showHomeBtn,
    urlSearchParams ]);

  return (<AppBarsPanel {...props}
    panelClassName={[props.panelClassName, "trmrk-app-bars-page-panel"].join(" ")}
    appHeaderChildren={<React.Fragment>
      <ClickableElement component={IconButton} componentProps={{
          className: "trmrk-icon-btn"
        }} onSinglePress={(ev, coords) => {console.log("onSinglePress");}}
        onDoublePress={(ev, coords) => {console.log("onDoublePress");}}
        onLongPress={(ev, coords) => {console.log("onLongPress");}}><MatUIIcon iconName="tabs" /></ClickableElement>
      { props.appHeaderChildren }
    </React.Fragment>} />);
}
