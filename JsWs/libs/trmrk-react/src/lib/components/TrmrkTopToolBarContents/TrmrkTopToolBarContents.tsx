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
  showRefreshBtn?: boolean | NullOrUndef;
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
  showRefreshBtn,
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

    if (willShowLeftPanel) {
      setFocusedPanel(TrmrkAppLayoutPanel.Left);

      if (isSinglePanelMode) {
        setShowMiddlePanel(false);
        setShowRightPanel(false);
      }
    } else {
      if (showMiddlePanel) {
        if (focusedPanel === TrmrkAppLayoutPanel.Left) {
          setFocusedPanel(TrmrkAppLayoutPanel.Middle);
        }
      } else if (showRightPanel) {
        if (focusedPanel === TrmrkAppLayoutPanel.Left) {
          setFocusedPanel(TrmrkAppLayoutPanel.Right);
        }
      } else {
          setShowMiddlePanel(true);
          setFocusedPanel(TrmrkAppLayoutPanel.Middle);
      }
    }
  }, [showLeftPanel, showMiddlePanel, showRightPanel, isSinglePanelMode, focusedPanel]);

  const toggleMiddlePanelClicked = React.useCallback(() => {
    const willShowMiddlePanel = !showMiddlePanel;
    setShowMiddlePanel(!showMiddlePanel);

    if (willShowMiddlePanel) {
      setFocusedPanel(TrmrkAppLayoutPanel.Middle);

      if (isSinglePanelMode) {
        setShowLeftPanel(false);
        setShowRightPanel(false);
      }
    } else if (showRightPanel) {
      setFocusedPanel(TrmrkAppLayoutPanel.Right);
    } else if (showLeftPanel) {
      setFocusedPanel(TrmrkAppLayoutPanel.Left);
    } else {
      setShowRightPanel(true);
      setFocusedPanel(TrmrkAppLayoutPanel.Right);
    }
  }, [showLeftPanel, showMiddlePanel, showRightPanel, isSinglePanelMode, focusedPanel]);

  const toggleRightPanelClicked = React.useCallback(() => {
    const willShowRightPanel = !showRightPanel;
    setShowRightPanel(!showRightPanel);

    if (willShowRightPanel) {
      setFocusedPanel(TrmrkAppLayoutPanel.Right);

      if (isSinglePanelMode) {
        setShowLeftPanel(false);
        setShowMiddlePanel(false);
      }
    } else {
      if (showMiddlePanel) {
        if (focusedPanel === TrmrkAppLayoutPanel.Left) {
          setFocusedPanel(TrmrkAppLayoutPanel.Middle);
        }
      } else if (showLeftPanel) {
        if (focusedPanel === TrmrkAppLayoutPanel.Right) {
          setFocusedPanel(TrmrkAppLayoutPanel.Left);
        }
      } else {
          setShowMiddlePanel(true);
          setFocusedPanel(TrmrkAppLayoutPanel.Middle);
      }
    }
  }, [showLeftPanel, showMiddlePanel, showRightPanel, isSinglePanelMode, focusedPanel]);

  const toggleLeftPanelContextMenu = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();

    if (showLeftPanel) {
      setFocusedPanel(TrmrkAppLayoutPanel.Left);
    }
  }, [showLeftPanel, isSinglePanelMode, focusedPanel]);

  const toggleMiddlePanelContextMenu = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();

    if (showMiddlePanel) {
      setFocusedPanel(TrmrkAppLayoutPanel.Middle);
    }
  }, [showMiddlePanel, isSinglePanelMode, focusedPanel]);

  const toggleRightPanelContextMenu = React.useCallback((event: React.MouseEvent) => {
    event.preventDefault();

    if (showRightPanel) {
      setFocusedPanel(TrmrkAppLayoutPanel.Right);
    }
  }, [showRightPanel, isSinglePanelMode, focusedPanel]);

  const toggleMultiPanelModeClicked = React.useCallback(() => {
    const willBeSinglePanelMode = !isSinglePanelMode;
    setIsSinglePanelMode(willBeSinglePanelMode);

    if (willBeSinglePanelMode) {
      switch(focusedPanel) {
        case TrmrkAppLayoutPanel.Left:
          setShowMiddlePanel(false);
          setShowRightPanel(false);
          break;
        case TrmrkAppLayoutPanel.Middle:
          setShowLeftPanel(false);
          setShowRightPanel(false);
          break;
        case TrmrkAppLayoutPanel.Right:
          setShowLeftPanel(false);
          setShowMiddlePanel(false);
          break;
      }
    }
  }, [showLeftPanel, showMiddlePanel, showRightPanel, isSinglePanelMode, focusedPanel]);

  const AllowToggleLeftPanelBtn = React.useMemo(() => () => <TrmrkBtn
      className={focusedPanel === TrmrkAppLayoutPanel.Left ? "trmrk-btn-filled-opposite" : ""}
      borderWidth={ showLeftPanel ? 1 : null }
      onClick={toggleLeftPanelClicked}
      onContextMenu={toggleLeftPanelContextMenu}>
    <TrmrkIcon icon={ `material-symbols:left-panel-${showLeftPanel ? "close" : "open" }` } /></TrmrkBtn>, [
      focusedPanel,
      showLeftPanel
    ]);
    
  const AllowToggleMiddlePanelBtn = React.useMemo(() => () => <TrmrkBtn
      className={focusedPanel === TrmrkAppLayoutPanel.Middle ? "trmrk-btn-filled-opposite" : ""}
      borderWidth={ showMiddlePanel ? 1 : null }
      onClick={toggleMiddlePanelClicked}
      onContextMenu={toggleMiddlePanelContextMenu}>
    <TrmrkIcon icon={ `material-symbols:left-panel-${showMiddlePanel ? "close" : "open" }-outline` } /></TrmrkBtn>,[
      focusedPanel,
      showMiddlePanel
    ]);

  const AllowToggleRightPanelBtn = React.useMemo(() => () => <TrmrkBtn
      className={focusedPanel === TrmrkAppLayoutPanel.Right ? "trmrk-btn-filled-opposite" : ""}
      borderWidth={ showRightPanel ? 1 : null }
      onClick={toggleRightPanelClicked}
      onContextMenu={toggleRightPanelContextMenu}>
    <TrmrkIcon icon={ `material-symbols:right-panel-${showRightPanel ? "close" : "open" }` } /></TrmrkBtn>,[
      focusedPanel,
      showRightPanel
    ]);

  return <><div className="trmrk-toolbar-content flex grow">
      <div className="flex grow">
        { (showBackBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:arrow-back" /></TrmrkBtn> }
        { (showGoToParentBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="mdi:arrow-up" /></TrmrkBtn> }
        { (showHomeBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:home" /></TrmrkBtn> }
        { (showUndoBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:undo" /></TrmrkBtn> }
        { (showRedoBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:redo" /></TrmrkBtn> }
        { (showRefreshBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:refresh" /></TrmrkBtn> }
        { (showPrimaryCustomActionBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="solar:command-outline" /></TrmrkBtn> }
        { (showSecondaryCustomActionBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="solar:command-bold" /></TrmrkBtn> }
        { (showOptionsBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:dots-vertical" /></TrmrkBtn> }
        { allowToggleLeftPanel && <AllowToggleLeftPanelBtn></AllowToggleLeftPanelBtn> }
        { allowToggleMiddlePanel && <AllowToggleMiddlePanelBtn></AllowToggleMiddlePanelBtn> }
        { allowToggleRightPanel && <AllowToggleRightPanelBtn></AllowToggleRightPanelBtn> }
        { allowsMultiPanelMode && <TrmrkBtn onClick={toggleMultiPanelModeClicked}>
          <TrmrkIcon icon={`material-symbols:view-column${isSinglePanelMode ? "" : "-outline"}-sharp`} /></TrmrkBtn> }
        { showResizePanelsBtn && <TrmrkBtn><TrmrkIcon icon="material-symbols:resize" />
          </TrmrkBtn> }
        {children}
      </div>
    </div></>;
}
