"use client";

import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./Trmrk3PanelsAppLayout.scss";

import { CommponentProps } from "../defs/common";
import TrmrkBasicAppLayout from "../TrmrkBasicAppLayout/TrmrkBasicAppLayout";
import TrmrkSplitContainer from "../TrmrkSplitContainer/TrmrkSplitContainer";

import {
  trmrk3PanelsAppLayoutAtoms,
  leftPanelComponents,
  rightPanelComponents,
} from "./Trmrk3PanelsAppLayoutService";

export interface Trmrk3PanelsAppLayoutProps extends CommponentProps {}

export default function Trmrk3PanelsAppLayout({children, cssClass}: Readonly<Trmrk3PanelsAppLayoutProps>) {
  const [showLeftPanelValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [leftPanelComponentKeyValue] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelComponentKey);
  const [showRightPanelValue] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [rightPanelComponentKeyValue] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanelComponentKey);

  return (
    <TrmrkBasicAppLayout cssClass={cssClass}>
      <TrmrkSplitContainer showPanel1={showLeftPanelValue} showPanel2={true} panel1WidthPercent={33.333} panel1Content={() =>
        showLeftPanelValue && withValIf(leftPanelComponents.map[leftPanelComponentKeyValue!], f => f())
        } panel2Content={() =>
          <TrmrkSplitContainer showPanel1={true} showPanel2={showRightPanelValue} panel1WidthPercent={50} panel1Content={() => children}
            panel2Content={() => showRightPanelValue && withValIf(rightPanelComponents.map[rightPanelComponentKeyValue!], f => f()) }>
          </TrmrkSplitContainer>}>
      </TrmrkSplitContainer>
    </TrmrkBasicAppLayout>
  );
}
