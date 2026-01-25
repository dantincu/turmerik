import React from "react";
import { useAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkTopToolBarContents.scss";
import { ComponentProps } from "../defs/common";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import { trmrk3PanelsAppLayoutAtoms, TrmrkAppLayoutPanel } from "../Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";

export interface TrmrkTopToolBarContentsProps extends ComponentProps {
  showBackBtn?: boolean | NullOrUndef;
  showGoToParentBtn?: boolean | NullOrUndef;
  showHomeBtn?: boolean | NullOrUndef;
  showUndoBtn?: boolean | NullOrUndef;
  showRedoBtn?: boolean | NullOrUndef;
  showPrimaryCustomActionBtn?: boolean | NullOrUndef;
  showSecondaryCustomActionBtn?: boolean | NullOrUndef;
  showOptionsBtn?: boolean | NullOrUndef
}

export default function TrmrkTopToolBarContents({
  children,
  showBackBtn,
  showGoToParentBtn,
  showHomeBtn,
  showUndoBtn,
  showRedoBtn,
  showPrimaryCustomActionBtn,
  showSecondaryCustomActionBtn,
  showOptionsBtn
}: Readonly<TrmrkTopToolBarContentsProps>) {
  const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [ allowToggleLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.allowToggleLeftPanel);
  const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showMiddlePanel);
  const [ allowToggleMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.allowToggleMiddlePanel);
  const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [ allowToggleRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.allowToggleRightPanel);
  const [ focusedPanel, setFocusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [ isSinglePanelMode, setIsSinglePanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isSinglePanelMode);
  const [ allowsMultiPanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.allowsMultiPanelMode);

  const showResizePanelsBtn = React.useMemo(
    () => [showLeftPanel, showMiddlePanel, showRightPanel].filter(show => show).length > 0,
    [showLeftPanel, showMiddlePanel, showRightPanel, isSinglePanelMode])

  const toggleLeftPanelClicked = React.useCallback(() => {
    const willShowLeftPanel = !showLeftPanel;
    setShowLeftPanel(willShowLeftPanel);

    if (isSinglePanelMode) {
      if (willShowLeftPanel) {
        setShowMiddlePanel(false);
        setShowRightPanel(false);
      }
    }
  }, [showLeftPanel, isSinglePanelMode]);

  const toggleMiddlePanelClicked = React.useCallback(() => {
    const willShowMiddlePanel = !showMiddlePanel;
    setShowMiddlePanel(!showMiddlePanel);

    if (isSinglePanelMode) {
      if (willShowMiddlePanel) {
        setShowLeftPanel(false);
        setShowRightPanel(false);
      }
    }
  }, [showMiddlePanel, isSinglePanelMode]);

  const toggleRightPanelClicked = React.useCallback(() => {
    const willShowRightPanel = !showRightPanel;
    setShowRightPanel(!showRightPanel);

    if (isSinglePanelMode) {
      if (willShowRightPanel) {
        setShowLeftPanel(false);
        setShowMiddlePanel(false);
      }
    }
  }, [showRightPanel, isSinglePanelMode]);

  const toggleLeftPanelContextMenu = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsSinglePanelMode(false);
    setShowLeftPanel(true);
    setFocusedPanel(TrmrkAppLayoutPanel.Left);
  }, [showLeftPanel, isSinglePanelMode, focusedPanel]);

  const toggleMiddlePanelContextMenu = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsSinglePanelMode(false);
    setShowMiddlePanel(true);
    setFocusedPanel(TrmrkAppLayoutPanel.Middle);
  }, [showMiddlePanel, isSinglePanelMode, focusedPanel]);

  const toggleRightPanelContextMenu = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsSinglePanelMode(false);
    setShowRightPanel(true);
    setFocusedPanel(TrmrkAppLayoutPanel.Right);
  }, [showRightPanel, isSinglePanelMode, focusedPanel]);

  const toggleMultiPanelModeClicked = React.useCallback(() => {
    setIsSinglePanelMode(!isSinglePanelMode);
  }, [isSinglePanelMode, allowsMultiPanelMode]);

  return <><div className="trmrk-toolbar-content flex grow">
      <div className="flex grow">
        { (showBackBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:arrow-back" /></TrmrkBtn> }
        { (showGoToParentBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="mdi:arrow-up" /></TrmrkBtn> }
        { (showHomeBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:home" /></TrmrkBtn> }
        { (showUndoBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:undo" /></TrmrkBtn> }
        { (showRedoBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:redo" /></TrmrkBtn> }
        { (showPrimaryCustomActionBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="solar:command-outline" /></TrmrkBtn> }
        { (showSecondaryCustomActionBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="solar:command-bold" /></TrmrkBtn> }
        { (showOptionsBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:dots-vertical" /></TrmrkBtn> }
        { allowToggleLeftPanel && <TrmrkBtn borderWidth={ showLeftPanel ? 1 : null } onClick={toggleLeftPanelClicked} onContextMenu={toggleLeftPanelContextMenu}>
          <TrmrkIcon icon={ `material-symbols:left-panel-${showLeftPanel ? "close" : "open" }` } /></TrmrkBtn> }
        { allowToggleMiddlePanel && <TrmrkBtn borderWidth={ showMiddlePanel ? 1 : null } onClick={toggleMiddlePanelClicked} onContextMenu={toggleMiddlePanelContextMenu}>
          <TrmrkIcon icon={ `material-symbols:left-panel-${showMiddlePanel ? "close" : "open" }-outline` } /></TrmrkBtn> }
        { allowToggleRightPanel && <TrmrkBtn borderWidth={ showRightPanel ? 1 : null } onClick={toggleRightPanelClicked} onContextMenu={toggleRightPanelContextMenu}>
          <TrmrkIcon icon={ `material-symbols:right-panel-${showRightPanel ? "close" : "open" }` } /></TrmrkBtn> }
        { allowsMultiPanelMode && <TrmrkBtn onClick={toggleMultiPanelModeClicked}>
          <TrmrkIcon icon={`material-symbols:view-column${isSinglePanelMode ? "" : "-outline"}-sharp`} /></TrmrkBtn> }
        { showResizePanelsBtn && <TrmrkBtn><TrmrkIcon icon="material-symbols:resize" /></TrmrkBtn> }
        {children}
      </div>
    </div></>;
}
