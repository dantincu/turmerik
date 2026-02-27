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

  console.log("restorableMinimizedStackIds", restorableMinimizedStackIds, restorableMinimizedStacksModalIds, restorableMinimizedStacksModalTitles);

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

  return <div className={["trmrk-minimized-modal-stacks-view", cssClass ?? ""].join(" ")}>
    { restorableMinimizedStacksArr.map(stack => <div className="trmrk-modals-stack" key={stack.stackId}>
      <TrmrkBtn onClick={() => toggleExpandStackClicked(stack.stackId, !stack.isExpanded)}><TrmrkIcon icon={stack.isExpanded ? "mdi:expand-less" : 'mdi:expand-more'} /></TrmrkBtn>
      { (!stack.isExpanded || stack.modals.length === 1) && <TrmrkBtn><span className="grow leading-[40px] text-[15px] font-bold">
        { stack.modals[stack.modals.length - 1]?.modalTitle }</span></TrmrkBtn> }

      { (stack.isExpanded && stack.modals.length > 1) && <TrmrkBtn className="trmrk-height-unset flex flex-col">{ stack.modals.map(
        (modal, idx) => <span key={modal.modalId} className={[idx === 0 ? "text-[15px] font-bold" : ""].join(" ")}>
          { modal.modalTitle }
        </span>) }</TrmrkBtn> }
    </div>) }
  </div>;
}
