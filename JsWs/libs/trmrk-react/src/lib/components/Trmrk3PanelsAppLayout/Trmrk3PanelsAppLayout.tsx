"use client";

import React from "react";
import { useAtom } from "jotai";

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
  TrmrkAppLayoutPanel,
  useAllowShowPanelAtoms,
  useContentsKeyPanelAtoms,
  useShowPanelAtoms,
  useShowPanelLoaderAtoms
} from "./Trmrk3PanelsAppLayoutService";

export interface Trmrk3PanelsAppLayoutProps extends ComponentProps {}

export default function Trmrk3PanelsAppLayout({ className: cssClass, children }: Readonly<Trmrk3PanelsAppLayoutProps>) {
  const allowShowPanelAtoms = useAllowShowPanelAtoms();
  const contentsKeyPanelAtoms = useContentsKeyPanelAtoms();
  const showPanelAtoms = useShowPanelAtoms();
  const showPanelLoaderAtoms = useShowPanelLoaderAtoms();

  const [focusedPanel, setFocusedPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);

  const showLeftPanelValue = React.useMemo(
    () => allowShowPanelAtoms.leftPanel.value && (showPanelAtoms.leftPanel.value || focusedPanel === TrmrkAppLayoutPanel.Left),
    [allowShowPanelAtoms.leftPanel.value, showPanelAtoms.leftPanel.value, focusedPanel])

  const showMiddlePanelValue = React.useMemo(
    () => allowShowPanelAtoms.middlePanel.value && (showPanelAtoms.middlePanel.value || focusedPanel === TrmrkAppLayoutPanel.Middle),
    [allowShowPanelAtoms.middlePanel.value, showPanelAtoms.middlePanel.value, focusedPanel]);

  const showRightPanelValue = React.useMemo(
    () => allowShowPanelAtoms.rightPanel.value && (showPanelAtoms.rightPanel.value || focusedPanel === TrmrkAppLayoutPanel.Right),
    [allowShowPanelAtoms.rightPanel.value, showPanelAtoms.rightPanel.value, focusedPanel]);

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
              contentsKeyPanelAtoms.leftPanel.value && leftPanelContents.value.keyedMap.map[contentsKeyPanelAtoms.leftPanel.value]?.node }</div></div>
            { showPanelLoaderAtoms.leftPanel.value && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
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
