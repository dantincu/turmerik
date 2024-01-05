import React from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";

import { AppTabsData } from "../../../services/appData";

import TabHead from "./TabHead";

export default function AppPageBar() {
  const openTabs = useSelector((state: { appTabs: AppTabsData }) => state.appTabs.openTabs);

  return (<Box className="trmrk-app-tabs-bar" sx={{
    position: "absolute", left: "5em", right: "5em", overflow: "hidden", height: "2.5em", whiteSpace: "nowrap" }}>
    <Box className="trmrk-tabs-list">
      {openTabs.map(tab => <TabHead tab={tab} key={tab.tabUuid} />)}
    </Box>
  </Box>)
}
