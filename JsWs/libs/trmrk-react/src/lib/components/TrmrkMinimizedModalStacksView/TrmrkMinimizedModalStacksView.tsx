import React from "react";
import { useAtom } from "jotai";

import { NullOrUndef, withVal } from "@/src/trmrk/core";
import { mapNumMap } from "@/src/trmrk/map";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";

import { defaultTrmrkAppModalService } from "../TrmrkBasicAppLayout/TrmrkAppModalService";

import "./TrmrkMinimizedModalStacksView.scss";

export interface TrmrkMinimizedModalStacksViewProps {
  cssClass?: string | NullOrUndef;
}

export default function TrmrkMinimizedModalStacksView(
  {
    cssClass
  }: TrmrkMinimizedModalStacksViewProps
) {
  const [restorableMinimizedStackIds] = useAtom(defaultTrmrkAppModalService.value.restorableMinimizedStackIds);
  const [restorableMinimizedStacksModalIds] = useAtom(defaultTrmrkAppModalService.value.restorableMinimizedStacksModalIds);
  const [restorableMinimizedStacksModalTitles] = useAtom(defaultTrmrkAppModalService.value.restorableMinimizedStacksModalTitles);

  const restorableMinimizedStacks = React.useMemo(() => restorableMinimizedStackIds.map(stackId => ({
    stackId,
    modals: restorableMinimizedStacksModalIds[stackId].map(modalId => ({
      modalId,
      modalTitle: restorableMinimizedStacksModalTitles[stackId][modalId]
    })).reverse()
  })).reverse(), [
    restorableMinimizedStackIds,
    restorableMinimizedStacksModalIds,
    restorableMinimizedStacksModalTitles
  ]);

  const [restorableMinimizedStacksArr, setRestorableMinimizedStacksArr] = React.useState(
    restorableMinimizedStacks.map((stack) => ({...stack, isExpanded: false}))
  );

  const toggleExpandStackClicked = React.useCallback((stackId: number, expand: boolean) => {
    setRestorableMinimizedStacksArr(restorableMinimizedStacks.map((stack) => ({...stack, isExpanded: stack.stackId === stackId ? expand : false})));
  }, [restorableMinimizedStacksArr, restorableMinimizedStacks]);

  const restoreMinimizedModalsClicked = React.useCallback((stackId: number) => {
    defaultTrmrkAppModalService.value.restoreMinimizedModals(stackId);
  }, [restorableMinimizedStacksArr, restorableMinimizedStacks]);

  return <div className={["trmrk-minimized-modal-stacks-view", cssClass ?? ""].join(" ")}>
    { restorableMinimizedStacksArr.map(stack => <div className="trmrk-modals-stack" key={stack.stackId}>
      { stack.modals.length > 1 && <TrmrkBtn onClick={() => toggleExpandStackClicked(stack.stackId, !stack.isExpanded)}
          className="trmrk-toggle-expand-btn" borderWidth={1}>
        <TrmrkIcon icon={stack.isExpanded ? "mdi:expand-less" : 'mdi:expand-more'} /></TrmrkBtn> }

      { (!stack.isExpanded || stack.modals.length === 1) && <TrmrkBtn onClick={() => restoreMinimizedModalsClicked(stack.stackId)}
          className="trmrk-content-btn trmrk-collapsed-btn">
        <span className="trmrk-text leading-[40px] text-[15px] font-bold">
          { stack.modals[stack.modals.length - 1]?.modalTitle }</span></TrmrkBtn> }

      { (stack.isExpanded && stack.modals.length > 1) && <TrmrkBtn onClick={() => restoreMinimizedModalsClicked(stack.stackId)}
            className="trmrk-content-btn trmrk-expanded-btn trmrk-height-unset">
          { stack.modals.map(
            (modal, idx) => <span key={modal.modalId} className={["trmrk-text", idx === 0 ? "text-[15px] font-bold" : ""].join(" ")}>
              { modal.modalTitle }
            </span>) }</TrmrkBtn> }
    </div>) }
  </div>;
}
