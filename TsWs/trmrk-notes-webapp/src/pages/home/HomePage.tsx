import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import trmrk from "trmrk";

import { addTab } from "../../store/appTabsDataSlice";
import { AppPage, AppTabsData, AppData } from "../../services/appData";
import { getOpenTabs } from "../../store/appTabsDataSlice";
import { newUUid } from "../../services/utils";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import PageContainer from "../../components/mainContent/PageContainer";

export default function HomePage() {
  const openAppTabs = useSelector(getOpenTabs);
  const dispatch = useDispatch();

  useEffect(() => {
    updateHtmlDocTitle();

    if (openAppTabs.length === 0) {
      dispatch(addTab({
        name: "NotesHcy",
        path: null,
        relPath: null,
        appPage: AppPage.NotesHcy,
        tabUuid: newUUid(),
        isCurrent: true,
        isEditMode: null,
        isPreviewMode: null,
        isEdited: null,
      }));

      dispatch(addTab({
        name: "NoteFilesHcy",
        path: null,
        relPath: null,
        appPage: AppPage.NoteFilesHcy,
        tabUuid: newUUid(),
        isCurrent: null,
        isEditMode: null,
        isPreviewMode: true,
        isEdited: null,
      }));

      dispatch(addTab({
        name: "FilesHcy",
        path: null,
        relPath: null,
        appPage: AppPage.FilesHcy,
        tabUuid: newUUid(),
        isCurrent: true,
        isEditMode: true,
        isPreviewMode: null,
        isEdited: null,
      }));
      
      dispatch(addTab({
        name: "NoteItem",
        path: null,
        relPath: null,
        appPage: AppPage.NoteItem,
        tabUuid: newUUid(),
        isCurrent: null,
        isEditMode: true,
        isPreviewMode: null,
        isEdited: null,
      }));
      
      dispatch(addTab({
        name: "TextFile",
        path: null,
        relPath: null,
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
        leftPanelComponent={() => <></>}
        setRefEl={el => {}}>
      <Box sx={{ height: "1000vh" }}>asdf</Box>
    </PageContainer>);
}
