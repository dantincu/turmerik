import React, { useEffect, useRef, useState } from "react";

import { BrowserRouter } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

interface DeviceStats {
  dpi: number,
  viewPortWidth: number,
  viewPortHeight: number,
}

export default function App() {
  const [ deviceStats, setDeviceStats ] = useState<DeviceStats | null>(null);

  const updateDeviceStats = () => {
    const bodyEl = document.body;

    const deviceStatsValue: DeviceStats = {
      dpi: window.devicePixelRatio,
      viewPortWidth: bodyEl.clientWidth,
      viewPortHeight: bodyEl.clientHeight
    }

    setDeviceStats(deviceStatsValue);
  }

  useEffect(() => {
    updateDeviceStats();

    document.addEventListener("resize", updateDeviceStats);

    return () => {
      document.removeEventListener("resize", updateDeviceStats);
    }
  }, [ deviceStats ]);

  return (
    <BrowserRouter>
        <CssBaseline />
          <Box className={[ "trmrk-app" ].join(" ")} sx={{ margin: "0px" }}>
            { deviceStats ? <Box className="trmrk-container" sx={{ height: "100%", paddingLeft: "10%", paddingRight: "10%", paddingTop: "2.5em" }}>
              <h1>Device Stats</h1>
              <Box className="trmrk-row">
                <Box className="trmrk-field-name"><span className="trmrk-text">DPI Resolution: </span></Box>
                <Box className="trmrk-field-value"><span className="trmrk-text">{ deviceStats.dpi }</span></Box>
              </Box>
              <Box className="trmrk-row">
                <Box className="trmrk-field-name"><span className="trmrk-text">Viewport Width: </span></Box>
                <Box className="trmrk-field-value"><span className="trmrk-text">{ deviceStats.viewPortWidth }</span></Box>
              </Box>
              <Box className="trmrk-row">
                <Box className="trmrk-field-name"><span className="trmrk-text">Viewport Height: </span></Box>
                <Box className="trmrk-field-value"><span className="trmrk-text">{ deviceStats.viewPortHeight }</span></Box>
              </Box>
            </Box> : null }
          </Box>
    </BrowserRouter>
  );
}
