"use client";

import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./Trmrk3PanelsAppLayout.scss";

import { ComponentProps } from "../defs/common";
import TrmrkBasicAppLayout from "../TrmrkBasicAppLayout/TrmrkBasicAppLayout";
import TrmrkSplitContainerCore from "../TrmrkSplitContainerCore/TrmrkSplitContainerCore";
import TrmrkLoader from "../TrmrkLoader/TrmrkLoader";

import {
  trmrk3PanelsAppLayoutAtoms,
  leftPanelComponents,
  rightPanelComponents,
} from "./Trmrk3PanelsAppLayoutService";

export interface Trmrk3PanelsAppLayoutProps extends ComponentProps {}

export default function Trmrk3PanelsAppLayout({children, cssClass}: Readonly<Trmrk3PanelsAppLayoutProps>) {
  const [showLeftPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [showLeftPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanelLoader);
  const [leftPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelContentsKey);
  const [showMainPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showMainPanelLoader);
  const [showRightPanel] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [showRightPanelLoader] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanelLoader);
  const [rightPanelContentsKey] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanelContentsKey);

  return (
    <TrmrkBasicAppLayout cssClass={cssClass}>
      <TrmrkSplitContainerCore showPanel1={showLeftPanel} showPanel2={true} panel1WidthPercent={33.333} panel1Content={() =>
        showLeftPanel && <>
          <div className="trmrk-panel-body-container"><div className="trmrk-panel-body">{
            leftPanelContentsKey && withValIf(
              leftPanelComponents.value.keyedMap.map[leftPanelContentsKey], f => f.node()) }</div></div>
          { showLeftPanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</>
        } panel2Content={() =>
          <TrmrkSplitContainerCore showPanel1={true} showPanel2={showRightPanel} panel1WidthPercent={50} panel1Content={() => <>
              <div className="trmrk-panel-body-container"><div className="trmrk-panel-body">{ children }</div></div>
              { showMainPanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
            panel2Content={() => showRightPanel && <>
              <div className="trmrk-panel-body-container"><div className="trmrk-panel-body">{
                rightPanelContentsKey && withValIf(
                  rightPanelComponents.value.keyedMap.map[rightPanelContentsKey], f => f.node()) }</div></div>
              { showRightPanelLoader && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }>
          </TrmrkSplitContainerCore>}>
      </TrmrkSplitContainerCore>
    </TrmrkBasicAppLayout>
  );
}
