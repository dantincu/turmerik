import React from "react";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkAppModal.scss";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import { defaultTrmrkAppModalService, TrmrkAppModalPropsCoreWithModalId } from "../TrmrkBasicAppLayout/TrmrkAppModalService";

export interface TrmrkAppModalProps extends React.ComponentPropsWithRef<'div'>, TrmrkAppModalPropsCoreWithModalId {
  showHeader?: boolean | NullOrUndef;
  showTopBar?: boolean | NullOrUndef;
  topBarContents?: React.ReactNode | NullOrUndef;
  showTopToolbar?: boolean | NullOrUndef;
  topToolbarContents?: React.ReactNode | NullOrUndef;
  showFooter?: boolean | NullOrUndef;
  footerContents?: React.ReactNode | NullOrUndef;
  canToggleToolbarsManually?: boolean | NullOrUndef;
  canMinimizeManually?: boolean | NullOrUndef;
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
  canToggleToolbarsManually,
  canMinimizeManually,
  canCloseManually,
  ...props
}, ref) => {

  const [ showTopBarOnly, setShowTopBarOnly ] = React.useState(false);

  const closebtnClicked = React.useCallback(() => {
    defaultTrmrkAppModalService.value.closeModal(modalId);
  }, []);

  const closeAllbtnClicked = React.useCallback(() => {
    defaultTrmrkAppModalService.value.closeAllModalsManually();
  }, []);

  const minimizebtnClicked = React.useCallback(() => {
    defaultTrmrkAppModalService.value.minimizeAllModals();
  }, []);

  const toggleShowTopBarOnlyClicked = React.useCallback(() => {
    setShowTopBarOnly(!showTopBarOnly);
  }, [showTopBarOnly]);

  return <div ref={ref} className={[className ?? "", "trmrk-app-modal-container"].join(' ')} {...props}>
    { (showHeader ?? true) && <div className="trmrk-modal-header">
      { (showTopBar ?? true) && <div className="trmrk-horiz-strip trmrk-modal-top-bar">
        <div className="trmrk-leading-content flex">
          { (canCloseManually ?? true) && <TrmrkBtn className="trmrk-btn-filled-system" onClick={closebtnClicked}>
            <TrmrkIcon icon="mdi:arrow-back"></TrmrkIcon>
          </TrmrkBtn> }
          { (canToggleToolbarsManually ?? true) && (showTopToolbar || showFooter) && <TrmrkBtn className="trmrk-btn-filled-system"
              onClick={toggleShowTopBarOnlyClicked}>
            <TrmrkIcon icon={`mdi:chevron-double-${showTopBarOnly ? 'down' : 'up'}`}></TrmrkIcon>
          </TrmrkBtn> }
        </div>
        <div className="trmrk-content flex grow content-center ml-[2px]">
          {topBarContents}
        </div>
        <div className="trmrk-trailing-content flex mr-[2px]">
          { (canMinimizeManually ?? true) && <TrmrkBtn className="trmrk-btn-filled-system"
              disabled={defaultTrmrkAppModalService.value.minimizedModals.getCurrentKeys().length > 0}
              onClick={minimizebtnClicked}>
            <TrmrkIcon icon="mdi:minimize"></TrmrkIcon>
          </TrmrkBtn> }
          { (canCloseManually ?? true) && <TrmrkBtn className="trmrk-btn-filled-system" onClick={closeAllbtnClicked}>
            <TrmrkIcon icon="mdi:close"></TrmrkIcon>
          </TrmrkBtn> }
        </div>
      </div> }
    { (showTopToolbar ?? false) && !showTopBarOnly && <div className="trmrk-horiz-strip trmrk-modal-top-toolbar">{topToolbarContents}</div> }
    </div> }
    <div className="trmrk-modal-content">{ children }</div>
    { (showFooter ?? false) && !showTopBarOnly && <div className="trmrk-modal-footer">
      <div className="trmrk-horiz-strip trmrk-modal-top-toolbar">{footerContents}</div>
    </div> }
  </div>;
}));

export default TrmrkAppModal;
