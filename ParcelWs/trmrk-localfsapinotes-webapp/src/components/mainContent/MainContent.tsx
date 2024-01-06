import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { Routes, Route, Navigate } from "react-router-dom";

import Box from "@mui/material/Box";

import { appRoutes } from "../../services/routes";
import { AppData } from "../../services/appData";

import HomePage from "../../pages/home/HomePage";
import FilesHcyPage from "../../pages/filesHcy/FilesHcyPage";
import NotFoundPage from "../../pages/notFound/NotFoundPage";

export default function MainContent({
    setAppBodyEl,
    onUserScroll
  }: {
    setAppBodyEl: (appBodyElem: HTMLDivElement) => void,
    onUserScroll: (isResize: boolean) => void
  }) {
  const appData = useSelector((state: { appData: AppData }) => state.appData);
  const appBodyEl = useRef<HTMLDivElement>(null);

  const onScroll = () => onUserScroll(false);
  const onResize = () => onUserScroll(true);

  useEffect(() => {
    const bodyEl = appBodyEl.current!;
    setAppBodyEl(bodyEl);

    bodyEl!.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onResize);
    return () => {
      bodyEl!.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (<Box className="trmrk-app-main trmrk-scrollable" ref={appBodyEl} sx={{
        width: "100%", overflowY: appData.isCompactMode ? "scroll" : "hidden", position: "absolute",
        top: "5em", left: "0px", bottom: "0px", right: "0px" }}>
      <Routes>
        <Route path="" element={<Navigate to="/home" />} />
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path={appRoutes.home} Component={HomePage} />
        <Route path={appRoutes.filesRoot} Component={FilesHcyPage} />
        <Route path={appRoutes.files} Component={FilesHcyPage} />
        <Route path="*" Component={NotFoundPage} />
      </Routes>
    </Box>);
}
