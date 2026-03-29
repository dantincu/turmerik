"use client";

import React from "react";
import { useAtom } from "jotai";
import { atomEffect } from 'jotai-effect';

import { isDebugLoggingEnabled } from "@/src/trmrk/dev";
import { actWithValIf } from "@/src/trmrk/core";
import { joinNames } from "@/src/trmrk/name-generators";
import { PointerDragEvent } from "@/src/trmrk-browser/domUtils/PointerDragService";
import { TouchOrMouseCoords } from "@/src/trmrk-browser/domUtils/touchAndMouseEvents";

import "./Trmrk3PanelsAppLayout.scss";
import { ComponentProps } from "../defs/common";
import TrmrkBasicAppLayout from "../TrmrkBasicAppLayout/TrmrkBasicAppLayout";

import {
  overridingBottomToolbarContents,
  useToolbarOverridingContentKeys,
  useToolbarOverridingContentKeyArrs,
  useShowOverridingToolbars,
  trmrkBasicAppLayoutAtoms,
  useShowToolbars,
} from "../TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

import TrmrkSplitContainerCore from "../TrmrkSplitContainerCore/TrmrkSplitContainerCore";
import TrmrkThinLoader from "../TrmrkThinLoader/TrmrkThinLoader";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import TrmrkPointerDraggable from "../TrmrkPointerDraggable/TrmrkPointerDraggable";
import { shouldShowContents } from "../../services/IntKeyedComponentsMapManager";

import { KeyboardShortcutMatchState } from "../../services/keyboardShortcuts/KeyboardShortcutsServiceDefs";

import {
  trmrk3PanelsAppLayoutAtoms,
  leftPanelContents,
  middlePanelContents,
  rightPanelContents,
  TrmrkAppLayoutPanel,
  usePanelContentsKeyAtoms,
  useShowPanelLoaderAtoms,
  useRenderPanelAtoms,
  trmrk3PanelsAppLayoutVars
} from "./Trmrk3PanelsAppLayoutService";

export const Trmrk3PanelsAppLayoutTypeName = "Trmrk3PanelsAppLayout";

export const RegisteredResizePanelsBottomToolbarContentsTypeName = joinNames([
  Trmrk3PanelsAppLayoutTypeName, "ResizePanelsBottomToolbarContents"]);

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

  const resizeLeftPanelBtnDragStart = React.useCallback((_: TouchOrMouseCoords) => {
    const leftPanelContainerEl = leftPanelContainerElRef.current;

    if (leftPanelContainerEl) {
      leftPanelPointerDownWidthRatioRef.current = trmrk3PanelsAppLayoutVars.leftPanelWidthRatio;
    }
  }, []);

  const resizeMiddlePanelBtnDragStart = React.useCallback((_: TouchOrMouseCoords) => {
    const middlePanelContainerEl = middlePanelContainerElRef.current;

    if (middlePanelContainerEl) {
      middlePanelPointerDownWidthRatioRef.current = trmrk3PanelsAppLayoutVars.middlePanelWidthRatio;
    }
  }, []);
  
  const resizeLeftPanelBtnDrag = React.useCallback((event: PointerDragEvent) => {
    const leftPanelContainerEl = leftPanelContainerElRef.current;

    if (leftPanelContainerEl) {
      const containerWidthPx = leftPanelContainerEl.offsetWidth;
      const diffPx = event.coords.screenX - event.pointerDownCoords.screenX;
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
      const diffPx = event.coords.screenX - event.pointerDownCoords.screenX;
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
    }), []);

  const middlePanelResizeDraggableSvcArgs = React.useMemo(() => ({
      drag: resizeMiddlePanelBtnDrag,
      dragStart: resizeMiddlePanelBtnDragStart,
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

const lifecycleEffect = atomEffect((get, set) => {
  if (isDebugLoggingEnabled.value) {
    console.log('3PanelsAppLayout HAS BEEN MOUNTED');
  }

  return () => {
    if (isDebugLoggingEnabled.value) {
      console.log('3PanelsAppLayout HAS BEEN UNMOUNTED');
    }
  };
});

export default function Trmrk3PanelsAppLayout({ className: cssClass, children }: Readonly<Trmrk3PanelsAppLayoutProps>) {
  useAtom(lifecycleEffect);
  const leftPanelContainerElRef = React.useRef<HTMLDivElement | null>(null);
  const middlePanelContainerElRef = React.useRef<HTMLDivElement | null>(null);
  const overridingBottomToolbarContentsIdRef = React.useRef<number | null>(null);
  const overridingBottomToolbarContentKeysArrRef = React.useRef<number[]>(null);

  const contentsKeyPanelAtoms = usePanelContentsKeyAtoms();
  const renderPanelAtoms = useRenderPanelAtoms();
  const showPanelLoaderAtoms = useShowPanelLoaderAtoms();
  const showOverridingToolbars = useShowOverridingToolbars();
  const toolbarOverridingContentKeys = useToolbarOverridingContentKeys();
  const toolbarOverridingContentKeyArrs = useToolbarOverridingContentKeyArrs();
  const [hideHeaderAndFooter] = useAtom(trmrkBasicAppLayoutAtoms.hideHeaderAndFooter);

  const [showToolbars] = useAtom(trmrkBasicAppLayoutAtoms.showToolbars);
  const [focusedPanel, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [isResizingPanels, setIsResizingPanels] = useAtom(trmrk3PanelsAppLayoutAtoms.isResizingPanels);
  const [keyboardShortcutMatchState] = useAtom(trmrk3PanelsAppLayoutAtoms.keyboardShortcutMatchState);
  const showToolbarAtoms = useShowToolbars();
  const showOverridingToolbarAtoms = useShowOverridingToolbars();

  const showAppBar = React.useMemo(() => {
    const retVal = (!hideHeaderAndFooter && showToolbarAtoms.appBar.value) || showOverridingToolbarAtoms.appBar.value;
    return retVal;
  }, [
    showToolbarAtoms.appBar.value,
    showOverridingToolbarAtoms.appBar.value,
    hideHeaderAndFooter
  ]);

  const showTopToolbar = React.useMemo(() => {
    let retVal = !hideHeaderAndFooter && showToolbars && showToolbarAtoms.topToolbar.value;
    retVal ||= showOverridingToolbarAtoms.topToolbar.value;
    return retVal;
  }, [
    showToolbars,
    showToolbarAtoms.topToolbar.value,
    showOverridingToolbarAtoms.topToolbar.value,
    hideHeaderAndFooter
  ]);

  const showBottomToolbar = React.useMemo(() => {
    let retVal = !hideHeaderAndFooter && showToolbars && showToolbarAtoms.bottomToolbar.value;
    retVal ||= showOverridingToolbarAtoms.bottomToolbar.value;
    return retVal;
  }, [
    showToolbars,
    showToolbarAtoms.bottomToolbar.value,
    showOverridingToolbarAtoms.bottomToolbar.value,
    hideHeaderAndFooter
  ]);

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
    updateLeftPanelContainerElWidth(leftPanelContainerElRef, renderPanelAtoms.middlePanel.value || renderPanelAtoms.rightPanel.value);
  }, [renderPanelAtoms.middlePanel.value, renderPanelAtoms.rightPanel.value]);

  const middlePanelContainerElAvailable = React.useCallback((el: HTMLDivElement) => {
    middlePanelContainerElRef.current = el;
    updateMiddlePanelContainerElWidth(middlePanelContainerElRef, renderPanelAtoms.rightPanel.value);
  }, [renderPanelAtoms.rightPanel.value]);

  const LeftPanelContents = React.useMemo(() => {
    let contents: () => React.ReactNode;

    if (contentsKeyPanelAtoms.leftPanel.value) {
      contents = leftPanelContents.value.keyedMap.map[contentsKeyPanelAtoms.leftPanel.value]?.node ?? (() => null);
    } else {
      contents = () => null;
    }

    return contents;
  }, [contentsKeyPanelAtoms.leftPanel.value]);

  const MiddlePanelContents = React.useMemo(() => {
    let contents: () => React.ReactNode;

    if (contentsKeyPanelAtoms.middlePanel.value) {
      contents = middlePanelContents.value.keyedMap.map[contentsKeyPanelAtoms.middlePanel.value]?.node ?? (() => null);
    } else {
      contents = () => null;
    }

    return contents;
  }, [contentsKeyPanelAtoms.middlePanel.value]);

  const RightPanelContents = React.useMemo(() => {
    let contents: () => React.ReactNode;

    if (contentsKeyPanelAtoms.rightPanel.value) {
      contents = rightPanelContents.value.keyedMap.map[contentsKeyPanelAtoms.rightPanel.value]?.node ?? (() => null);
    } else {
      contents = () => null;
    }

    return contents;
  }, [contentsKeyPanelAtoms.rightPanel.value]);

  const ShortcutNotificationStrip = React.useMemo(
    () => () => {
        let cssClass: string;

        switch (keyboardShortcutMatchState) {
          case KeyboardShortcutMatchState.Partial:
            cssClass = "trmrk-back-color-system";
          case KeyboardShortcutMatchState.Exact:
            cssClass = "trmrk-back-color-accept";
          case KeyboardShortcutMatchState.Miss:
            cssClass = "trmrk-back-color-reject";
          default:
            cssClass = "";
        }

        return (showBottomToolbar && <div className={[
            "trmrk-shortcut-notification-thin-strip",
            cssClass
          ].join(" ")}></div> );
      }, [
      showBottomToolbar,
      keyboardShortcutMatchState
    ]);

  React.useEffect(() => {
    const allowResizingPanels = [
      renderPanelAtoms.leftPanel.value,
      renderPanelAtoms.middlePanel.value,
      renderPanelAtoms.rightPanel.value].filter(show => show).length > 1;

    const overridingBottomToolbarContentsId = allowResizingPanels && isResizingPanels ? overridingBottomToolbarContents.value.register(
      () => <ResizePanelsBottomToolbarContents
        showLeftPanelValue={renderPanelAtoms.leftPanel.value}
        showMiddlePanelValue={renderPanelAtoms.middlePanel.value}
        showRightPanelValue={renderPanelAtoms.rightPanel.value}
        leftPanelContainerElRef={leftPanelContainerElRef}
        middlePanelContainerElRef={middlePanelContainerElRef} />,
        RegisteredResizePanelsBottomToolbarContentsTypeName
    ).key : null;

    showOverridingToolbars.bottomToolbar.set(
      shouldShowContents(
        overridingBottomToolbarContentKeysArrRef.current,
        overridingBottomToolbarContentsIdRef.current,
        overridingBottomToolbarContentsId));

    if (isResizingPanels && !allowResizingPanels) {
      setIsResizingPanels(false);
    }

    updateLeftPanelContainerElWidth(leftPanelContainerElRef, renderPanelAtoms.middlePanel.value || renderPanelAtoms.rightPanel.value);
    updateMiddlePanelContainerElWidth(middlePanelContainerElRef, renderPanelAtoms.rightPanel.value);

    return () => {
      updateLeftPanelContainerElWidth(leftPanelContainerElRef, renderPanelAtoms.rightPanel.value);
      updateMiddlePanelContainerElWidth(middlePanelContainerElRef, renderPanelAtoms.rightPanel.value);
      actWithValIf(overridingBottomToolbarContentsId, id => overridingBottomToolbarContents.value.unregister(id));
    };
  }, [
      isResizingPanels,
      renderPanelAtoms.leftPanel.value,
      renderPanelAtoms.middlePanel.value,
      renderPanelAtoms.rightPanel.value,
  ]);

  React.useEffect(() => {
    overridingBottomToolbarContentsIdRef.current = toolbarOverridingContentKeys.bottomToolbar.value;
    overridingBottomToolbarContentKeysArrRef.current = toolbarOverridingContentKeyArrs.bottomToolbar.value;
  }, [
    toolbarOverridingContentKeys.bottomToolbar.value,
    toolbarOverridingContentKeyArrs.bottomToolbar.value
  ]);

  return (
    <TrmrkBasicAppLayout className={cssClass}>
      <TrmrkSplitContainerCore ref={leftPanelContainerElAvailable}
        panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Left ? "trmrk-is-focused" : "" ].join(" ")}
        showPanel1={renderPanelAtoms.leftPanel.value}
        showPanel2={renderPanelAtoms.middlePanel.value || renderPanelAtoms.rightPanel.value}
        panel1Content={
          renderPanelAtoms.leftPanel.value && <>
            { (showAppBar || showTopToolbar) && <div className="trmrk-panel-loader-container"> { showPanelLoaderAtoms.leftPanel.value && <TrmrkThinLoader></TrmrkThinLoader> } </div> }
            <div className="trmrk-panel-body-container"
              onMouseDownCapture={leftPanelPointerDown}
              onTouchStartCapture={leftPanelPointerDown}><div className="trmrk-panel-body">
                <LeftPanelContents /></div></div>
                <ShortcutNotificationStrip /></> }
        panel2Content={
          <TrmrkSplitContainerCore ref={middlePanelContainerElAvailable}
            panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Middle ? "trmrk-is-focused" : "" ].join(" ")}
            panel2CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Right ? "trmrk-is-focused" : "" ].join(" ")}
            showPanel1={renderPanelAtoms.middlePanel.value}
            showPanel2={renderPanelAtoms.rightPanel.value}
            panel1Content={renderPanelAtoms.middlePanel.value && <>
              { (showAppBar || showTopToolbar) && <div className="trmrk-panel-loader-container"> { showPanelLoaderAtoms.middlePanel.value && <TrmrkThinLoader></TrmrkThinLoader> } </div> }
              <div className="trmrk-panel-body-container"
              onMouseDownCapture={middlePanelPointerDown}
              onTouchStartCapture={middlePanelPointerDown}><div className="trmrk-panel-body">
                <MiddlePanelContents /></div></div>
                <ShortcutNotificationStrip /></> }
            panel2Content={renderPanelAtoms.rightPanel.value && <>
              { (showAppBar || showTopToolbar) && <div className="trmrk-panel-loader-container">{ showPanelLoaderAtoms.rightPanel.value && <TrmrkThinLoader></TrmrkThinLoader> }</div> }
              <div className="trmrk-panel-body-container"
                onMouseDownCapture={rightPanelPointerDown}
                onTouchStartCapture={rightPanelPointerDown}><div className="trmrk-panel-body">
                  <RightPanelContents /></div></div>
                  <ShortcutNotificationStrip /></> }>
          </TrmrkSplitContainerCore>}>
      </TrmrkSplitContainerCore>
      { children }
    </TrmrkBasicAppLayout>
  );
}
