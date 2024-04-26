import React from "react";

export interface MatUIIconProps {
  className?: string | null | undefined;
  iconName: string;
}

export default function MatUIIcon(props: MatUIIconProps) {
  return (<span className={[ "trmrk-mat-ui-icon material-symbols-outlined", props.className ?? "" ].join(" ")}>{ props.iconName }</span>);
}
