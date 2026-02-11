import React from "react";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkAppModal.scss";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import { defaultTrmrkAppModalService } from "../TrmrkBasicAppLayout/TrmrkAppModalService";

export interface TrmrkAppModalProps extends React.ComponentPropsWithRef<'div'> {
  modalId: number;
  showHeader?: boolean | NullOrUndef;
  showTopBar?: boolean | NullOrUndef;
  topBarContents?: React.ReactNode | NullOrUndef;
  showTopToolbar?: boolean | NullOrUndef;
  topToolbarContents?: React.ReactNode | NullOrUndef;
  showFooter?: boolean | NullOrUndef;
  footerContents?: React.ReactNode | NullOrUndef;
  showCloseBtn?: boolean | NullOrUndef;
  showMinimizeBtn?: boolean | NullOrUndef;
  closing?: (() => void) | NullOrUndef;
}

const TrmrkAppModal = React.memo(React.forwardRef<HTMLDivElement, TrmrkAppModalProps>(({
  modalId,
  className,
  children,
  showHeader,
  showTopBar,
  topBarContents,
  showTopToolbar,
  topToolbarContents,
  showFooter,
  footerContents,
  showMinimizeBtn,
  showCloseBtn,
  closing,
  ...props
}, ref) => {

  const closebtnClicked = React.useCallback(() => {
    defaultTrmrkAppModalService.value.closeModal(modalId);
  }, []);

  const minimizebtnClicked = React.useCallback(() => {
    defaultTrmrkAppModalService.value.minimizeAllModals();
  }, []);

  return <div ref={ref} className={[className ?? "", "trmrk-app-modal-container"].join(' ')} {...props}>
    { (showHeader ?? true) && <div className="trmrk-app-modal-header">
      { (showTopBar ?? true) && <div className="trmrk-horiz-strip trmrk-app-modal-top-bar">
        <div className="trmrk-leading-content flex">
          <TrmrkBtn className="trmrk-btn-filled-system" onClick={() => {}}>
            <TrmrkIcon icon="mdi:chevron-double-up"></TrmrkIcon>
          </TrmrkBtn>
        </div>
        <div className="trmrk-content flex grow content-center ml-[2px]">
          {topBarContents}
        </div>
        <div className="trmrk-trailing-content flex mr-[2px]">
          { (showMinimizeBtn ?? true) && <TrmrkBtn className="trmrk-btn-filled-system" onClick={minimizebtnClicked}>
            <TrmrkIcon icon="mdi:minimize"></TrmrkIcon>
          </TrmrkBtn> }
          { (showCloseBtn ?? true) && <TrmrkBtn className="trmrk-btn-filled-system" onClick={closebtnClicked}>
            <TrmrkIcon icon="mdi:close"></TrmrkIcon>
          </TrmrkBtn> }
        </div>
      </div> }
    { (showTopToolbar ?? true) && <div className="trmrk-horiz-strip trmrk-app-modal-top-toolbar">{topToolbarContents}</div> }
    </div> }
    <div className="trmrk-app-modal-content">{ children }</div>
    { (showFooter ?? true) && <div className="trmrk-app-modal-footer">
      <div className="trmrk-horiz-strip trmrk-app-modal-top-toolbar">{footerContents}</div>
    </div> }
  </div>;
}));

export default TrmrkAppModal;
