import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { core as trmrk } from "trmrk";

import { routes } from "../../services/routes";

import AddressBar from "../../components/addressBar/AddressBar";
import { FilesHcyHistory, FilesHcyHistoryItem } from "../../services/appData";
import { filesHcyHistoryGoBack, filesHcyHistoryGoForward, filesHcyHistoryPush, filesHcyHistoryReplace } from "../../store/filesHcyHistorySlice";
import { validateRootedPath } from "../../services/notes/notePath";

import { AppData, AppPagesData } from "../../services/appData";

export default function FilesHcyPageBar() {
  const appPages = useSelector((state: { appPages: AppPagesData }) => state.appPages);
  const appConfig = useSelector((state: { appData: AppData }) => state.appData.appConfig);
  const filesHcyHistory = useSelector((state: { filesHcyHistory: FilesHcyHistory }) => state.filesHcyHistory);
  const dispatch = useDispatch();

  const filesHcyCurrentIdx = filesHcyHistory.currentIdx ?? -1;

  const btnGoBackIsDisabled = filesHcyCurrentIdx < 0;
  const btnGoForwardIsDisabled = filesHcyHistory.items.length - filesHcyCurrentIdx <= 1;

  const currentIdnf = appPages.currentIdnf ?? "";
  const navigate = useNavigate();

  useEffect(() => {
    if (!filesHcyHistory.currentItem || filesHcyHistory.currentItem.idnf !== currentIdnf) {
      dispatch(filesHcyHistoryPush({
        idnf: currentIdnf
      }));
    }
  }, []);

  const onBtnGoBackClick = () => {
    let nextIdnf = "";

    if (filesHcyCurrentIdx === 0) {
      dispatch(filesHcyHistoryReplace({
        items: [{
          idnf: ""
        }],
        currentIdx: null,
        currentItem: null
      }));
    } else {
      nextIdnf = filesHcyHistory.items[filesHcyCurrentIdx - 1].idnf;
      dispatch(filesHcyHistoryGoBack());
    }
    
    const idnf = encodeURIComponent(nextIdnf);
    navigate([routes.files, idnf].join("/"));
  }

  const onBtnGoForwardClick = () => {
    const nextIdnf = filesHcyHistory.items[filesHcyCurrentIdx + 1].idnf;
    dispatch(filesHcyHistoryGoForward());

    const idnf = encodeURIComponent(nextIdnf);
    navigate([routes.files, idnf].join("/"));
  }

  const onAddressChanged = (newAddress: string) => {
    const idnf = encodeURIComponent(newAddress);
    navigate([routes.files, idnf].join("/"));
  }

  const addressValidator = (newAddress: string) => {
    let errMsg: string | null = null;

    if (trmrk.isNonEmptyStr(newAddress)) {
      errMsg = validateRootedPath(appConfig, newAddress);
    }

    return errMsg;
  };

  return (<div className="trmrk-app-page-bar trmrk-files-hcy-page-bar">
      <IconButton className="trmrk-icon-button" disabled={btnGoBackIsDisabled} onClick={onBtnGoBackClick}><ArrowLeftIcon /></IconButton>
      <IconButton className="trmrk-icon-button" disabled={btnGoForwardIsDisabled} onClick={onBtnGoForwardClick}><ArrowRightIcon /></IconButton>
      <AddressBar address={currentIdnf}
        onAddressChanged={onAddressChanged}
        addressValidator={addressValidator}
        className="trmrk-main-address-bar" />
    </div>)
}
