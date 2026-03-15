import React from "react";
import { PrimitiveAtom, atom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import TrmrkTextBox from "../TrmrkInput/TrmrkTextBox";
import TrmrkScrollBar, { TrmrkScrollbarThumbPosition } from "../TrmrkScrollBar/TrmrkScrollBar";
import "./TrmrkListPager.scss";

export interface TrmrkListPagerFullProps {
  cssClass?: string | NullOrUndef;
  pageSize: number;
  itemsCount: PrimitiveAtom<number>;
  skipItems: PrimitiveAtom<number>;
}

const containerIsWideDiffThresholdPx = 0;

export default function TrmrkListPagerFull({
  cssClass
}: TrmrkListPagerFullProps) {
  const [containerIsWide, setContainerIsWide] = React.useState(false);
  const containerIsWideRefVal = React.useRef(false);

  const [position] = React.useState(() => atom({
    ratio: 0,
    px: 0,
    trackLengthPx: 0
  } as TrmrkScrollbarThumbPosition));

  const updateContainerIsWideFlag = React.useCallback(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let shouldSwitchVal: boolean;
    const containerIsWideVal = containerIsWideRefVal.current;

    if (containerIsWideVal) {
      shouldSwitchVal = height - width > containerIsWideDiffThresholdPx;
    } else {
      shouldSwitchVal = width - height > containerIsWideDiffThresholdPx;
    }

    if (shouldSwitchVal) {
      setContainerIsWide(
        containerIsWideRefVal.current = !containerIsWideVal);
    }
  }, []);

  const onScrollBarDrag = React.useCallback((event: TrmrkScrollbarThumbPosition) => {

  }, []);

  const onScrollBarDragEnd = React.useCallback((event: TrmrkScrollbarThumbPosition) => {

  }, []);

  React.useEffect(() => {
    window.addEventListener("resize", updateContainerIsWideFlag);
    updateContainerIsWideFlag();

    return () => {
      window.removeEventListener("resize", updateContainerIsWideFlag);
    };
  }, []);

  return <div className={["trmrk-list-pager-full-container",
        containerIsWide ? "trmrk-is-wide" : "",
        cssClass ?? ""].join(" ")}>
    <div className="trmrk-main-container">
      <TrmrkTextBox type="number" className="w-full trmrk-skip-items-textbox" />
    </div>
    <TrmrkScrollBar position={position} isHorizontal={containerIsWide}
      onThumbDrag={onScrollBarDrag} onThumbDragEnd={onScrollBarDragEnd} />
  </div>;
}
