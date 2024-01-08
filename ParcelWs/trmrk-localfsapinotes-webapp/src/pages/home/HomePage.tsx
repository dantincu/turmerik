import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import { core as trmrk } from "trmrk";

import { addTab } from "../../store/appTabsDataSlice";
import { AppPage, AppTabsData, AppData } from "../../services/appData";
import { newUUid } from "../../services/utils";
import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";
import PagePanel from "../../components/panel/PagePanel";

import { updateResizablePanelOffset } from "../../services/resizablePanelOffsetUpdater";

export default function HomePage() {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const openAppTabs = useSelector((state: { appTabs: AppTabsData }) => state.appTabs.openTabs);
  const dispatch = useDispatch();

  const leftPanelElRef = useRef<HTMLDivElement | null>(null);
  const rightPanelElRef = useRef<HTMLDivElement | null>(null);

  const onSetLeftPanelEl = (refEl: HTMLDivElement) => {
    leftPanelElRef.current = refEl;
  }

  const onSetRightPanelEl = (refEl: HTMLDivElement) => {
    rightPanelElRef.current = refEl;
  }

  const onResize = (dx: number) => {
    updateResizablePanelOffset(
      leftPanelElRef.current,
      rightPanelElRef.current,
      dx,
      null
    );
  };

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
    <Box className="trmrk-home-page">Home
      <PagePanel setPanelEl={onSetLeftPanelEl}
        leftIsResizable={false}
        style={{ width: "20em", left: "0px" }}>
        <Box sx={{ height: "800px",  }}>Home1</Box>
      </PagePanel>
      <PagePanel setPanelEl={onSetRightPanelEl}
        onResize={onResize}
        style={{ right: "0px", left: "20em" }}>
        <Box sx={{ height: "100px",  }}>Home2</Box>
      </PagePanel>
    </Box>);
}
