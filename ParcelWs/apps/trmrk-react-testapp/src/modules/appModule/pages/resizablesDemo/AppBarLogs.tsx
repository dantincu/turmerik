import React from "react";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

import { Kvp } from "trmrk/src/core";

import { FloatingTopBarPanelHeaderData, FloatingTopBarPanelHeaderOffset } from "trmrk-react/src/components/floatingTopBarPanel/FloatingTopBarPanel";

export interface AppBarLogsProps {
  data: FloatingTopBarPanelHeaderData;
  offset?: FloatingTopBarPanelHeaderOffset | null | undefined;
}

export default function AppBarLogs(props: AppBarLogsProps) {
  const data = React.useMemo<Kvp<string, any>[]>(() => [{
    key: "parentHeight",
    value: props.data.parentHeight,
  }, {
    key: "headerEl.style.top",
    value: props.data.headerEl.style.top,
  }, {
    key: "bodyEl.style.top",
    value: props.data.bodyEl.style.top,
  }, {
    key: "headerHeight",
    value: props.data.headerHeight,
  }, {
    key: "bodyElLastScrollTop",
    value: Math.round(props.data.bodyElLastScrollTop),
  }, {
    key: "bodyEl.scrollTop",
    value: Math.round(props.data.bodyEl.scrollTop),
  }, {
    key: "parentEl.scrollTop",
    value: Math.round(props.data.parentEl.scrollTop),
  }, {
    key: "parentEl.clientTop",
    value: Math.round(props.data.parentEl.clientTop),
  }, {
    key: "parentEl.offsetTop",
    value: Math.round(props.data.parentEl.offsetTop),
  }], [props.data, props.data.bodyElLastScrollTop, props.data.bodyEl]);

  const offset = React.useMemo<Kvp<string, any>[] | null>(() => props.offset ? [{
    key: "headerElTopOffset",
    value: props.offset.headerElTopOffset,
  }, {
    key: "mainElTopOffset",
    value: props.offset.mainElTopOffset,
  }] : null, [props.offset]);

  return (<Paper className="trmrk-page-form trmrk-app-bar-logs" sx={{ backgroundColor: "#880" }}>
    <div className="trmrk-flex-rows-group">
      { data.map((kvp, idx) => <div className="trmrk-flex-row" key={idx}>
        <Box className="trmrk-cell">{kvp.key}</Box>
        <Box className="trmrk-cell" sx={{fontWeight: "bold"}}>{kvp.value}</Box>
      </div>) }
    </div>
    { offset ? <div className="trmrk-flex-rows-group">
      { offset.map((kvp, idx) => <div className="trmrk-flex-row" key={idx}>
        <Box className="trmrk-cell">{kvp.key}</Box>
        <Box className="trmrk-cell" sx={{fontWeight: "bold"}}>{kvp.value}</Box>
      </div>) }
    </div> : null }
  </Paper>)
}
