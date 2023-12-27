import React, { useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { core as trmrk } from "trmrk";

import { routes } from "../../services/routes";

import AddressBar from "../../components/addressBar/AddressBar";
import { FilesHcyData, filesHcyCtxReducer } from "./FilesHcyData";
import { createFilesHcyContext, FilesHcyContext } from "./FilesHcyDataContext";
import { validateRootedPath } from "../../services/notes/notePath";

import { AppData } from "../../services/appData";

export default function FilesHcyPageBar() {
  const appData = useSelector<{ appData: AppData }, AppData>(state => state.appData);
  const dispatch = useDispatch();

  const filesHcyCtxInitialState = {
    history: {
      items: [],
      currentIdx: null,
      currentItem: null
    }
  } as unknown as FilesHcyData;

  const [ filesHcyState, filesHcyStateDispatch ] = React.useReducer(filesHcyCtxReducer, filesHcyCtxInitialState);
  const filesHcyData = createFilesHcyContext(filesHcyState, filesHcyStateDispatch);
  const filesHcyHistory = filesHcyData.history;
  const filesHcyCurrentIdx = filesHcyHistory.currentIdx ?? -1;

  console.log("filesHcyHistory", filesHcyHistory);

  const btnGoBackIsDisabled = filesHcyCurrentIdx < 0;
  const btnGoForwardIsDisabled = filesHcyHistory.items.length - filesHcyCurrentIdx <= 1;

  const currentIdnf = appData.currentIdnf ?? "";
  const navigate = useNavigate();

  console.log("currentIdnf", currentIdnf, filesHcyHistory.currentItem?.idnf);

  useEffect(() => {
    console.log("PAGE BAR EFFECT");

    if (!filesHcyHistory.currentItem || filesHcyHistory.currentItem.idnf !== currentIdnf) {
      console.log("pushing current idnf");
      filesHcyData.historyPush({
        idnf: currentIdnf
      });
    }
  }, []);

  const onBtnGoBackClick = () => {
    let nextIdnf = "";

    if (filesHcyCurrentIdx === 0) {
      filesHcyData.historyReplace({
        items: [{
          idnf: ""
        }],
        currentIdx: null,
        currentItem: null
      });
    } else {
      nextIdnf = filesHcyHistory.items[filesHcyCurrentIdx - 1].idnf;
      filesHcyData.historyGoBack();
    }
    
    const idnf = encodeURIComponent(nextIdnf);
    navigate([routes.files, idnf].join("/"));
  }

  const onBtnGoForwardClick = () => {
    const nextIdnf = filesHcyHistory.items[filesHcyCurrentIdx + 1].idnf;
    filesHcyData.historyGoForward();

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
      errMsg = validateRootedPath(appData.appConfig, newAddress);
    }

    return errMsg;
  };

  return (<FilesHcyContext.Provider value={filesHcyData}>
      <div className="trmrk-app-page-bar trmrk-files-hcy-page-bar">
        <IconButton className="trmrk-icon-button" disabled={btnGoBackIsDisabled} onClick={onBtnGoBackClick}><ArrowLeftIcon /></IconButton>
        <IconButton className="trmrk-icon-button" disabled={btnGoForwardIsDisabled} onClick={onBtnGoForwardClick}><ArrowRightIcon /></IconButton>
        <AddressBar address={currentIdnf}
          onAddressChanged={onAddressChanged}
          addressValidator={addressValidator}
          className="trmrk-main-address-bar" />
      </div>
    </FilesHcyContext.Provider>)
}
