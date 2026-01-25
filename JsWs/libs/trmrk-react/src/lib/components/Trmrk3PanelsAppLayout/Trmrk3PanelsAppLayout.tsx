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

export default function Trmrk3PanelsAppLayout({ cssClass, children }: Readonly<Trmrk3PanelsAppLayoutProps>) {
  const [showLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [showLeftPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanelLoader);
  const [leftPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelContentsKey);
  const [showMiddlePanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showMiddlePanel);
  const [showMiddlePanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showMiddlePanelLoader);
  const [middlePanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanelContentsKey);
  const [showRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [showRightPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanelLoader);
  const [rightPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanelContentsKey);
  const [focusedPanel, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);

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
    <TrmrkBasicAppLayout cssClass={cssClass}>
      <TrmrkSplitContainerCore
        panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Left ? "trmrk-is-focused" : "" ].join(" ")}
        showPanel1={showLeftPanel}
        showPanel2={showMiddlePanel || showRightPanel}
        panel1WidthPercent={33.333}
        panel1Content={() =>
          showLeftPanel && <>
            <div className="trmrk-panel-body-container"
              onMouseDownCapture={leftPanelPointerDown}
              onTouchStartCapture={leftPanelPointerDown}><div className="trmrk-panel-body">{
              leftPanelContentsKey && withValIf(
                leftPanelContents.value.keyedMap.map[leftPanelContentsKey], f => f.node()) }</div></div>
            { showLeftPanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
        panel2Content={() =>
          <TrmrkSplitContainerCore
            panel1CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Middle ? "trmrk-is-focused" : "" ].join(" ")}
            panel2CssClass={[ focusedPanel === TrmrkAppLayoutPanel.Right ? "trmrk-is-focused" : "" ].join(" ")}
            showPanel1={showMiddlePanel}
            showPanel2={showRightPanel}
            panel1WidthPercent={50}
            panel1Content={() => <><div className="trmrk-panel-body-container"
              onMouseDownCapture={middlePanelPointerDown}
              onTouchStartCapture={middlePanelPointerDown}><div className="trmrk-panel-body">{ 
              middlePanelContentsKey && withValIf(middlePanelContents.value.keyedMap.map[middlePanelContentsKey], f => f.node() ) }</div></div>
              { showMiddlePanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
            panel2Content={() => showRightPanel && <>
              <div className="trmrk-panel-body-container"
                onMouseDownCapture={rightPanelPointerDown}
                onTouchStartCapture={rightPanelPointerDown}><div className="trmrk-panel-body">{
                rightPanelContentsKey && withValIf(
                  rightPanelContents.value.keyedMap.map[rightPanelContentsKey], f => f.node()) }</div></div>
              { showRightPanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }>
          </TrmrkSplitContainerCore>}>
      </TrmrkSplitContainerCore>
      { children }
    </TrmrkBasicAppLayout>
  );
}
