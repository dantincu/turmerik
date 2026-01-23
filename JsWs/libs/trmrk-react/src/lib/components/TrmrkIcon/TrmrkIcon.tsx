import { Icon } from "@iconify/react";

import { ComponentProps } from "../defs/common";

export interface TrmrkIconProps extends ComponentProps {
  icon: string
}

export default function TrmrkIcon(
  { cssClass, icon }: TrmrkIconProps
) {
  return <div className={["trmrk-icon-wrapper", cssClass ?? ''].join(" ")}><Icon icon={icon} /></div>;
}
