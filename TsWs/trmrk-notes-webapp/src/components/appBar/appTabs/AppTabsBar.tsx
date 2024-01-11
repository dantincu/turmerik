import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import { AppTabsData, AppData } from "../../../services/appData";
import { TabsListOffset, TabsListKeyElements, assureOffsetHasWidth, updateTabsBarListOffset } from "../../../services/htmlDoc/tabsBarListOffsetUpdater";

import TabHead from "./TabHead";

const tabsListOffset: TabsListOffset = {
  tabsBarWidth: 0,
  tabsListWidth: 0,
  tabHeadWidth: 0,
  tabsListLeftSpacerWidth: 0,
  tabsListRightSpacerWidth: 0,
  leftOffset: 0,
  tabsCount: 0,
  currentTabIdx: -1
}

export default function AppTabsBar() {
  const openTabs = useSelector((state: { appTabs: AppTabsData }) => state.appTabs.openTabs);
  const appData = useSelector((state: { appData: AppData }) => state.appData);

  const [ appBarVisible, setAppBarVisible ] = useState(false);

  const tabsBarRef = React.useRef<HTMLDivElement>();
  const tabsListRef = React.useRef<HTMLDivElement>();
  
  const tabsListLeftSpacerRef = React.useRef<HTMLDivElement>();
  const tabsListRightSpacerRef = React.useRef<HTMLDivElement>();

  const tabsListKeyElems: TabsListKeyElements<HTMLDivElement> = {
    tabsBarRefEl: tabsBarRef.current,
    tabsListRefEl: tabsListRef.current,
    tabsListLeftSpacerRefEl: tabsListLeftSpacerRef.current,
    tabsListRightSpacerRefEl: tabsListRightSpacerRef.current,
  };

  const onUpdateTabsBarListOffset = () => {
    tabsListOffset.tabsCount = openTabs.length;

    tabsListOffset.currentTabIdx = openTabs.findIndex(
      tab => tab.isCurrent
    );

    updateTabsBarListOffset(
      tabsListOffset,
      tabsListKeyElems
    );
  }

  useEffect(() => {
    if (appData.showAppBar) {
      setAppBarVisible(appData.showAppBar);
    }

    assureOffsetHasWidth(tabsListOffset, tabsListKeyElems);
    window.addEventListener("resize", onUpdateTabsBarListOffset);
    onUpdateTabsBarListOffset();

    return () => {
      window.removeEventListener("resize", onUpdateTabsBarListOffset);
    };
  }, [ appBarVisible, openTabs, tabsListLeftSpacerRef, tabsListRightSpacerRef ]);

  return (<Box className="trmrk-app-tabs-bar" sx={{
      position: "absolute", left: "5em", right: "5em", overflow: "hidden", height: "2.5em", whiteSpace: "nowrap" }} ref={tabsBarRef}>
    <Box className="trmrk-tabs-list-spacer trmrk-before" ref={tabsListLeftSpacerRef} />
    <Box className="trmrk-tabs-list-spacer trmrk-after" ref={tabsListRightSpacerRef} />
    <Box className="trmrk-tabs-list" sx={{
        display: "inline-flex", position: "relative", height: "2.2em", top: "0.25em" }} ref={tabsListRef}>
      {openTabs.map(tab => <TabHead tab={tab} key={tab.tabUuid} />)}
    </Box>
  </Box>)
}
