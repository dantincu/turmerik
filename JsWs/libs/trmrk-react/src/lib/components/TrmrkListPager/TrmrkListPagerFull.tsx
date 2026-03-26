import React from "react";
import { PrimitiveAtom, atom, useAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";
import { TouchOrMouseCoords } from "@/src/trmrk-browser/domUtils/touchAndMouseEvents";
import { MultiClickServiceInitArgs } from "@/src/trmrk-browser/domUtils/MultiClickService";

import TrmrkTextBox from "../TrmrkInput/TrmrkTextBox";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import TrmrkScrollBar, { TrmrkScrollbarThumbPosition } from "../TrmrkScrollBar/TrmrkScrollBar";
import TrmrkMultiClickable from "../TrmrkMultiClickable/TrmrkMultiClickable";
import { HOCArgs } from "../defs/HOC";
import { updateFwdRef } from "../../services/utils";
import { defaultTrmrkPopoverService } from "../TrmrkBasicAppLayout/TrmrkPopoverService";
import "./TrmrkListPager.scss";

export interface TrmrkListPagerFullProps {
  cssClass?: string | NullOrUndef;
  pageSize: number;
  itemsCount: PrimitiveAtom<number>;
  skipItems: PrimitiveAtom<number>;
}

const containerIsWideDiffThresholdPx = 0;

const MultiClickable = React.memo(({
  hoc,
  args
}: {
  hoc: HOCArgs<HTMLButtonElement, {}>,
  args: (hostElem: HTMLButtonElement) => MultiClickServiceInitArgs
}) => <TrmrkMultiClickable hoc={hoc} args={args} />);

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
  const skipItemsValRef = React.useRef(skipItemsVal);

  const fastRewindBtnElRef = React.useRef<HTMLButtonElement>(null);
  const pageUpBtnElRef = React.useRef<HTMLButtonElement>(null);
  const pageDownBtnElRef = React.useRef<HTMLButtonElement>(null);
  const fastForwardBtnElRef = React.useRef<HTMLButtonElement>(null);

  const getPositionRatio = React.useCallback(
    (skipItemsStateNewVal: number) => {
      const retVal = Math.round(Math.round((skipItemsStateNewVal) / pageSize) * pageSize) / (itemsCountVal - pageSize);
      return retVal;
    }, [
      pageSize, itemsCountVal
    ]);

  const getNormalizedSkipItemsStateVal = React.useCallback(
    (skipItemsStateNewVal: number) => {
      skipItemsStateNewVal = Math.max(0, Math.min(skipItemsStateNewVal, itemsCountVal - pageSize));
      skipItemsStateNewVal = Math.round(skipItemsStateNewVal / pageSize) * pageSize;
      skipItemsStateNewVal = Math.round(skipItemsStateNewVal);
      return skipItemsStateNewVal;
    }, [pageSize, itemsCountVal]
  )

  const [positionAtom] = React.useState(() => {
    return atom({
      ratio: getPositionRatio(skipItemsStateVal),
      px: 0,
      trackLengthPx: 0
    } as TrmrkScrollbarThumbPosition)
  });

  const [positionAtomVal, setPositionAtomVal] = useAtom(positionAtom);

  const updateSkipItemsStateVal = React.useCallback((skipItemsStateNewVal: number) => {
    skipItemsValRef.current = skipItemsStateNewVal;
    setSkipItemsStateVal(skipItemsStateNewVal);
    setSkipItemsStrVal(skipItemsStateNewVal.toString());
  }, []);

  const updatePositionAtomVal = React.useCallback((skipItemsStateNewVal: number, event: TrmrkScrollbarThumbPosition) => {
    const newRatio = getPositionRatio(skipItemsStateNewVal);

    const positionAtomNewVal: TrmrkScrollbarThumbPosition = {
      px: Math.round(newRatio * event.trackLengthPx),
      ratio: newRatio,
      trackLengthPx: event.trackLengthPx,
    };

    setPositionAtomVal(positionAtomNewVal);
    updateSkipItemsStateVal(skipItemsStateNewVal);
  }, [positionAtomVal, pageSize, itemsCountVal, skipItemsStateVal, skipItemsStrVal]);

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
    updateSkipItemsStateVal(skipItemsStateNewVal);
  }, [itemsCountVal, pageSize, skipItemsStateVal, skipItemsStrVal]);

  const onScrollBarDragEnd = React.useCallback((event: TrmrkScrollbarThumbPosition) => {
    setIsScrolling(false);
    updatePositionAtomVal(skipItemsValRef.current, event);
  }, [isScrolling, skipItemsStateVal]);

  const onskipItemsTextBoxBlur = React.useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    if (!isScrolling) {
      const skipItemsStateNewVal = getNormalizedSkipItemsStateVal(parseInt(event.target.value));

      if (skipItemsStrVal !== skipItemsValRef.current.toString()) {
        skipItemsValRef.current = skipItemsStateNewVal;
        updatePositionAtomVal(skipItemsStateNewVal, positionAtomVal);
      }
    }
  }, [isScrolling, skipItemsStateVal, skipItemsStrVal, positionAtomVal]);

  const scrollBarJsx = React.useMemo(() => <TrmrkScrollBar position={positionAtom} isHorizontal={containerIsWide}
    onThumbDragStart={onScrollBarDragStart} onThumbDrag={onScrollBarDrag} onThumbDragEnd={onScrollBarDragEnd} />, [
      positionAtom, containerIsWide]);

  const fastRewindBtnPointerDownOrPressAndHold = React.useCallback(() => {
    const skipItemsStateNewVal = getNormalizedSkipItemsStateVal(skipItemsValRef.current - 10 * pageSize);
    updateSkipItemsStateVal(skipItemsStateNewVal);
  }, []);

  const pageUpBtnPointerDownOrPressAndHold = React.useCallback(() => {
    const skipItemsStateNewVal = getNormalizedSkipItemsStateVal(skipItemsValRef.current - pageSize);
    updateSkipItemsStateVal(skipItemsStateNewVal);
  }, []);

  const pageDownBtnPointerDownOrPressAndHold = React.useCallback(() => {
    const skipItemsStateNewVal = getNormalizedSkipItemsStateVal(skipItemsValRef.current + pageSize);
    updateSkipItemsStateVal(skipItemsStateNewVal);
  }, []);

  const fastForwardBtnPointerDownOrPressAndHold = React.useCallback(() => {
    const skipItemsStateNewVal = getNormalizedSkipItemsStateVal(skipItemsValRef.current + 10 * pageSize);
    updateSkipItemsStateVal(skipItemsStateNewVal);
  }, []);

  const fastRewindBtnMultiClickArgs = React.useCallback((hostElem: HTMLButtonElement) => ({
    hostElem,
    multiClickPointerDown: fastRewindBtnPointerDownOrPressAndHold,
    multiClickPressAndHold: fastRewindBtnPointerDownOrPressAndHold
  } as MultiClickServiceInitArgs), []);

  const pageUpBtnMultiClickArgs = React.useCallback((hostElem: HTMLButtonElement) => ({
    hostElem,
    multiClickPointerDown: pageUpBtnPointerDownOrPressAndHold,
    multiClickPressAndHold: pageUpBtnPointerDownOrPressAndHold
  } as MultiClickServiceInitArgs), []);

  const pageDownBtnMultiClickArgs = React.useCallback((hostElem: HTMLButtonElement) => ({
    hostElem,
    multiClickPointerDown: pageDownBtnPointerDownOrPressAndHold,
    multiClickPressAndHold: pageDownBtnPointerDownOrPressAndHold
  } as MultiClickServiceInitArgs), []);

  const fastForwardBtnMultiClickArgs = React.useCallback((hostElem: HTMLButtonElement) => ({
    hostElem,
    multiClickPointerDown: fastForwardBtnPointerDownOrPressAndHold,
    multiClickPressAndHold: fastForwardBtnPointerDownOrPressAndHold
  } as MultiClickServiceInitArgs), []);

  const fastRewindBtnHOCArgs = React.useMemo(() => {
    const fastRewindBtnHOCArgs: HOCArgs<HTMLButtonElement, {}> = {
      node: (props, ref) => <TrmrkBtn {...props} ref={el => {
              fastRewindBtnElRef.current = el;
              updateFwdRef(ref, el);
            }}>
          <TrmrkIcon className="absolute rotate-90 top-[7px]" icon="material-symbols:fast-rewind" />
        </TrmrkBtn>,
      props: {}
    };

    return fastRewindBtnHOCArgs;
  }, []);

  const pageUpBtnHOCArgs = React.useMemo(() => {
    const pageUpBtnHOCArgs: HOCArgs<HTMLButtonElement, {}> = {
      node: (props, ref) => <TrmrkBtn {...props} ref={el => {
              pageUpBtnElRef.current = el;
              updateFwdRef(ref, el);
            }}>
          <TrmrkIcon className="absolute rotate-270 top-[9px]" icon="material-symbols:play-arrow" />
        </TrmrkBtn>,
      props: {}
    };

    return pageUpBtnHOCArgs;
  }, []);

  const pageDownBtnHOCArgs = React.useMemo(() => {
    const pageDownBtnHOCArgs: HOCArgs<HTMLButtonElement, {}> = {
      node: (props, ref) => <TrmrkBtn {...props} ref={el => {
              pageDownBtnElRef.current = el;
              updateFwdRef(ref, el);
            }}>
          <TrmrkIcon className="absolute rotate-90 top-[6px]" icon="material-symbols:play-arrow" />
        </TrmrkBtn>,
      props: {}
    };

    return pageDownBtnHOCArgs;
  }, []);

  const fastForwardBtnHOCArgs = React.useMemo(() => {
    const fastForwardBtnHOCArgs: HOCArgs<HTMLButtonElement, {}> = {
      node: (props, ref) => <TrmrkBtn {...props} ref={el => {
              fastForwardBtnElRef.current = el;
              updateFwdRef(ref, el);
            }}>
          <TrmrkIcon className="absolute rotate-90 top-[8px]" icon="material-symbols:fast-forward" />
        </TrmrkBtn>,
      props: {}
    };

    return fastForwardBtnHOCArgs;
  }, []);

  const doneBtnClicked = React.useCallback(() => {
    setSkipItemsVal(skipItemsStateVal);
    defaultTrmrkPopoverService.value.closeCurrentPopover();
  }, [skipItemsStateVal]);

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
      <div className="flex flex-row">
        <TrmrkTextBox className="w-full trmrk-skip-items-textbox" onBlur={onskipItemsTextBoxBlur} onChange={(event) => {setSkipItemsStrVal(event.target.value)}}
          type="number" value={skipItemsStrVal} min={0} max={itemsCountVal - pageSize} step={1} />
        <TrmrkBtn className="trmrk-btn-filled-accept" onClick={doneBtnClicked}><TrmrkIcon icon="mdi:done" /></TrmrkBtn>
      </div>
      <div className="flex flex-row pt-[2px]">
        <MultiClickable hoc={fastRewindBtnHOCArgs} args={fastRewindBtnMultiClickArgs} />
        <MultiClickable hoc={pageUpBtnHOCArgs} args={pageUpBtnMultiClickArgs} />
        <MultiClickable hoc={pageDownBtnHOCArgs} args={pageDownBtnMultiClickArgs} />
        <MultiClickable hoc={fastForwardBtnHOCArgs} args={fastForwardBtnMultiClickArgs} />
      </div>
    </div>
    { scrollBarJsx }
  </div>;
}
