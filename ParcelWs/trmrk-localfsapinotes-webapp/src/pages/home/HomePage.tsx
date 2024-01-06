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
  const dispatch = useDispatch();

  useEffect(() => {
    updateHtmlDocTitle();

    if (openAppTabs.length === 0) {
      dispatch(addTab({
        name: "Home",
        idnf: null,
        appPage: AppPage.ViewNoteItem,
        tabUuid: newUUid(),
        isCurrent: true,
        isEdited: null,
        isPreview: null,
      }));
    }
  });

  return (
    <Container className="trmrk-home-page" maxWidth="xl" sx={{ height: "800px" }}>Home</Container>);
}
