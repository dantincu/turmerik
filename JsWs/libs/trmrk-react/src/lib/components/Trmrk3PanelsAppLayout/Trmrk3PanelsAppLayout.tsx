"use client";

import React from "react";
import { useAtom } from "jotai";

import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";
import { actWithValIf } from "@/src/trmrk/core";
import { getVarName } from "@/src/trmrk/Reflection/core";
import { joinNames } from "@/src/trmrk/name-generators";
import { PointerDragEvent, DragEventData } from "@/src/trmrk-browser/domUtils/PointerDragService";
import { pointerIsTouchOrLeftMouseBtn } from "@/src/trmrk-browser/domUtils/touchAndMouseEvents";

import "./Trmrk3PanelsAppLayout.scss";
import { ComponentProps } from "../defs/common";
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
  trmrk3PanelsAppLayoutConstants,
  trmrk3PanelsAppLayoutVars
} from "./Trmrk3PanelsAppLayoutService";

const updateLeftPanelContainerElWidth = (
  leftPanelContainerElRef: React.RefObject<HTMLDivElement | null>,
  showMiddleOrRightPanel: boolean
) => {
  const leftPanelContainerEl = leftPanelContainerElRef.current;

  if (leftPanelContainerEl) {
    const panel1 = leftPanelContainerEl.querySelector(":scope > .trmrk-split-panel1") as HTMLElement;

    if (panel1) {
      if (showMiddleOrRightPanel) {
        panel1.style.flexBasis = `${trmrk3PanelsAppLayoutVars.leftPanelWidthRatio}%`;
        panel1.style.minWidth = `${trmrk3PanelsAppLayoutVars.leftPanelWidthRatio}%`;
      } else {
        panel1.style.flexBasis = "";
        panel1.style.minWidth = "";
      }
    }
  }
};

const updateMiddlePanelContainerElWidth = (
  middlePanelContainerElRef: React.RefObject<HTMLDivElement | null>,
  showMiddleAndRightPanel: boolean
) => {
  const middlePanelContainerEl = middlePanelContainerElRef.current;

  if (middlePanelContainerEl) {
    const panel1 = middlePanelContainerEl.querySelector(":scope > .trmrk-split-panel1") as HTMLElement;

    if (panel1) {
      if (showMiddleAndRightPanel) {
        panel1.style.flexBasis = `${trmrk3PanelsAppLayoutVars.middlePanelWidthRatio}%`;
        panel1.style.minWidth = `${trmrk3PanelsAppLayoutVars.middlePanelWidthRatio}%`;
      } else {
        panel1.style.flexBasis = "";
        panel1.style.minWidth = "";
      }
    }
  }
};

export const RegisteredResizePanelsBottomToolbarContentsTypeName = joinNames([
  getVarName(() => Trmrk3PanelsAppLayout),
  getVarName(() => ResizePanelsBottomToolbarContents)]);

const ResizePanelsBottomToolbarContents = ({
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
  const resizeLeftPanelStripElRef = React.useRef<HTMLDivElement | null>(null);
  const resizeMiddlePanelStripContainerElRef = React.useRef<HTMLDivElement | null>(null);
  const resizeMiddlePanelStripElRef = React.useRef<HTMLDivElement | null>(null);

  const leftPanelPointerDownWidthRatioRef = React.useRef(trmrk3PanelsAppLayoutVars.leftPanelWidthRatio);
  const middlePanelPointerDownWidthRatioRef = React.useRef(trmrk3PanelsAppLayoutVars.middlePanelWidthRatio);

  const resizeLeftPanelStripElAvailable = React.useCallback((el: HTMLDivElement) => {
    resizeLeftPanelStripElRef.current = el;
    onLeftPanelWidthRatioChanged();
  }, []);

  const resizeMiddlePanelStripContainerElAvailable = React.useCallback((el: HTMLDivElement) => {
    resizeMiddlePanelStripContainerElRef.current = el;
    onLeftPanelWidthRatioChanged();
  }, []);

  const resizeMiddlePanelStripElAvailable = React.useCallback((el: HTMLDivElement) => {
    resizeMiddlePanelStripElRef.current = el;
    onMiddlePanelWidthRatioChanged();
  }, []);

  const onLeftPanelWidthRatioChanged = React.useCallback(() => {
    const resizeLeftPanelStripEl = resizeLeftPanelStripElRef.current;
    const resizeMiddlePanelStripContainerEl = resizeMiddlePanelStripContainerElRef.current;

    if (resizeLeftPanelStripEl) {
      resizeLeftPanelStripEl.style.width = `${trmrk3PanelsAppLayoutVars.leftPanelWidthRatio}%`;
    }

    if (resizeMiddlePanelStripContainerEl) {
      resizeMiddlePanelStripContainerEl.style.width = showLeftPanelValue ? `${100 - trmrk3PanelsAppLayoutVars.leftPanelWidthRatio}%` : "100%";
    }
    
    updateLeftPanelContainerElWidth(leftPanelContainerElRef, showMiddlePanelValue || showRightPanelValue);
  }, [showLeftPanelValue, showMiddlePanelValue, showRightPanelValue]);

  const onMiddlePanelWidthRatioChanged = React.useCallback(() => {
    const resizeMiddlePanelStripEl = resizeMiddlePanelStripElRef.current;

    if (resizeMiddlePanelStripEl) {
      resizeMiddlePanelStripEl.style.width = showLeftPanelValue ?
        `calc(${trmrk3PanelsAppLayoutVars.middlePanelWidthRatio}% + 4px)` :
        `${trmrk3PanelsAppLayoutVars.middlePanelWidthRatio}%`;
    }
    
    updateMiddlePanelContainerElWidth(middlePanelContainerElRef, showRightPanelValue);
  }, [showLeftPanelValue, showRightPanelValue]);

  const eventDataAvailable = React.useCallback((data: DragEventData, isForMouseUp: boolean) => {
      data.isValid ||= pointerIsTouchOrLeftMouseBtn(data.event as PointerEvent, isForMouseUp);
    }, []);

  const resizeLeftPanelBtnDragStart = React.useCallback((_: PointerEvent) => {
    const leftPanelContainerEl = leftPanelContainerElRef.current;

    if (leftPanelContainerEl) {
      leftPanelPointerDownWidthRatioRef.current = trmrk3PanelsAppLayoutVars.leftPanelWidthRatio;
    }
  }, []);

  const resizeMiddlePanelBtnDragStart = React.useCallback((_: PointerEvent) => {
    const middlePanelContainerEl = middlePanelContainerElRef.current;

    if (middlePanelContainerEl) {
      middlePanelPointerDownWidthRatioRef.current = trmrk3PanelsAppLayoutVars.middlePanelWidthRatio;
    }
  }, []);
  
  const resizeLeftPanelBtnDrag = React.useCallback((event: PointerDragEvent) => {
    const leftPanelContainerEl = leftPanelContainerElRef.current;

    if (leftPanelContainerEl) {
      const containerWidthPx = leftPanelContainerEl.offsetWidth;
      const diffPx = event.event.screenX - event.pointerDownEvent.screenX;
      const diffPercent = (diffPx * 100.0) / containerWidthPx;
      const newLeftPanelWidthRatio = leftPanelPointerDownWidthRatioRef.current + diffPercent;
      trmrk3PanelsAppLayoutVars.leftPanelWidthRatio = newLeftPanelWidthRatio;
      onLeftPanelWidthRatioChanged();
    }
  }, []);
  
  const resizeMiddlePanelBtnDrag = React.useCallback((event: PointerDragEvent) => {
    const middlePanelContainerEl = middlePanelContainerElRef.current;

    if (middlePanelContainerEl) {
      const containerWidthPx = middlePanelContainerEl.offsetWidth;
      const diffPx = event.event.screenX - event.pointerDownEvent.screenX;
      const diffPercent = (diffPx * 100.0) / containerWidthPx;
      const newMiddlePanelWidthRatio = middlePanelPointerDownWidthRatioRef.current + diffPercent;
      trmrk3PanelsAppLayoutVars.middlePanelWidthRatio = newMiddlePanelWidthRatio;
      onMiddlePanelWidthRatioChanged();
    }
  }, []);

  const leftPanelResizeDraggableNode = React.useCallback((
    props: {}, ref: React.ForwardedRef<HTMLButtonElement>) => <TrmrkBtn
      {...props} ref={ref as React.Ref<HTMLButtonElement>} className="right-[-25px]">
        <TrmrkIcon icon="mdi:drag-vertical-variant" /></TrmrkBtn>, []);

  const middlePanelResizeDraggableNode = React.useCallback((
    props: {}, ref: React.ForwardedRef<HTMLButtonElement>) => <TrmrkBtn
      {...props} ref={ref as React.Ref<HTMLButtonElement>} className="right-[-25px]">
        <TrmrkIcon icon="mdi:drag-vertical-variant" /></TrmrkBtn>, []);

  const leftPanelResizeDraggableHOCArgs = React.useMemo(() => ({
    node: leftPanelResizeDraggableNode,
    props: {}}), []);

  const middlePanelResizeDraggableHOCArgs = React.useMemo(() => ({
    node: middlePanelResizeDraggableNode,
    props: {}}), []);

  const leftPanelResizeDraggableSvcArgs = React.useMemo(() => ({
      drag: resizeLeftPanelBtnDrag,
      dragStart: resizeLeftPanelBtnDragStart,
      eventDataAvailable
    }), []);

  const middlePanelResizeDraggableSvcArgs = React.useMemo(() => ({
      drag: resizeMiddlePanelBtnDrag,
      dragStart: resizeMiddlePanelBtnDragStart,
      eventDataAvailable
    }), []);

  React.useEffect(() => {
    onLeftPanelWidthRatioChanged();
    onMiddlePanelWidthRatioChanged();
  }, [showLeftPanelValue, showRightPanelValue]);

  return <>
    { showLeftPanelValue && <div className="flex justify-end" ref={resizeLeftPanelStripElAvailable}>
        <TrmrkPointerDraggable hoc={leftPanelResizeDraggableHOCArgs} args={leftPanelResizeDraggableSvcArgs}></TrmrkPointerDraggable>
    </div> }
    { (showMiddlePanelValue && showRightPanelValue) && <div className="flex" ref={resizeMiddlePanelStripContainerElAvailable}>
      <div className="flex justify-end" ref={resizeMiddlePanelStripElAvailable}>
        <TrmrkPointerDraggable hoc={middlePanelResizeDraggableHOCArgs} args={middlePanelResizeDraggableSvcArgs}></TrmrkPointerDraggable>
      </div>
    </div> }
  </>;
};

export interface Trmrk3PanelsAppLayoutProps extends ComponentProps {}

export default function Trmrk3PanelsAppLayout({ className: cssClass, children }: Readonly<Trmrk3PanelsAppLayoutProps>) {
  const leftPanelContainerElRef = React.useRef<HTMLDivElement | null>(null);
  const middlePanelContainerElRef = React.useRef<HTMLDivElement | null>(null);
  const currentBottomToolbarContentsIdRef = React.useRef<number | null>(null);
  const currentBottomToolbarContentsTypeNameRef = React.useRef<string | null>(null);

  const allowShowPanelAtoms = useAllowShowPanelAtoms();
  const contentsKeyPanelAtoms = usePanelContentsKeyAtoms();
  const showPanelAtoms = useShowPanelAtoms();
  const showPanelLoaderAtoms = useShowPanelLoaderAtoms();
  const toolbarOverridingContentKeys = useToolbarOverridingContentKeys();

  const [focusedPanel, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [isResizingPanels, setIsResizingPanels] = useAtom(trmrk3PanelsAppLayoutAtoms.isResizingPanels);
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

  const leftPanelContainerElAvailable = React.useCallback((el: HTMLDivElement) => {
    leftPanelContainerElRef.current = el;
    updateLeftPanelContainerElWidth(leftPanelContainerElRef, showMiddlePanelValue || showRightPanelValue);
  }, [showMiddlePanelValue, showRightPanelValue]);

  const middlePanelContainerElAvailable = React.useCallback((el: HTMLDivElement) => {
    middlePanelContainerElRef.current = el;
    updateMiddlePanelContainerElWidth(middlePanelContainerElRef, showRightPanelValue);
  }, [showRightPanelValue]);

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
        middlePanelContainerElRef={middlePanelContainerElRef} />,
        RegisteredResizePanelsBottomToolbarContentsTypeName
    ) : null;

    const currentBottomToolbarContentsId = currentBottomToolbarContentsIdRef.current;
    let shouldSetBottomToolbarContentsId = (bottomToolbarContentsId ?? null) !== null;

    shouldSetBottomToolbarContentsId ||= ((currentBottomToolbarContentsId ?? null) !== null &&
      currentBottomToolbarContentsTypeNameRef.current === RegisteredResizePanelsBottomToolbarContentsTypeName);

    if (shouldSetBottomToolbarContentsId) {
      toolbarOverridingContentKeys.bottomToolbar.set(bottomToolbarContentsId);
    }

    if (isResizingPanels && !allowResizingPanels) {
      setIsResizingPanels(false);
    }

    updateLeftPanelContainerElWidth(leftPanelContainerElRef, showMiddlePanelValue || showRightPanelValue);
    updateMiddlePanelContainerElWidth(middlePanelContainerElRef, showRightPanelValue);

    return () => {
      updateLeftPanelContainerElWidth(leftPanelContainerElRef, showRightPanelValue);
      updateMiddlePanelContainerElWidth(middlePanelContainerElRef, showRightPanelValue);
      actWithValIf(bottomToolbarContentsId, id => overridingBottomToolbarContents.value.unregister(id));
    };
  }, [
    isResizingPanels,
    showLeftPanelValue,
    showMiddlePanelValue,
    showRightPanelValue,
  ]);

  React.useEffect(() => {
    const currentBottomToolbarContentsId = currentBottomToolbarContentsIdRef.current = toolbarOverridingContentKeys.bottomToolbar.value;

    if ((currentBottomToolbarContentsId ?? null) !== null) {
      currentBottomToolbarContentsTypeNameRef.current = overridingBottomToolbarContents.value.keyedMap.map[currentBottomToolbarContentsId!]?.typeName ?? null;
    } else {
      currentBottomToolbarContentsTypeNameRef.current = null;
    }
  }, [toolbarOverridingContentKeys.bottomToolbar.value]);

  return (
    <TrmrkBasicAppLayout className={cssClass}>
      <TrmrkSplitContainerCore ref={leftPanelContainerElAvailable}
        panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Left ? "trmrk-is-focused" : "" ].join(" ")}
        showPanel1={showLeftPanelValue}
        showPanel2={showMiddlePanelValue || showRightPanelValue}
        panel1Content={
          showLeftPanelValue && <>
            <div className="trmrk-panel-body-container"
              onMouseDownCapture={leftPanelPointerDown}
              onTouchStartCapture={leftPanelPointerDown}><div className="trmrk-panel-body">{
              contentsKeyPanelAtoms.leftPanel.value && leftPanelContents.value.keyedMap.map[contentsKeyPanelAtoms.leftPanel.value]?.node }</div></div>
            { showPanelLoaderAtoms.leftPanel.value && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
        panel2Content={
          <TrmrkSplitContainerCore ref={middlePanelContainerElAvailable}
            panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Middle ? "trmrk-is-focused" : "" ].join(" ")}
            panel2CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Right ? "trmrk-is-focused" : "" ].join(" ")}
            showPanel1={showMiddlePanelValue}
            showPanel2={showRightPanelValue}
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
