import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from "react-router-dom";

import IconButton from "@mui/material/IconButton";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { core as trmrk } from "trmrk";

import { routes } from "../../services/routes";
import { getRoute } from "../../services/utils";

import AddressBar from "../../components/addressBar/AddressBar";
import { FilesHcyHistory } from "../../services/appData";
import { filesHcyHistoryGoBack, filesHcyHistoryGoForward, filesHcyHistoryPush, filesHcyHistoryInsert } from "../../store/filesHcyHistorySlice";
import { validateRootedPath } from "../../services/notes/notePath";

import { AppData, AppPagesData } from "../../services/appData";

export default function FilesHcyPageBar() {
  const appPages = useSelector((state: { appPages: AppPagesData }) => state.appPages);
  const appConfig = useSelector((state: { appData: AppData }) => state.appData.appConfig);
  const filesHcyHistory = useSelector((state: { filesHcyHistory: FilesHcyHistory }) => state.filesHcyHistory);
  const dispatch = useDispatch();

  const [ currentIdnf, setCurrentIdnf ] = useState(appPages.currentIdnf ?? "");

  const filesHcyCurrentIdx = filesHcyHistory.currentIdx ?? -1;

  // const btnGoBackIsDisabled = filesHcyCurrentIdx < 0 || (filesHcyCurrentIdx === 0 && !trmrk.isNonEmptyStr(currentIdnf, true));
  const btnGoBackIsDisabled = filesHcyCurrentIdx <= 0;
  const btnGoForwardIsDisabled = filesHcyHistory.items.length - filesHcyCurrentIdx <= 1;

  const navigate = useNavigate();
  console.log("bar - filesHcyHistory0", filesHcyHistory);

  useEffect(() => {
  console.log("bar - filesHcyHistory1", filesHcyHistory);
    if (!filesHcyHistory.currentItem || filesHcyHistory.currentItem.idnf !== currentIdnf) {
      dispatch(filesHcyHistoryPush({
        idnf: currentIdnf
      }));
    }
  }, [ currentIdnf ]);

  const onBtnGoBackClick = () => {
    let nextIdnf = "";

    if (filesHcyCurrentIdx === 0) {
      if (trmrk.isNonEmptyStr(currentIdnf, true)) {
        dispatch(filesHcyHistoryInsert({
          items: [{
            idnf: ""
          }],
          idx: 0,
          currentIdx: 0,
        }));
      }
    } else {
      nextIdnf = filesHcyHistory.items[filesHcyCurrentIdx - 1].idnf;
      dispatch(filesHcyHistoryGoBack());
    }

    if (nextIdnf !== currentIdnf) {
      navigate(getRoute(routes.files, nextIdnf));
      setCurrentIdnf(nextIdnf);
    }
  }

  const onBtnGoForwardClick = () => {
    const nextIdnf = filesHcyHistory.items[filesHcyCurrentIdx + 1].idnf;
    dispatch(filesHcyHistoryGoForward());

    navigate(getRoute(routes.files, nextIdnf));
    setCurrentIdnf(nextIdnf);
  }

  const onAddressChanged = (newAddress: string) => {
    dispatch(filesHcyHistoryPush({
      idnf: newAddress
    }));

    navigate(getRoute(routes.files, newAddress));
    setCurrentIdnf(newAddress);
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
