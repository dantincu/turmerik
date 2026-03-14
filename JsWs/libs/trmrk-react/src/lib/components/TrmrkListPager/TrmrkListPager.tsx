import React from "react";
import { PrimitiveAtom, useAtom, atom } from "jotai";

import { NullOrUndef, actWithVal } from "@/src/trmrk/core";

import { defaultTrmrkPopoverService, TrmrkPopoverPropsCoreWithData } from "../TrmrkBasicAppLayout/TrmrkPopoverService";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import TrmrkPopover from "../TrmrkAppModal/TrmrkPopover";
import { TrmrkAppModalWidth } from "../TrmrkAppModal/TrmrkAppModal";
import TrmrkListPagerFull from "./TrmrkListPagerFull";

import "./TrmrkListPager.scss";

export interface TrmrkListPagerProps {
  cssClass?: string | NullOrUndef;
  pageSize: number;
  itemsCount: PrimitiveAtom<number>;
  skipItems: PrimitiveAtom<number>;
}

const FullPagerPopover = ({
  data,
  ...props
}: TrmrkPopoverPropsCoreWithData<TrmrkListPagerProps>) => {
  const { pageSize, itemsCount, skipItems } = data;

  return (<TrmrkPopover className="trmrk-list-pager-full-popover" canMaximizeManually={true}
        data={data} {...props} showBar={true} width={TrmrkAppModalWidth.Stretch}>
      <TrmrkListPagerFull {...{pageSize, itemsCount, skipItems}}></TrmrkListPagerFull>
    </TrmrkPopover>);
};

export default function TrmrkListPager({
  cssClass,
  pageSize,
  itemsCount,
  skipItems
}: TrmrkListPagerProps) {
  const [ itemsCountVal ] = useAtom(itemsCount);
  const [ skipItemsVal, setSkipItemsVal ] = useAtom(skipItems);

  const mainBtnEl = React.useRef<HTMLElement>(null);

  const goToPrevPageBtnClicked = React.useCallback(() => {
    let newSkipItemsVal = skipItemsVal - pageSize;
    newSkipItemsVal = Math.max(0, newSkipItemsVal);

    if (newSkipItemsVal !== skipItemsVal) {
      setSkipItemsVal(newSkipItemsVal);
    }
  }, [skipItemsVal, itemsCountVal, pageSize]);

  const goToNextPageBtnClicked = React.useCallback(() => {
    let newSkipItemsVal = skipItemsVal + pageSize;
    newSkipItemsVal = Math.min(itemsCountVal - pageSize, newSkipItemsVal);

    if (newSkipItemsVal !== skipItemsVal) {
      setSkipItemsVal(newSkipItemsVal);
    }
  }, [skipItemsVal, itemsCountVal, pageSize]);

  const mainBtnClicked = React.useCallback(() => {
    defaultTrmrkPopoverService.value.openPopover({
      props: {
        popoverTitle: atom("Skipped items count")
      },
      popover: FullPagerPopover,
      anchorElAtom: atom(mainBtnEl.current),
      data: {pageSize, itemsCount, skipItems}
    });
  }, []);

  return (itemsCountVal > pageSize) && <div className={["trmrk-list-pager-container flex-grow-[1]", cssClass ?? ""].join(" ")}>
    <TrmrkBtn onClick={goToPrevPageBtnClicked} disabled={skipItemsVal < pageSize}><TrmrkIcon icon="mdi:keyboard-arrow-up" /></TrmrkBtn>
    <TrmrkBtn onClick={mainBtnClicked} className="flex-shrink-[0]" ref={el => {
      mainBtnEl.current = el;
      actWithVal(defaultTrmrkPopoverService.value, svc => svc.store.set(svc.currentPopoverAnchorEl, el));
    }}>{ skipItemsVal } <br /> Skipped Items</TrmrkBtn>
    <TrmrkBtn onClick={goToNextPageBtnClicked} disabled={skipItemsVal + pageSize >= itemsCountVal}><TrmrkIcon icon="mdi:keyboard-arrow-down" /></TrmrkBtn>
  </div>;
}
