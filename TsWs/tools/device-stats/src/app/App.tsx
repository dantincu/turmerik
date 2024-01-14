import React, { useEffect, useRef, useState } from "react";

import { BrowserRouter } from "react-router-dom";

import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";

interface DeviceStats {
  userAgent: string,
  dpi: number,
  viewPortWidth: number,
  viewPortHeight: number,
  screenOrientationType: OrientationType,
  screenOrientationAngle: number
}

export default function App() {
  const [ deviceStats, setDeviceStats ] = useState<DeviceStats | null>(null);

  const updateDeviceStats = () => {
    const bodyEl = document.body;

    const deviceStatsValue: DeviceStats = {
      userAgent: window.navigator.userAgent,
      dpi: window.devicePixelRatio,
      viewPortWidth: bodyEl.clientWidth,
      viewPortHeight: bodyEl.clientHeight,
      screenOrientationType: screen.orientation.type,
      screenOrientationAngle: screen.orientation.angle,
    }

    setDeviceStats(deviceStatsValue);
  }

  useEffect(() => {
    updateDeviceStats();

    document.addEventListener("resize", updateDeviceStats);
    screen.orientation.addEventListener("change", updateDeviceStats);

    return () => {
      document.removeEventListener("resize", updateDeviceStats);
      screen.orientation.removeEventListener("change", updateDeviceStats);
    }
  }, [ deviceStats ]);

  return (
    <BrowserRouter>
        <CssBaseline />
          <Box className={[ "trmrk-app" ].join(" ")} sx={{ margin: "0px" }}>
            { deviceStats ? <Box className="trmrk-container">
              <h1>Device Stats</h1>
              <table className="trmrk-grid" cellSpacing={0} cellPadding={0}>
                <tr>
                  <td>User Agent</td><td>{ deviceStats.userAgent }</td>
                </tr>
                <tr>
                  <td>DPI Resolution</td><td>{ deviceStats.dpi }</td>
                </tr>
                <tr>
                  <td>Viewport Width</td><td>{ deviceStats.viewPortWidth }</td>
                </tr>
                <tr>
                  <td>Viewport Height</td><td>{ deviceStats.viewPortHeight }</td>
                </tr>
                <tr>
                  <td>Screen Orientation Type</td><td>{ deviceStats.screenOrientationType }</td>
                </tr>
                <tr>
                  <td>Screen Orientation Angle</td><td>{ deviceStats.screenOrientationAngle }</td>
                </tr>
              </table>
            </Box> : null }
          </Box>
    </BrowserRouter>
  );
}
