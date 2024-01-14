import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircleIcon from "@mui/icons-material/Circle";

import { TabsListOffset, TabsListKeyElements, assureOffsetHasWidth, updateTabsBarListOffset } from "../../../services/htmlDoc/tabsBarListOffsetUpdater";

import TabHead from "./TabHead";

import { AppTabsData, AppTab, AppPage } from "../../../services/appData";
import { getResxCssClassName } from "../../../services/utils";
import TabHeadIcon from "./TabHeadIcon";

import CharIcon from "../../iconButtons/CharIcon";

export default function AppTabsBarPortrait() {
  const openTabs = useSelector((state: { appTabs: AppTabsData }) => state.appTabs.openTabs);
  const currentTab = openTabs.find(tab => tab.isCurrent)!;

  const resxCssClassName = getResxCssClassName(currentTab.appPage);
  const border = "1.5px solid";

  return (<Box className="trmrk-app-tabs-bar" sx={{
      position: "absolute", left: "5em", right: "5em", overflow: "hidden", height: "2.5em", whiteSpace: "nowrap" }}>
    <Box className="trmrk-tabs-list" sx={{
        display: "block", position: "relative", height: "2.2em", top: "0.25em" }}>
      <Box className={[
      "trmrk-tab-head", resxCssClassName,
      "trmrk-current",
      currentTab.isEditMode ? "trmrk-edit-mode" : null,
      currentTab.isEdited ? "trmrk-edited" : null ].join(" ")}
      sx={{
        position: "absolute",
        display: "block",
        left: "0px",
        right: "0px",
        bottom: "0px",
        top: "0px",
        border: border,
        borderTopLeftRadius: "0.5em", borderTopRightRadius: "0.5em" }}>
        <IconButton className="trmrk-tab-head-icon" sx={{ padding: "0.1em", paddingTop: "0.15em" }}>
          <TabHeadIcon tab={currentTab} />
        </IconButton>
        <Box className="trmrk-tab-head-title"
          sx={{ display: "block", position: "absolute", top: "0.6em", left: "2em", right: "2em",
            overflowX: "hidden", fontSize: "0.85em",
            fontStyle: currentTab.isPreviewMode ? "italic" : "normal",
            // textDecoration: tab.isEditMode ? "underline": "none",
            wordBreak: "keep-all", whiteSpace: "nowrap", cursor: "pointer" }}>
          { currentTab.name }
        </Box>
        <IconButton className="trmrk-tab-close-icon" sx={{ padding: "0.1em", paddingTop: "0.15em", float: "right" }}>
          { currentTab.isEdited ? <CircleIcon sx={{
            fontSize: "0.75em", marginTop: currentTab.isCurrent ? "0.15em" : "0.2em", marginRight: "0.1em" }} /> : <CharIcon
            fontSize="1.5em" lineHeight="0.8" marginTop={ currentTab.isCurrent ? "-0.03em" : "0em" } >&times;</CharIcon> }
        </IconButton>
      </Box>
    </Box>
  </Box>)
}
