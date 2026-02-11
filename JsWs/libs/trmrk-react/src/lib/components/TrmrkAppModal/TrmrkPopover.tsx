import React from "react";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkAppModal.scss";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import { defaultTrmrkAppModalService } from "../TrmrkBasicAppLayout/TrmrkAppModalService";

export interface TrmrkAppModalProps extends React.ComponentPropsWithRef<'div'> {
  popoverId: number;
  closing?: (() => void) | NullOrUndef;
}

const TrmrkPopover = React.memo(React.forwardRef<HTMLDivElement, TrmrkAppModalProps>(({
  popoverId,
  className,
  children,
  closing,
  ...props
}, ref) => {

  const backbtnClicked = React.useCallback(() => {
  }, []);

  const closebtnClicked = React.useCallback(() => {
  }, []);

  return <div ref={ref} className={[className ?? "", "trmrk-popover-container"].join(' ')} {...props}>
    <div className="trmrk-modal-header">
      <div className="trmrk-horiz-strip trmrk-modal-top-bar">
        <div className="trmrk-leading-content flex">
          <TrmrkBtn className="trmrk-btn-filled-system" onClick={backbtnClicked}>
            <TrmrkIcon icon="mdi:arrow-back"></TrmrkIcon>
          </TrmrkBtn>
        </div>
        <div className="trmrk-content flex grow content-center ml-[2px]"></div>
        <div className="trmrk-trailing-content flex mr-[2px]">
          <TrmrkBtn className="trmrk-btn-filled-system" onClick={closebtnClicked}>
            <TrmrkIcon icon="mdi:close"></TrmrkIcon>
          </TrmrkBtn>
        </div>
      </div>
    </div>
    <div className="trmrk-modal-content">{ children }</div>
  </div>;
}));

export default TrmrkPopover;
