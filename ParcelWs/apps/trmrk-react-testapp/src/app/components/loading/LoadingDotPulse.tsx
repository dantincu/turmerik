import React from "react";

import Box from "@mui/material/Box";

export interface LoadingDotPulseProps {
  className?: string | null | undefined;
  parentElTagName?: string | null | undefined;
}

export default function LoadingDotPulse(
  props: LoadingDotPulseProps
) {
    const className = ["trmrk-loading trmrk-loading-dot-pulse", props.className ?? ""].join(" ");
    const LoadingEl = () => <div className="trmrk-loading-el trmrk-loading-el-dot-pulse" />;

    React.useEffect(() => {
    }, [ props.className ] );

    switch (props.parentElTagName) {
      case "div":
        return (<div className={className}>
          <LoadingEl />
        </div>);
      case "li":
        return (<li className={className}>
          <LoadingEl />
        </li>);
      default:
        return (<Box className={className}>
          <LoadingEl />
        </Box>);
    }
}
