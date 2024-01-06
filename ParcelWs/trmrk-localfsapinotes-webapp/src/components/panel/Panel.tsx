import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux'

import Box from "@mui/material/Box";
import { SxProps, Theme } from "@mui/material";

export default function Panel({
    children,
    isScrollable,
    className,
    style,
  }: {
    children: React.ReactNode,
    isScrollable: boolean,
    className?: string | null | undefined
    style?: SxProps<Theme> | null | undefined
  }) {
    return (<Box className={[ isScrollable ? "trmrk-scrollable" : null, className ?? null ].join(" ")} sx={style ?? {}}>
        { children }
      </Box>);
}
