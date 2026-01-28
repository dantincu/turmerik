import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkHorizStrip.scss";

import { ComponentProps } from "../defs/common";

export interface TrmrkHorizStripProps extends ComponentProps {}

export default function TrmrkHorizStrip(
  { className, children }: Readonly<TrmrkHorizStripProps>
) {
  return (
    <div className={['trmrk-horiz-strip', className ?? ''].join(' ')}>
      {children}
    </div>
  );
}
