import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Container from "@mui/material/Container";

import { core as trmrk } from "trmrk";

import { addTab } from "../../store/appTabsDataSlice";
import { AppPage, AppTabsData } from "../../services/appData";
import { newUUid } from "../../services/utils";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";

export default function HomePage() {
  const openAppTabs = useSelector((state: { appTabs: AppTabsData }) => state.appTabs.openTabs);

  useEffect(() => {
    updateHtmlDocTitle();

    if (openAppTabs.length === 0) {
      addTab({
        name: "Home",
        idnf: null,
        appPage: AppPage.Home,
        tabUuid: newUUid(),
        isCurrent: true
      })
    }
  });

  return (
    <Container className="trmrk-home-page" maxWidth="xl" sx={{ height: "800px" }}>Home</Container>);
}
