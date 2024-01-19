import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import { Routes, Route, Navigate } from "react-router-dom";

import Box from "@mui/material/Box";

import { appRoutes } from "../../services/routes";

import HomePage from "../../pages/home/HomePage";
import FilesHcyPage from "../../pages/filesHcy/FilesHcyPage";
import NotFoundPage from "../../pages/notFound/NotFoundPage";
import { getIsCompactMode } from "../../store/appDataSlice";
import { appModeCssClass } from "../../services/utils";

export default function MainContentContainer({
    setAppBodyEl,
    onUserScroll
  }: {
    setAppBodyEl: (appBodyElem: HTMLDivElement) => void,
    onUserScroll: () => void
  }) {
  const appBodyEl = useRef<HTMLDivElement>(null);

  const onScroll = () => onUserScroll();

  useEffect(() => {
    const bodyEl = appBodyEl.current!;
    setAppBodyEl(bodyEl);
    bodyEl!.addEventListener("scroll", onScroll);

    return () => {
      bodyEl!.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (<Box className={[ "trmrk-app-main", appModeCssClass.value ].join("  ")} ref={appBodyEl} sx={{
        width: "100%", position: "absolute",
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
