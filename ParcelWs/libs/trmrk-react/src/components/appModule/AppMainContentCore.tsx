import React from "react";

import Box from "@mui/material/Box";

export default function AppMainContentCore({
    children,
    elemRef,
    className,
    style,
  }: {
    children: React.ReactNode
    elemRef: React.RefObject<HTMLDivElement>,
    className: string,
    style?: Object | null | undefined,
  }) {
  return (<Box className={className} sx={
    style ?? {position: "absolute", top: "0em", left: "0px", bottom: "0px", right: "0px" }}
    ref={elemRef}>
      { children }
  </Box>);
}
