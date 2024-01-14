import React from "react";

import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CircleIcon from "@mui/icons-material/Circle";

import { AppTab } from "../../../services/appData";
import { getResxCssClassName } from "../../../services/utils";
import TabHeadIcon from "./TabHeadIcon";

import CharIcon from "../../iconButtons/CharIcon";

export default function TabHead({
    tab
  }: {
    tab: AppTab
  }) {
    const resxCssClassName = getResxCssClassName(tab.appPage);
    const border = (tab.isCurrent ? "2.5px" : "1.5px") + " solid";
    const marginTop = "0em";

    return (<Box className={[
      "trmrk-tab-head", resxCssClassName,
      tab.isCurrent ? "trmrk-current" : null,
      tab.isEditMode ? "trmrk-edit-mode" : null,
      tab.isEdited ? "trmrk-edited" : null ].join(" ")}
      sx={{
        width: "15em", height: "2.2em", top: marginTop,
        border: border,
        borderTopLeftRadius: "0.5em", borderTopRightRadius: "0.5em",
        position: "relative", display: "inline-block" }}>
        <IconButton className="trmrk-tab-head-icon" sx={{ padding: "0.1em", paddingTop: "0.15em" }}>
          <TabHeadIcon tab={tab} />
        </IconButton>
        <Box className="trmrk-tab-head-title"
          sx={{ display: "block", position: "absolute",
            top: "0.6em", left: "2em", right: "2em",
            overflowX: "hidden", fontSize: "0.85em",
            fontStyle: tab.isPreviewMode ? "italic" : "normal",
            wordBreak: "keep-all", whiteSpace: "nowrap", cursor: "pointer" }}>
          { tab.name }
        </Box>
        <IconButton className="trmrk-tab-close-icon" sx={{ padding: "0.1em", paddingTop: "0.15em", float: "right" }}>
          { tab.isEdited ? <CircleIcon sx={{
            fontSize: "0.75em", marginTop: tab.isCurrent ? "0.15em" : "0.2em", marginRight: "0.1em" }} /> : <CharIcon
            fontSize="1.5em" lineHeight="0.8" marginTop={ tab.isCurrent ? "-0.03em" : "0em" }>&times;</CharIcon> }
        </IconButton>
      </Box>);
}
