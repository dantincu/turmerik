import React from "react";

import Box from "@mui/material/Box";

export default function AppBarCore({
    children,
    elemRef,
    className,
    style,
    height
  }: {
    children: React.ReactNode
    elemRef: React.RefObject<HTMLDivElement>,
    className: string,
    style?: Object | null | undefined,
    height?: string | null | undefined
  }) {
  return (<Box className={className} sx={
    style ?? {width: "100%", height: height ?? "5em", position: "absolute", top: "0px" }}
    ref={elemRef}>
      { children }
  </Box>);
}
