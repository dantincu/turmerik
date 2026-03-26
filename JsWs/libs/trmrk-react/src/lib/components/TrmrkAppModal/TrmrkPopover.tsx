import React from "react";
import { useAtom, PrimitiveAtom } from "jotai";

import { NullOrUndef, actWithValIf } from "@/src/trmrk/core";

import "./TrmrkAppModal.scss";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import { TrmrkPopoverPropsCoreWithData, defaultTrmrkPopoverService } from "../TrmrkBasicAppLayout/TrmrkPopoverService";
import { TrmrkAppModalWidth } from "./TrmrkAppModal";
import { updateRef } from "../../services/utils";

export interface TrmrkAppModalProps<TPopoverData = any> extends React.ComponentPropsWithRef<'div'>, TrmrkPopoverPropsCoreWithData<TPopoverData> {
  showBar?: boolean | NullOrUndef;
  barContents?: React.ReactNode | NullOrUndef;
  canMaximizeManually?: boolean | NullOrUndef;
  width?: TrmrkAppModalWidth | NullOrUndef;
  useDefaultLayout?: boolean | NullOrUndef;
}

const TrmrkPopover = React.memo(React.forwardRef<HTMLDivElement, TrmrkAppModalProps>(({
  rootElRef,
  popoverTitle,
  popoverId,
  className,
  children,
  data,
  showBar,
  barContents,
  canMaximizeManually,
  width,
  useDefaultLayout,
  ...props
}, ref) => {
  const [placeOnTop] = useAtom(defaultTrmrkPopoverService.value.currentPopoverIsPlacedOnTop);
  const [currentPopoverIsMaximized, setCurrentPopoverIsMaximized] = useAtom(defaultTrmrkPopoverService.value.currentPopoverIsMaximizedAtom);
  const [currentPopoverId] = useAtom(defaultTrmrkPopoverService.value.openPopovers.currentKeyAtom);

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
    defaultTrmrkPopoverService.value.closePopover(popoverId);
  }, [popoverId]);

  const closeAllBtnClicked = React.useCallback(() => {
    defaultTrmrkPopoverService.value.closeAllPopoversManually();
  }, []);

  const maximizeBtnClicked = React.useCallback(() => {
    setCurrentPopoverIsMaximized(!currentPopoverIsMaximized);
  }, [currentPopoverIsMaximized]);

  const refElAvailable = React.useCallback((el: HTMLDivElement | null) => {
    actWithValIf(rootElRef, (r) => updateRef(r, el));
    actWithValIf(ref, (r) => updateRef(r, el));
  }, []);

  const PopoverBar = React.memo(({
        popoverTitle,
        showBar,
        barContents
      }: {
        popoverTitle: PrimitiveAtom<string>,
        showBar: boolean | NullOrUndef,
        barContents: React.ReactNode
      }) => {
    const [popoverTitleVal] = useAtom(popoverTitle);
    const [canCloseManuallyVal] = useAtom(defaultTrmrkPopoverService.value.canCloseCurrentPopoverManuallyAtom);
    const [canCloseAllManuallyVal] = useAtom(defaultTrmrkPopoverService.value.canCloseAllPopoversManuallyAtom);

    return showBar && <div className="trmrk-modal-header">
        <div className="trmrk-horiz-strip trmrk-modal-top-bar">
          <div className="trmrk-leading-content flex">
            { canCloseManuallyVal && defaultTrmrkPopoverService.value.openPopovers.getKeys(
              ).length > 1 && <TrmrkBtn className="trmrk-btn-filled-system" onClick={closeBtnClicked}>
              <TrmrkIcon icon="mdi:arrow-back"></TrmrkIcon>
            </TrmrkBtn> }
          </div>
          <div className="trmrk-content flex grow content-center ml-[2px]">
            {barContents ?? <h2 className="text-center grow leading-[40px] pl-[10px] pr-[10px] whitespace-nowrap">{popoverTitleVal}</h2>}</div>
          <div className="trmrk-trailing-content flex mr-[2px]">
          { (canMaximizeManually ?? false) && <TrmrkBtn className="trmrk-btn-filled-system" onClick={maximizeBtnClicked}>
            <TrmrkIcon icon={`mdi:${currentPopoverIsMaximized ? "window-maximize" : "maximize"}`}></TrmrkIcon>
          </TrmrkBtn> }
            { canCloseManuallyVal && canCloseAllManuallyVal && <TrmrkBtn className="trmrk-btn-filled-system" onClick={closeAllBtnClicked}>
              <TrmrkIcon icon="mdi:close"></TrmrkIcon>
            </TrmrkBtn> }
          </div>
        </div>
      </div>;
    });

  React.useEffect(() => {
    defaultTrmrkPopoverService.value.openPopovers.keyedMap.map[currentPopoverId!]?.nodeData?.updatePopoverPositionCallback();

    setTimeout(() => {
      defaultTrmrkPopoverService.value.openPopovers.keyedMap.map[currentPopoverId!]?.nodeData?.updatePopoverPositionCallback();
    });
  }, []);

  return <div ref={refElAvailable} className={[
      className ?? "",
      currentPopoverIsMaximized ? "trmrk-is-maximized" : "",
      (useDefaultLayout ?? true) ? "trmrk-use-default-layout" : "",
      widthCssClass,
      "trmrk-popover-container"].join(' ')} {...props}>
    { !placeOnTop && <PopoverBar { ...{popoverTitle, showBar, barContents} } /> }
    <div className="trmrk-modal-body"><div className="trmrk-modal-body-content">{ children }</div></div>
    { placeOnTop && <PopoverBar { ...{popoverTitle, showBar, barContents} } /> }
  </div>;
}));

export default TrmrkPopover;
