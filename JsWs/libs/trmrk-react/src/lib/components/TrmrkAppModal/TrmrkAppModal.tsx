import React from "react";
import { atom, useAtom, PrimitiveAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkAppModal.scss";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import { defaultTrmrkAppModalService, TrmrkAppModalPropsCoreWithData } from "../TrmrkBasicAppLayout/TrmrkAppModalService";

export enum TrmrkAppModalWidth {
  Thin,
  Regular,
  Wide,
  Stretch,
}

export interface TrmrkAppModalProps<TModalData = any> extends React.ComponentPropsWithRef<'div'>, TrmrkAppModalPropsCoreWithData<TModalData> {
  showHeader?: boolean | NullOrUndef;
  showTopBar?: boolean | NullOrUndef;
  topBarContents?: React.ReactNode | NullOrUndef;
  showTopToolbar?: boolean | NullOrUndef;
  topToolbarContents?: React.ReactNode | NullOrUndef;
  showFooter?: boolean | NullOrUndef;
  footerContents?: React.ReactNode | NullOrUndef;
  canToggleToolbarsManually?: boolean | NullOrUndef;
  canMinimizeManually?: boolean | NullOrUndef;
  canMaximizeManually?: boolean | NullOrUndef;
  width?: TrmrkAppModalWidth | NullOrUndef;
}

const TrmrkAppModal = React.memo(React.forwardRef<HTMLDivElement, TrmrkAppModalProps>(({
  modalId,
  modalTitle,
  data,
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
  canMaximizeManually,
  canCloseManually,
  width,
  ...props
}, ref) => {

  const [ showTopBarOnly, setShowTopBarOnly ] = React.useState(false);
  const [canCloseManuallyVal] = useAtom(defaultTrmrkAppModalService.value.canCloseCurrentModalManuallyAtom);
  const [canCloseAllManuallyVal] = useAtom(defaultTrmrkAppModalService.value.canCloseAllModalsManuallyAtom);
  const [currentModalIsMaximizedAtom, setCurrentModalIsMaximizedAtom] = useAtom(defaultTrmrkAppModalService.value.currentModalIsMaximizedAtom);
  const [modalTitleVal] = useAtom(modalTitle);

  const widthCssClass = React.useMemo(() => {
    switch (width) {
      case TrmrkAppModalWidth.Thin:
        return "trmrk-width-thin";
      case TrmrkAppModalWidth.Wide:
        return "trmrk-width-wide";
      case TrmrkAppModalWidth.Stretch:
        return "trmrk-width-stretch";
      default:
        return "trmrk-width-regular";
    }
  }, [width]);

  const closeBtnClicked = React.useCallback(() => {
    defaultTrmrkAppModalService.value.closeModal(modalId);
  }, []);

  const closeAllBtnClicked = React.useCallback(() => {
    defaultTrmrkAppModalService.value.closeAllModalsManually();
  }, []);

  const minimizeBtnClicked = React.useCallback(() => {
    defaultTrmrkAppModalService.value.minimizeAllModals();
  }, []);

  const maximizeBtnClicked = React.useCallback(() => {
    setCurrentModalIsMaximizedAtom(!currentModalIsMaximizedAtom);
  }, [currentModalIsMaximizedAtom]);

  const toggleShowTopBarOnlyClicked = React.useCallback(() => {
    setShowTopBarOnly(!showTopBarOnly);
  }, [showTopBarOnly]);

  return <div ref={ref} className={[
        className ?? "",
        "trmrk-app-modal-container",
        widthCssClass,
        currentModalIsMaximizedAtom ? "trmrk-is-maximized" : ""].join(' ')}
      {...props}>
    { (showHeader ?? true) && <div className="trmrk-modal-header">
      { (showTopBar ?? true) && <div className="trmrk-horiz-strip trmrk-modal-top-bar">
        <div className="trmrk-leading-content flex">
          { (canCloseManuallyVal && defaultTrmrkAppModalService.value.getCurrentStackOpenModalKeys()!.length > 1) &&
          <TrmrkBtn className="trmrk-btn-filled-system" onClick={closeBtnClicked}>
            <TrmrkIcon icon="mdi:arrow-back"></TrmrkIcon>
          </TrmrkBtn> }
          { (canToggleToolbarsManually ?? true) && (showTopToolbar || showFooter) && <TrmrkBtn className="trmrk-btn-filled-system"
              onClick={toggleShowTopBarOnlyClicked}>
            <TrmrkIcon icon={`mdi:chevron-double-${showTopBarOnly ? 'down' : 'up'}`}></TrmrkIcon>
          </TrmrkBtn> }
        </div>
        <div className="trmrk-content flex grow content-center ml-[2px]">
          {topBarContents ?? <h2 className="text-center grow">{modalTitleVal}</h2>}
        </div>
        <div className="trmrk-trailing-content flex mr-[2px]">
          { (canMinimizeManually ?? true) && canCloseAllManuallyVal && <TrmrkBtn className="trmrk-btn-filled-system"
              onClick={minimizeBtnClicked}>
            <TrmrkIcon icon="mdi:minimize"></TrmrkIcon>
          </TrmrkBtn> }
          { (canMaximizeManually ?? true) && <TrmrkBtn className="trmrk-btn-filled-system" onClick={maximizeBtnClicked}>
            <TrmrkIcon icon={`mdi:${currentModalIsMaximizedAtom ? "window-maximize" : "maximize"}`}></TrmrkIcon>
          </TrmrkBtn> }
          { canCloseManuallyVal && canCloseAllManuallyVal && <TrmrkBtn className="trmrk-btn-filled-system" onClick={closeAllBtnClicked}>
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
