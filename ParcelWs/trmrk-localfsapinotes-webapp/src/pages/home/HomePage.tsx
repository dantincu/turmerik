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
        isEdited: true,
        isPreview: null,
      }));

      dispatch(addTab({
        name: "Turmerik asdfasdf masdf asd fasd  fasd",
        idnf: null,
        appPage: AppPage.EditNoteItem,
        tabUuid: newUUid(),
        isCurrent: null,
        isEdited: null,
        isPreview: true,
      }));
      
      dispatch(addTab({
        name: "Turmerik asd fasd  fasd Turmerikasd",
        idnf: null,
        appPage: AppPage.ViewTextFile,
        tabUuid: newUUid(),
        isCurrent: null,
        isEdited: true,
        isPreview: null,
      }));
      
      dispatch(addTab({
        name: "Turmerik asd fasd  fasd Tur*ikasd",
        idnf: null,
        appPage: AppPage.EditTextFile,
        tabUuid: newUUid(),
        isCurrent: null,
        isEdited: true,
        isPreview: null,
      }));
      
      dispatch(addTab({
        name: "Notes",
        idnf: null,
        appPage: AppPage.NotesHcy,
        tabUuid: newUUid(),
        isCurrent: null,
        isEdited: true,
        isPreview: null,
      }));
      
      dispatch(addTab({
        name: "Note Files",
        idnf: null,
        appPage: AppPage.NoteFilesHcy,
        tabUuid: newUUid(),
        isCurrent: null,
        isEdited: true,
        isPreview: null,
      }));
      
      dispatch(addTab({
        name: "Files",
        idnf: null,
        appPage: AppPage.FilesHcy,
        tabUuid: newUUid(),
        isCurrent: null,
        isEdited: true,
        isPreview: null,
      }));
    }
  });

  return (
    <Container className="trmrk-home-page" maxWidth="xl" sx={{ height: "800px" }}>Home</Container>);
}
