import React from "react";

import { SvcIconProps } from "./SvcIconProps";

// from https://mui.com/material-ui/icons

export default function DatabaseIcon(
  props: SvcIconProps
) {
  React.useEffect(() => {

  }, [ props.fill, props.stroke, props.strokeWidth, props.viewBox ]);

  return (<svg
    xmlns="http://www.w3.org/2000/svg"
    fill={props.fill ?? "none"}
    viewBox={props.viewBox ?? "0 0 24 24"}
    strokeWidth={props.strokeWidth ?? 1.5}
    stroke={props.stroke ?? "currentColor"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d=""
    />
  </svg>);
}
