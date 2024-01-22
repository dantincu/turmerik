import React, { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HomeIcon from "@mui/icons-material/Home";

import trmrk from "trmrk";

import { AppRouteInfo } from "../../services/appData";
import { getCurrentRoutePathName } from "../../store/appDataSlice"
import { getRouteInfo, defaultPageNotFoundHtmlDocTitle } from "../../services/routes";

import { updateHtmlDocTitle } from "../../services/htmlDoc/htmlDocTitle";

export default function TrmrkAppBar() {
  const currentRoutePathName = useSelector(getCurrentRoutePathName);
  const routeInfo = getRouteInfo(currentRoutePathName);
  const navigate = useNavigate();

  const onGoHomeClick = () => {
    navigate("/");
  }

  useEffect(() => {
    if (routeInfo) {
      updateHtmlDocTitle(routeInfo.htmlDocTitle);
    } else {
      updateHtmlDocTitle(defaultPageNotFoundHtmlDocTitle);
    }
  }, [ currentRoutePathName ]);

  return (<AppBar className="trmrk-app-bar" sx={{ display: "flex" }}>
      <Box className="trmrk-top-bar">
        <IconButton sx={{ color: "white", position: "absolute" }} onClick={onGoHomeClick}><HomeIcon /></IconButton>
        <Typography variant="h5" component="h1" sx={{ paddingTop: "0.15em", textAlign: "center" }}>
          { routeInfo?.appTitle ?? "404" }</Typography>
      </Box>
    </AppBar>);
}
