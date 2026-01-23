import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkHorizStrip.scss";

import { ComponentProps } from "../defs/common";

export interface TrmrkHorizStripProps extends ComponentProps {}

export default function TrmrkHorizStrip(
  { cssClass, children }: Readonly<TrmrkHorizStripProps>
) {
  return (
    <div className={['trmrk-horiz-strip', cssClass ?? ''].join(' ')}>
      {children}
    </div>
  );
}
