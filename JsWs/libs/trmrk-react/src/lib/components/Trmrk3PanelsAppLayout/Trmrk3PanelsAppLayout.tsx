"use client";

import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./Trmrk3PanelsAppLayout.scss";

import { CommponentProps } from "../defs/common";
import TrmrkBasicAppLayout from "../TrmrkBasicAppLayout/TrmrkBasicAppLayout";
import TrmrkSplitContainer from "../TrmrkSplitContainer/TrmrkSplitContainer";
import TrmrkLoader from "../TrmrkLoader/TrmrkLoader";

import {
  trmrk3PanelsAppLayoutAtoms,
  leftPanelComponents,
  rightPanelComponents,
} from "./Trmrk3PanelsAppLayoutService";

export interface Trmrk3PanelsAppLayoutProps extends CommponentProps {}

export default function Trmrk3PanelsAppLayout({children, cssClass}: Readonly<Trmrk3PanelsAppLayoutProps>) {
  const [showLeftPanelValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [showLeftPanelLoaderValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanelLoader);
  const [leftPanelComponentKeyValue] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelComponentKey);
  const [showMainPanelLoaderValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showMainPanelLoader);
  const [showRightPanelValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [showRightPanelLoaderValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanelLoader);
  const [rightPanelComponentKeyValue] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanelComponentKey);

  return (
    <TrmrkBasicAppLayout cssClass={cssClass}>
      <TrmrkSplitContainer showPanel1={showLeftPanelValue} showPanel2={true} panel1WidthPercent={33.333} panel1Content={() =>
        showLeftPanelValue && <>
          <div className="trmrk-panel-body">{
            withValIf(leftPanelComponents.map[leftPanelComponentKeyValue!], f => f()) }</div>
          { showLeftPanelLoaderValue && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</>
        } panel2Content={() =>
          <TrmrkSplitContainer showPanel1={true} showPanel2={showRightPanelValue} panel1WidthPercent={50} panel1Content={() => <>
              <div className="trmrk-panel-body">{ children }</div>
              { showMainPanelLoaderValue && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }
            panel2Content={() => showRightPanelValue && <>
              <div className="trmrk-panel-body">{
                withValIf(rightPanelComponents.map[rightPanelComponentKeyValue!], f => f()) }</div>
              { showRightPanelLoaderValue && <div className="trmrk-panel-header"><TrmrkLoader></TrmrkLoader></div> }</> }>
          </TrmrkSplitContainer>}>
      </TrmrkSplitContainer>
    </TrmrkBasicAppLayout>
  );
}
