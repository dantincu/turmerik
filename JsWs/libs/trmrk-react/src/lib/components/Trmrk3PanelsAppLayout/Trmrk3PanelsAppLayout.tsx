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
  const [showLeftPanelValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [showLeftPanelLoaderValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanelLoader);
  const [leftPanelContentsKeyValue] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelContentsKey);
  const [showMainPanelLoaderValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showMainPanelLoader);
  const [showRightPanelValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [showRightPanelLoaderValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanelLoader);
  const [rightPanelContentsKeyValue] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanelContentsKey);

  return (
    <TrmrkBasicAppLayout cssClass={cssClass}>
      <TrmrkSplitContainerCore showPanel1={showLeftPanelValue} showPanel2={true} panel1WidthPercent={33.333} panel1Content={() =>
        showLeftPanelValue && <>
          <div className="trmrk-panel-body-container"><div className="trmrk-panel-body">{
            leftPanelContentsKeyValue && withValIf(
              leftPanelComponents.value.keyedMap.map[leftPanelContentsKeyValue], f => f.node()) }</div></div>
          { showLeftPanelLoaderValue && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</>
        } panel2Content={() =>
          <TrmrkSplitContainerCore showPanel1={true} showPanel2={showRightPanelValue} panel1WidthPercent={50} panel1Content={() => <>
              <div className="trmrk-panel-body-container"><div className="trmrk-panel-body">{ children }</div></div>
              { showMainPanelLoaderValue && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
            panel2Content={() => showRightPanelValue && <>
              <div className="trmrk-panel-body-container"><div className="trmrk-panel-body">{
                rightPanelContentsKeyValue && withValIf(
                  rightPanelComponents.value.keyedMap.map[rightPanelContentsKeyValue], f => f.node()) }</div></div>
              { showRightPanelLoaderValue && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }>
          </TrmrkSplitContainerCore>}>
      </TrmrkSplitContainerCore>
    </TrmrkBasicAppLayout>
  );
}
