import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkHorizStrip.scss";

import { CommponentProps } from "../defs/Common";

export interface TrmrkHorizStripProps extends CommponentProps {}

export default function TrmrkHorizStrip(
  { cssClass, children }: Readonly<TrmrkHorizStripProps>
) {
  return (
    <div className={['trmrk-horiz-strip', cssClass ?? ''].join(' ')}>
      {children}
    </div>
  );
}
