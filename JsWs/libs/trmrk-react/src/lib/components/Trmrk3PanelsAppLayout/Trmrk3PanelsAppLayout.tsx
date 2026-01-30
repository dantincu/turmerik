"use client";

import React from "react";
import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./Trmrk3PanelsAppLayout.scss";

import { ComponentProps } from "../defs/common";
import TrmrkBasicAppLayout from "../TrmrkBasicAppLayout/TrmrkBasicAppLayout";
import TrmrkSplitContainerCore from "../TrmrkSplitContainerCore/TrmrkSplitContainerCore";
import TrmrkLoader from "../TrmrkLoader/TrmrkLoader";

import {
  trmrk3PanelsAppLayoutAtoms,
  leftPanelContents,
  middlePanelContents,
  rightPanelContents,
  TrmrkAppLayoutPanel
} from "./Trmrk3PanelsAppLayoutService";

export interface Trmrk3PanelsAppLayoutProps extends ComponentProps {}

export default function Trmrk3PanelsAppLayout({ className: cssClass, children }: Readonly<Trmrk3PanelsAppLayoutProps>) {
  const [showLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show);
  const [allowShowLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.allowShow);
  const [showLeftPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.showLoader);
  const [leftPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.contentsKey);
  const [showMiddlePanel] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.show);
  const [allowShowMiddlePanel] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.allowShow);
  const [showMiddlePanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.showLoader);
  const [middlePanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.contentsKey);
  const [showRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.show);
  const [allowShowRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.allowShow);
  const [showRightPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.showLoader);
  const [rightPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.contentsKey);
  const [focusedPanel, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);

  const showLeftPanelValue = React.useMemo(
    () => allowShowLeftPanel && (showLeftPanel || focusedPanel === TrmrkAppLayoutPanel.Left),
    [allowShowLeftPanel, showLeftPanel, focusedPanel])

  const showMiddlePanelValue = React.useMemo(
    () => allowShowMiddlePanel && (showMiddlePanel || focusedPanel === TrmrkAppLayoutPanel.Middle),
    [allowShowMiddlePanel, showMiddlePanel, focusedPanel]);

  const showRightPanelValue = React.useMemo(
    () => allowShowRightPanel && (showRightPanel || focusedPanel === TrmrkAppLayoutPanel.Right),
    [allowShowRightPanel, showRightPanel, focusedPanel]);

  const leftPanelPointerDown = React.useCallback(() => {
    setFocusedPanel(TrmrkAppLayoutPanel.Left);
  }, [focusedPanel]);

  const middlePanelPointerDown = React.useCallback(() => {
    setFocusedPanel(TrmrkAppLayoutPanel.Middle);
  }, [focusedPanel]);

  const rightPanelPointerDown = React.useCallback(() => {
    setFocusedPanel(TrmrkAppLayoutPanel.Right);
  }, [focusedPanel]);

  return (
    <TrmrkBasicAppLayout className={cssClass}>
      <TrmrkSplitContainerCore
        panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Left ? "trmrk-is-focused" : "" ].join(" ")}
        showPanel1={showLeftPanelValue}
        showPanel2={showMiddlePanelValue || showRightPanelValue}
        panel1WidthPercent={33.333}
        panel1Content={
          showLeftPanelValue && <>
            <div className="trmrk-panel-body-container"
              onMouseDownCapture={leftPanelPointerDown}
              onTouchStartCapture={leftPanelPointerDown}><div className="trmrk-panel-body">{
              leftPanelContentsKey && leftPanelContents.value.keyedMap.map[leftPanelContentsKey]?.node }</div></div>
            { showLeftPanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
        panel2Content={
          <TrmrkSplitContainerCore
            panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Middle ? "trmrk-is-focused" : "" ].join(" ")}
            panel2CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Right ? "trmrk-is-focused" : "" ].join(" ")}
            showPanel1={showMiddlePanelValue}
            showPanel2={showRightPanelValue}
            panel1WidthPercent={50}
            panel1Content={showMiddlePanelValue && <><div className="trmrk-panel-body-container"
              onMouseDownCapture={middlePanelPointerDown}
              onTouchStartCapture={middlePanelPointerDown}><div className="trmrk-panel-body">{ 
              middlePanelContentsKey && middlePanelContents.value.keyedMap.map[middlePanelContentsKey]?.node }</div></div>
              { showMiddlePanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
            panel2Content={showRightPanelValue && <>
              <div className="trmrk-panel-body-container"
                onMouseDownCapture={rightPanelPointerDown}
                onTouchStartCapture={rightPanelPointerDown}><div className="trmrk-panel-body">{
                rightPanelContentsKey && rightPanelContents.value.keyedMap.map[rightPanelContentsKey]?.node }</div></div>
              { showRightPanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }>
          </TrmrkSplitContainerCore>}>
      </TrmrkSplitContainerCore>
      { children }
    </TrmrkBasicAppLayout>
  );
}
