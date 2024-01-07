import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import { core as trmrk } from "trmrk";

import { addTab } from "../../store/appTabsDataSlice";
import { AppPage, AppTabsData, AppData } from "../../services/appData";
import { newUUid } from "../../services/utils";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import PagePanel from "../../components/panel/PagePanel";

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
      <PagePanel
        style={{ width: "20em", left: "0px" }}>
        <Box sx={{ height: "800px",  }}>Home1</Box>
      </PagePanel>
      <PagePanel
        style={{ width: "33%", left: "20em" }}>
        <Box sx={{ height: "100px",  }}>Home2</Box>
      </PagePanel>
    </Box>);
}
