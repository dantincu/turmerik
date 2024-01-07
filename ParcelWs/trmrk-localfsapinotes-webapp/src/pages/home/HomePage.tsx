import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import { core as trmrk } from "trmrk";

import { addTab } from "../../store/appTabsDataSlice";
import { AppPage, AppTabsData, AppData } from "../../services/appData";
import { newUUid } from "../../services/utils";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import Panel from "../../components/panel/Panel";

export default function HomePage() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const openAppTabs = useSelector((state: { appTabs: AppTabsData }) => state.appTabs.openTabs);
  const dispatch = useDispatch();

  useEffect(() => {
    updateHtmlDocTitle();

    if (openAppTabs.length === 0) {
      dispatch(addTab({
        name: "Home",
        idnf: null,
        appPage: AppPage.Home,
        tabUuid: newUUid(),
        isCurrent: null,
        isEdited: null,
        isPreview: null,
      }));
      
      dispatch(addTab({
        name: "Home",
        idnf: null,
        appPage: AppPage.Home,
        tabUuid: newUUid(),
        isCurrent: true,
        isEdited: null,
        isPreview: null,
      }));
      
      dispatch(addTab({
        name: "Home",
        idnf: null,
        appPage: AppPage.Home,
        tabUuid: newUUid(),
        isCurrent: null,
        isEdited: null,
        isPreview: null,
      }));
    }
  });

  return (
    <Box className="trmrk-home-page">Home
      <Panel isScrollable={!appData.isCompactMode} style={{ width: "33%" }}>
        <Box sx={{ height: "800px",  }}>Home</Box>
      </Panel>
    </Box>);
}
