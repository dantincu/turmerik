import React from "react";

import styled from "@emotion/styled";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseButton from "@mui/icons-material/Close";

import { AppTabsData, AppTab, AppPage } from "../../../services/appData";
import { getResxCssClassName } from "../../../services/utils";
import TabHeadIcon from "./TabHeadIcon";

const EditedSymbol = styled.span`
  position: absolute;
  right: 1em;
  top: -0.3em;
  font-size: 1.5em;
  font-weight: bold;
`;

export default function TabHead({
    tab
  }: {
    tab: AppTab
  }) {
    const resxCssClassName = getResxCssClassName(tab.appPage);
    const border = (tab.isCurrent ? "2.5px" : "1.5px") + " solid";
    const marginTop = (tab.isCurrent ? "0.3em" : "0.25em");

    return (<Box className={[
      "trmrk-tab-head", resxCssClassName,
      tab.isCurrent ? "trmrk-current" : null,
      tab.isEdited ? "trmrk-edited" : null ].join(" ")}
      sx={{
        width: "15em", height: "2em", top: marginTop,
        border: border, borderRadius: "0.25em",
        position: "relative", display: "inline-block", marginLeft: "0.125em" }}>
        <IconButton className="trmrk-tab-head-icon" sx={{ padding: "0.1em" }}>
          <TabHeadIcon tab={tab} />
        </IconButton>
        <Box className="trmrk-tab-head-title"
          sx={{ display: "block", position: "absolute", top: "0.5em", left: "2em", right: "1.8em",
            overflow: "hidden", fontSize: "0.85em",
            fontStyle: tab.isPreview ? "italic" : "normal",
            // fontWeight: tab.isCurrent ? "bold" : "normal",
            wordBreak: "keep-all", whiteSpace: "nowrap", cursor: "pointer" }}>
          { tab.name }
        </Box>
        { /* tab.isEdited ? <EditedSymbol className="trmrk-edited-symbol">*</EditedSymbol> : null */ }
        <IconButton className="trmrk-tab-close-icon" sx={{ padding: "0.1em", paddingRight: "0px", float: "right" }}>
          <CloseButton />
        </IconButton>
      </Box>);
}
