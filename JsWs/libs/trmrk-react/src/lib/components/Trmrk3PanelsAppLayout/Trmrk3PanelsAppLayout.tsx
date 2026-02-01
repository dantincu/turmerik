"use client";

import React from "react";
import { useAtom } from "jotai";

import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";
import { actWithValIf } from "@/src/trmrk/core";
import { PointerDragEvent, DragEventData } from "@/src/trmrk-browser/domUtils/PointerDragService";
import { pointerIsTouchOrLeftMouseBtn } from "@/src/trmrk-browser/domUtils/touchAndMouseEvents";

import "./Trmrk3PanelsAppLayout.scss";
import { ComponentProps } from "../defs/common";
import { HOCArgs } from "../defs/HOC";
import TrmrkBasicAppLayout from "../TrmrkBasicAppLayout/TrmrkBasicAppLayout";
import { overridingBottomToolbarContents, useToolbarOverridingContentKeys } from "../TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";
import TrmrkSplitContainerCore from "../TrmrkSplitContainerCore/TrmrkSplitContainerCore";
import TrmrkLoader from "../TrmrkLoader/TrmrkLoader";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import TrmrkPointerDraggable from "../TrmrkPointerDraggable/TrmrkPointerDraggable";

import {
  trmrk3PanelsAppLayoutAtoms,
  leftPanelContents,
  middlePanelContents,
  rightPanelContents,
  TrmrkAppLayoutPanel,
  useAllowShowPanelAtoms,
  usePanelContentsKeyAtoms,
  useShowPanelAtoms,
  useShowPanelLoaderAtoms,
  trmrk3PanelsAppLayoutConstants
} from "./Trmrk3PanelsAppLayoutService";

const ResizePanelsBottomToolbarContents = React.memo(({
  showLeftPanelValue,
  showMiddlePanelValue,
  showRightPanelValue,
  leftPanelContainerElRef,
  middlePanelContainerElRef
}: {
  showLeftPanelValue: boolean,
  showMiddlePanelValue: boolean,
  showRightPanelValue: boolean,
  leftPanelContainerElRef: React.RefObject<HTMLDivElement | null>,
  middlePanelContainerElRef: React.RefObject<HTMLDivElement | null>
}) => {
  const [leftPanelWidthRatio, setLeftPanelWidthRatio] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelWidthRatio);
  const [middlePanelWidthRatio, setMiddlePanelWidthRatio] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanelWidthRatio);

  const resizeLeftPanelBtnDrag = React.useCallback((event: PointerDragEvent) => {
    const leftPanelContainerEl = leftPanelContainerElRef.current;

    if (leftPanelContainerEl) {
      const containerWidthPx = leftPanelContainerEl.offsetWidth;
      const diffPx = event.event.screenX - event.pointerDownEvent.screenX;
      const diffPercent = (diffPx * 100.0) / containerWidthPx;
      const newLeftPanelWidthRatio = (leftPanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultLeftPanelWidthRatio) + diffPercent;
      setLeftPanelWidthRatio(newLeftPanelWidthRatio);
    }
  }, [leftPanelWidthRatio]);

  const resizeMiddlePanelBtnDrag = React.useCallback((event: PointerDragEvent) => {
    const middlePanelContainerEl = middlePanelContainerElRef.current;

    if (middlePanelContainerEl) {
      const containerWidthPx = middlePanelContainerEl.offsetWidth;
      const diffPx = event.event.screenX - event.pointerDownEvent.screenX;
      const diffPercent = (diffPx * 100.0) / containerWidthPx;
      const newLeftPanelWidthRatio = (middlePanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultMiddlePanelWidthRatio) + diffPercent;
      setMiddlePanelWidthRatio(newLeftPanelWidthRatio);
    }
  }, []);

  return <>
    { showLeftPanelValue && <div className="flex justify-end" style={{
        width: `calc(${leftPanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultLeftPanelWidthRatio}%)`
      }}>
        <TrmrkPointerDraggable hoc={{
          node: (props, ref) => {
            return <TrmrkBtn
              {...props} ref={ref as React.Ref<HTMLButtonElement>} className="right-[-25px]">
                <TrmrkIcon icon="mdi:drag-vertical-variant" /></TrmrkBtn>;
          },
          props: {}}} args={{
            drag: resizeLeftPanelBtnDrag,
            eventDataAvailable: (data: DragEventData, isForMouseUp: boolean) => {
              data.isValid ||= pointerIsTouchOrLeftMouseBtn(data.event as PointerEvent, isForMouseUp);
            }
          }}></TrmrkPointerDraggable>
    </div> }
    { (showMiddlePanelValue && showRightPanelValue) && <div className="flex" style={{
        width: showLeftPanelValue ? `calc(${100 - (leftPanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultLeftPanelWidthRatio)}%)` : "100%"
      }}>
      <div className="flex justify-end" style={{
          width: `calc(${middlePanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultMiddlePanelWidthRatio}% + ${showLeftPanelValue ? "4px" : "0px"})`
        }}>
          <TrmrkPointerDraggable hoc={{
          node: (props, ref) => <TrmrkBtn {...props} ref={ref as React.Ref<HTMLButtonElement>} className="right-[-25px]">
            <TrmrkIcon icon="mdi:drag-vertical-variant" /></TrmrkBtn>,
          props: {}
        }} args={{
          drag: resizeMiddlePanelBtnDrag,
          eventDataAvailable: (data, isForMouseUp) => {
            data.isValid ||= pointerIsTouchOrLeftMouseBtn(data.event as PointerEvent, isForMouseUp);
          }
        }}></TrmrkPointerDraggable>
      </div>
    </div> }
  </>;
});

export interface Trmrk3PanelsAppLayoutProps extends ComponentProps {}

export default function Trmrk3PanelsAppLayout({ className: cssClass, children }: Readonly<Trmrk3PanelsAppLayoutProps>) {
  const leftPanelContainerElRef = React.useRef<HTMLDivElement | null>(null);
  const middlePanelContainerElRef = React.useRef<HTMLDivElement | null>(null);

  const allowShowPanelAtoms = useAllowShowPanelAtoms();
  const contentsKeyPanelAtoms = usePanelContentsKeyAtoms();
  const showPanelAtoms = useShowPanelAtoms();
  const showPanelLoaderAtoms = useShowPanelLoaderAtoms();
  const toolbarOverridingContentKeys = useToolbarOverridingContentKeys();

  const [focusedPanel, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [isResizingPanels, setIsResizingPanels] = useAtom(trmrk3PanelsAppLayoutAtoms.isResizingPanels);
  const [leftPanelWidthRatio] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelWidthRatio);
  const [middlePanelWidthRatio] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanelWidthRatio);
  const [isMultiPanelMode] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode);

  const showLeftPanelValue = React.useMemo(
    () => focusedPanel === TrmrkAppLayoutPanel.Left || (isMultiPanelMode && allowShowPanelAtoms.leftPanel.value && showPanelAtoms.leftPanel.value),
    [allowShowPanelAtoms.leftPanel.value, showPanelAtoms.leftPanel.value, focusedPanel, isMultiPanelMode])

  const showMiddlePanelValue = React.useMemo(
    () => focusedPanel === TrmrkAppLayoutPanel.Middle || (isMultiPanelMode && allowShowPanelAtoms.middlePanel.value && showPanelAtoms.middlePanel.value),
    [allowShowPanelAtoms.middlePanel.value, showPanelAtoms.middlePanel.value, focusedPanel, isMultiPanelMode]);

  const showRightPanelValue = React.useMemo(
    () => focusedPanel === TrmrkAppLayoutPanel.Right || (isMultiPanelMode && allowShowPanelAtoms.rightPanel.value && showPanelAtoms.rightPanel.value),
    [allowShowPanelAtoms.rightPanel.value, showPanelAtoms.rightPanel.value, focusedPanel, isMultiPanelMode]);

  const leftPanelPointerDown = React.useCallback(() => {
    setFocusedPanel(TrmrkAppLayoutPanel.Left);
  }, [focusedPanel]);

  const middlePanelPointerDown = React.useCallback(() => {
    setFocusedPanel(TrmrkAppLayoutPanel.Middle);
  }, [focusedPanel]);

  const rightPanelPointerDown = React.useCallback(() => {
    setFocusedPanel(TrmrkAppLayoutPanel.Right);
  }, [focusedPanel]);

  React.useEffect(() => {
    const allowResizingPanels = [
      showLeftPanelValue,
      showMiddlePanelValue,
      showRightPanelValue].filter(show => show).length > 1;

    const bottomToolbarContentsId = allowResizingPanels && isResizingPanels ? overridingBottomToolbarContents.value.register(
      defaultComponentIdService.value.getNextId(),
      <ResizePanelsBottomToolbarContents
        showLeftPanelValue={showLeftPanelValue}
        showMiddlePanelValue={showMiddlePanelValue}
        showRightPanelValue={showRightPanelValue}
        leftPanelContainerElRef={leftPanelContainerElRef}
        middlePanelContainerElRef={middlePanelContainerElRef} />
    ) : null;

    toolbarOverridingContentKeys.bottomToolbar.set(bottomToolbarContentsId);

    if (isResizingPanels && !allowResizingPanels) {
      setIsResizingPanels(false);
    }

    return () => {
      actWithValIf(bottomToolbarContentsId, id => overridingBottomToolbarContents.value.unregister(id));
    };
  }, [
    isResizingPanels,
    showLeftPanelValue,
    showMiddlePanelValue,
    showRightPanelValue
  ]);

  return (
    <TrmrkBasicAppLayout className={cssClass}>
      <TrmrkSplitContainerCore ref={leftPanelContainerElRef}
        panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Left ? "trmrk-is-focused" : "" ].join(" ")}
        showPanel1={showLeftPanelValue}
        showPanel2={showMiddlePanelValue || showRightPanelValue}
        panel1WidthPercent={leftPanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultLeftPanelWidthRatio}
        panel1Content={
          showLeftPanelValue && <>
            <div className="trmrk-panel-body-container"
              onMouseDownCapture={leftPanelPointerDown}
              onTouchStartCapture={leftPanelPointerDown}><div className="trmrk-panel-body">{
              contentsKeyPanelAtoms.leftPanel.value && leftPanelContents.value.keyedMap.map[contentsKeyPanelAtoms.leftPanel.value]?.node }</div></div>
            { showPanelLoaderAtoms.leftPanel.value && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
        panel2Content={
          <TrmrkSplitContainerCore ref={middlePanelContainerElRef}
            panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Middle ? "trmrk-is-focused" : "" ].join(" ")}
            panel2CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Right ? "trmrk-is-focused" : "" ].join(" ")}
            showPanel1={showMiddlePanelValue}
            showPanel2={showRightPanelValue}
            panel1WidthPercent={middlePanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultMiddlePanelWidthRatio}
            panel1Content={showMiddlePanelValue && <><div className="trmrk-panel-body-container"
              onMouseDownCapture={middlePanelPointerDown}
              onTouchStartCapture={middlePanelPointerDown}><div className="trmrk-panel-body">{ 
              contentsKeyPanelAtoms.middlePanel.value && middlePanelContents.value.keyedMap.map[contentsKeyPanelAtoms.middlePanel.value]?.node }</div></div>
              { showPanelLoaderAtoms.middlePanel.value && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
            panel2Content={showRightPanelValue && <>
              <div className="trmrk-panel-body-container"
                onMouseDownCapture={rightPanelPointerDown}
                onTouchStartCapture={rightPanelPointerDown}><div className="trmrk-panel-body">{
                contentsKeyPanelAtoms.rightPanel.value && rightPanelContents.value.keyedMap.map[contentsKeyPanelAtoms.rightPanel.value]?.node }</div></div>
              { showPanelLoaderAtoms.rightPanel.value && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }>
          </TrmrkSplitContainerCore>}>
      </TrmrkSplitContainerCore>
      { children }
    </TrmrkBasicAppLayout>
  );
}
