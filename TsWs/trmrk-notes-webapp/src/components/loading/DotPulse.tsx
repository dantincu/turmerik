import React from "react";

import Box from "@mui/material/Box";

export default function LoadingDotPulse({
    className
  }: {
    className?: string | null | undefined
  }) {
    className ??= null;

    return (<Box className={["trmrk-loading trmrk-loading-dot-pulse", className].join(" ")}></Box>);
}
