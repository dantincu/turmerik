import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import trmrk from "trmrk";

import { addTab } from "../../store/appTabsDataSlice";
import { AppPage, AppTabsData, AppData } from "../../services/appData";
import { newUUid } from "../../services/utils";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import PageContainer from "../../components/mainContent/PageContainer";

export default function HomePage() {
  const openAppTabs = useSelector((state: { appTabs: AppTabsData }) => state.appTabs.openTabs);
  const dispatch = useDispatch();

  useEffect(() => {
    updateHtmlDocTitle();

    if (openAppTabs.length === 0) {
      dispatch(addTab({
        name: "NotesHcy",
        idnf: null,
        appPage: AppPage.NotesHcy,
        tabUuid: newUUid(),
        isCurrent: true,
        isEditMode: null,
        isPreviewMode: null,
        isEdited: null,
      }));

      dispatch(addTab({
        name: "NoteFilesHcy",
        idnf: null,
        appPage: AppPage.NoteFilesHcy,
        tabUuid: newUUid(),
        isCurrent: null,
        isEditMode: null,
        isPreviewMode: true,
        isEdited: null,
      }));

      dispatch(addTab({
        name: "FilesHcy",
        idnf: null,
        appPage: AppPage.FilesHcy,
        tabUuid: newUUid(),
        isCurrent: true,
        isEditMode: true,
        isPreviewMode: null,
        isEdited: null,
      }));
      
      dispatch(addTab({
        name: "NoteItem",
        idnf: null,
        appPage: AppPage.NoteItem,
        tabUuid: newUUid(),
        isCurrent: null,
        isEditMode: true,
        isPreviewMode: null,
        isEdited: null,
      }));
      
      dispatch(addTab({
        name: "TextFile",
        idnf: null,
        appPage: AppPage.TextFile,
        tabUuid: newUUid(),
        isCurrent: null,
        isEditMode: true,
        isPreviewMode: null,
        isEdited: null,
      }));
    }
  });

  return (
    <PageContainer
        className="trmrk-home-page"
        leftPanelComponent={() => <></>}>
      <Box sx={{ height: "1000vh" }}>asdf</Box>
    </PageContainer>);
}
