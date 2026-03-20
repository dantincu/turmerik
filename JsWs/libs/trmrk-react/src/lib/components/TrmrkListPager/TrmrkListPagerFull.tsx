import React from "react";
import { PrimitiveAtom, atom, useAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";
import { TouchOrMouseCoords } from "@/src/trmrk-browser/domUtils/touchAndMouseEvents";

import TrmrkTextBox from "../TrmrkInput/TrmrkTextBox";
import TrmrkScrollBar, { TrmrkScrollbarThumbPosition, TrmrkScrollBarProps } from "../TrmrkScrollBar/TrmrkScrollBar";
import "./TrmrkListPager.scss";

export interface TrmrkListPagerFullProps {
  cssClass?: string | NullOrUndef;
  pageSize: number;
  itemsCount: PrimitiveAtom<number>;
  skipItems: PrimitiveAtom<number>;
}

const containerIsWideDiffThresholdPx = 0;

const TrmrkListPagerFullScrollBar = React.memo(({
  position,
  cssClass,
  isHorizontal,
  onThumbDrag,
  onThumbDragEnd,
  onThumbDragStart,
}: TrmrkScrollBarProps) => {
  console.log("TrmrkListPagerFullScrollBar");

  return <TrmrkScrollBar
    position={position}
    cssClass={cssClass}
    isHorizontal={isHorizontal}
    onThumbDrag={onThumbDrag}
    onThumbDragEnd={onThumbDragEnd}
    onThumbDragStart={onThumbDragStart} />
  });

export default function TrmrkListPagerFull({
  cssClass,
  pageSize,
  itemsCount,
  skipItems
}: TrmrkListPagerFullProps) {
  const [containerIsWide, setContainerIsWide] = React.useState(false);
  const containerIsWideRefVal = React.useRef(false);
  const [isScrolling, setIsScrolling] = React.useState(false);

  const [itemsCountVal] = useAtom(itemsCount);
  const [skipItemsVal, setSkipItemsVal] = useAtom(skipItems);
  const [skipItemsStateVal, setSkipItemsStateVal] = React.useState(skipItemsVal);
  const [skipItemsStrVal, setSkipItemsStrVal] = React.useState(skipItemsVal.toString());

  const getPositionRatio = React.useCallback(
    (skipItemsStateNewVal: number) => {
      const retVal = Math.round(Math.round((skipItemsStateNewVal) / pageSize) * pageSize) / (itemsCountVal - pageSize);
      return retVal;
    }, [
      pageSize, itemsCountVal
    ]);

  const getNormalizedSkipItemsStateVal = React.useCallback(
    (skipItemsStateNewVal: number) => {
      skipItemsStateNewVal = Math.round(skipItemsStateNewVal / pageSize) * pageSize;
      skipItemsStateNewVal = Math.round(skipItemsStateNewVal);
      return skipItemsStateNewVal;
    }, [pageSize]
  )

  const [positionAtom] = React.useState(() => {
    return atom({
      ratio: getPositionRatio(skipItemsStateVal),
      px: 0,
      trackLengthPx: 0
    } as TrmrkScrollbarThumbPosition)
  });

  const [positionAtomVal, setPositionAtomVal] = useAtom(positionAtom);

  const updatePositionAtomVal = React.useCallback((skipItemsStateNewVal: number) => {
    const newRatio = getPositionRatio(skipItemsStateNewVal);

    setPositionAtomVal({
      px: Math.round(newRatio * positionAtomVal.trackLengthPx),
      ratio: newRatio,
      trackLengthPx: positionAtomVal.trackLengthPx,
    });
  }, [positionAtomVal, pageSize, itemsCountVal]);

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

  const onScrollBarDragStart = React.useCallback((event: TouchOrMouseCoords) => {
    setIsScrolling(true);
  }, [isScrolling]);

  const onScrollBarDrag = React.useCallback((event: TrmrkScrollbarThumbPosition) => {
    const skipItemsStateNewVal = getNormalizedSkipItemsStateVal((itemsCountVal - pageSize) * event.ratio);
    setSkipItemsStateVal(skipItemsStateNewVal);
    setSkipItemsStrVal(skipItemsStateNewVal.toString());
  }, [itemsCountVal, pageSize]);

  const onScrollBarDragEnd = React.useCallback((event: TrmrkScrollbarThumbPosition) => {
    setIsScrolling(false);
    updatePositionAtomVal(skipItemsStateVal);
  }, [isScrolling, skipItemsStateVal]);

  const onskipItemsTextBoxBlur = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (!isScrolling) {
      const skipItemsStateNewVal = getNormalizedSkipItemsStateVal(parseInt(event.target.value));

      if (skipItemsStrVal !== skipItemsStateNewVal.toString()) {
        setSkipItemsStateVal(skipItemsStateNewVal);
        setSkipItemsStrVal(skipItemsStateNewVal.toString());
        updatePositionAtomVal(skipItemsStateNewVal);
      }
    }
  }, [isScrolling, skipItemsStateVal, skipItemsStrVal]);

  const scrollBarJsx = React.useMemo(() => <TrmrkScrollBar position={positionAtom} isHorizontal={containerIsWide}
    onThumbDragStart={onScrollBarDragStart} onThumbDrag={onScrollBarDrag} onThumbDragEnd={onScrollBarDragEnd} />, [positionAtom, containerIsWide]);

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
      <TrmrkTextBox className="w-full trmrk-skip-items-textbox" onBlur={onskipItemsTextBoxBlur} onChange={(event) => {setSkipItemsStrVal(event.target.value)}}
        type="number" value={skipItemsStrVal} min={0} max={itemsCountVal - pageSize} step={1} />
    </div>
    { scrollBarJsx }
  </div>;
}
