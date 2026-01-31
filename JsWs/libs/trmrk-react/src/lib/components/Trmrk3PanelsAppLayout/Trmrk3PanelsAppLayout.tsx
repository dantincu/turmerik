"use client";

import React from "react";
import { useAtom } from "jotai";

import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";
import { actWithValIf } from "@/src/trmrk/core";

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
  trmrk3PanelsAppLayoutConstants
} from "./Trmrk3PanelsAppLayoutService";

const ResizePanelsBottomToolbarContents = React.memo(({
  showLeftPanelValue,
  showMiddlePanelValue,
  showRightPanelValue
}: {
  showLeftPanelValue: boolean,
  showMiddlePanelValue: boolean,
  showRightPanelValue: boolean
}) => {
  const resizeLeftPanelContainerElRef = React.useRef<HTMLDivElement>(null);
  const resizeMiddlePanelContainerElRef = React.useRef<HTMLDivElement>(null);

  const [leftPanelWidthRatio, setLeftPanelWidthRatio] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanelWidthRatio);
  const [middlePanelWidthRatio, setMiddlePanelWidthRatio] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanelWidthRatio);

  return <>
    { showLeftPanelValue && <div className="flex justify-end" ref={resizeLeftPanelContainerElRef} style={{
        width: `calc(${leftPanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultLeftPanelWidthRatio}%)`
      }}>
        <TrmrkPointerDraggable hoc={{
          node: (props, ref) => <TrmrkBtn {...props} ref={ref as React.Ref<HTMLButtonElement>} style={{ right: "-25px" }}>
            <TrmrkIcon icon="mdi:drag-vertical-variant" /></TrmrkBtn>,
          props: {}
        }} args={(hostElem: HTMLButtonElement) => ({
          hostElem
        })}></TrmrkPointerDraggable>
    </div> }
    { (showMiddlePanelValue && showRightPanelValue) && <div className="flex" ref={resizeMiddlePanelContainerElRef} style={{
        width: showLeftPanelValue ? `calc(${100 - (leftPanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultLeftPanelWidthRatio)}%)` : "100%"
      }}>
      <div className="flex justify-end" style={{
          width: `calc(${middlePanelWidthRatio ?? trmrk3PanelsAppLayoutConstants.defaultMiddlePanelWidthRatio}% + ${showLeftPanelValue ? "4px" : "0px"})`
        }}>
          <TrmrkPointerDraggable hoc={{
          node: (props, ref) => <TrmrkBtn {...props} ref={ref as React.Ref<HTMLButtonElement>} style={{ right: "-25px" }}>
            <TrmrkIcon icon="mdi:drag-vertical-variant" /></TrmrkBtn>,
          props: {}
        }} args={(hostElem: HTMLButtonElement) => ({
          hostElem
        })}></TrmrkPointerDraggable>
      </div>
    </div> }
  </>;
});

export interface Trmrk3PanelsAppLayoutProps extends ComponentProps {}

export default function Trmrk3PanelsAppLayout({ className: cssClass, children }: Readonly<Trmrk3PanelsAppLayoutProps>) {
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
        showRightPanelValue={showRightPanelValue} />
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
      <TrmrkSplitContainerCore
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
          <TrmrkSplitContainerCore
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
