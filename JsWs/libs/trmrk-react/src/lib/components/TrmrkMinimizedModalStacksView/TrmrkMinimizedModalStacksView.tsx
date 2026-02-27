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
    }))
  })), [
    restorableMinimizedStackIds,
    restorableMinimizedStacksModalIds,
    restorableMinimizedStacksModalTitles
  ]);

  const [restorableMinimizedStacksArr, setRestorableMinimizedStacksArr] = React.useState(
    restorableMinimizedStacks.map((stack) => ({...stack, isExpanded: false}))
  );

  return <div className={["trmrk-minimized-modal-stacks-view", cssClass ?? ""].join(" ")}>
    { restorableMinimizedStacksArr.map(stack => <div className="trmrk-modals-stack" key={stack.stackId}>
      <TrmrkBtn><TrmrkIcon icon={stack.isExpanded ? "expand-less" : 'expand-more'} /></TrmrkBtn>
      <span className="trmrk-text">{ stack.modals[stack.modals.length - 1]?.modalTitle }</span>
    </div>) }
  </div>;
}
