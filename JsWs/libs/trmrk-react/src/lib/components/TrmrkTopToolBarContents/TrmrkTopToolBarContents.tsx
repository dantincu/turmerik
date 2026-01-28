import React from "react";
import { useAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkTopToolBarContents.scss";
import { ComponentProps } from "../defs/common";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import { trmrk3PanelsAppLayoutAtoms, TrmrkAppLayoutPanel } from "../Trmrk3PanelsAppLayout/Trmrk3PanelsAppLayoutService";
import { trmrkTopToolBarContentsAtoms } from "./TrmrkTopToolBarContentsService";

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

const toolbarHorizPaddingPx = 6;
const toolbarAdditionalOffset = 84;

const ContentsShiftLeftBtn = React.memo(() => {
  const [ toolbarContainerWidth ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContainerWidth);
  const [ toolbarContentsMaxOffset ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContentsMaxOffset);
  const [ toolbarContentsOffset, setToolbarContentsOffset ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContentsOffset);
  const [ showToolbarContentsScrollBtns ] = useAtom(trmrkTopToolBarContentsAtoms.showToolbarContentsScrollBtns);

  const btnClicked = React.useCallback(() => {
    const newToolbarContentsOffset = Math.max(0, toolbarContentsOffset - toolbarContainerWidth / 2);
    setToolbarContentsOffset(newToolbarContentsOffset);
  }, [toolbarContentsMaxOffset, toolbarContentsOffset, toolbarContainerWidth]);

  return <TrmrkBtn onClick={btnClicked} className={[
    "trmrk-btn-filled-system trmrk-contents-shift-left",
    showToolbarContentsScrollBtns ? "" : "trmrk-hidden"].join(" ")}><TrmrkIcon icon="mdi:chevron-left" /></TrmrkBtn>
});

const ContentsShiftRightBtn = React.memo(() => {
  const [ toolbarContainerWidth ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContainerWidth);
  const [ toolbarContentsMaxOffset ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContentsMaxOffset);
  const [ toolbarContentsOffset, setToolbarContentsOffset ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContentsOffset);
  const [ showToolbarContentsScrollBtns ] = useAtom(trmrkTopToolBarContentsAtoms.showToolbarContentsScrollBtns);

  const btnClicked = React.useCallback(() => {
    const newToolbarContentsOffset = Math.min(toolbarContentsMaxOffset, toolbarContentsOffset + toolbarContainerWidth / 2);
    setToolbarContentsOffset(newToolbarContentsOffset);
  }, [toolbarContentsOffset, toolbarContainerWidth]);

  return <TrmrkBtn onClick={btnClicked} className={[
    "trmrk-btn-filled-system trmrk-contents-shift-right",
    showToolbarContentsScrollBtns ? "" : "trmrk-hidden"].join(" ")}><TrmrkIcon icon="mdi:chevron-right" /></TrmrkBtn>
});

const ToggleLeftPanelBtn = React.memo(() => {
    const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
    const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showMiddlePanel);
    const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
    const [ focusedPanel, setFocusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
    const [ isSinglePanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isSinglePanelMode);

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

    const toggleLeftPanelContextMenu = React.useCallback((event: React.MouseEvent) => {
      event.preventDefault();

      if (showLeftPanel) {
        setFocusedPanel(TrmrkAppLayoutPanel.Left);
      }
    }, [showLeftPanel, isSinglePanelMode, focusedPanel]);

    return <TrmrkBtn
      className={focusedPanel === TrmrkAppLayoutPanel.Left ? "trmrk-btn-filled-opposite" : ""}
      borderWidth={showLeftPanel ? 1 : null}
      onClick={toggleLeftPanelClicked}
      onContextMenu={toggleLeftPanelContextMenu}>
        <TrmrkIcon icon={ `material-symbols:left-panel-${showLeftPanel ? "close" : "open" }` } />
      </TrmrkBtn>
  });
  
const ToggleMiddlePanelBtn = React.memo(() => {
    const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
    const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showMiddlePanel);
    const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
    const [ focusedPanel, setFocusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
    const [ isSinglePanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isSinglePanelMode);

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

    const toggleMiddlePanelContextMenu = React.useCallback((event: React.MouseEvent) => {
      event.preventDefault();

      if (showMiddlePanel) {
        setFocusedPanel(TrmrkAppLayoutPanel.Middle);
      }
    }, [showMiddlePanel, isSinglePanelMode, focusedPanel]);

    return <TrmrkBtn
      className={focusedPanel === TrmrkAppLayoutPanel.Middle ? "trmrk-btn-filled-opposite" : ""}
      borderWidth={ showMiddlePanel ? 1 : null }
      onClick={toggleMiddlePanelClicked}
      onContextMenu={toggleMiddlePanelContextMenu}>
    <TrmrkIcon icon={ `material-symbols:left-panel-${showMiddlePanel ? "close" : "open" }-outline` } /></TrmrkBtn>;
  });

const ToggleRightPanelBtn = React.memo(() => {
    const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
    const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showMiddlePanel);
    const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
    const [ focusedPanel, setFocusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
    const [ isSinglePanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isSinglePanelMode);

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
          if (focusedPanel === TrmrkAppLayoutPanel.Right) {
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

    const toggleRightPanelContextMenu = React.useCallback((event: React.MouseEvent) => {
      event.preventDefault();

      if (showRightPanel) {
        setFocusedPanel(TrmrkAppLayoutPanel.Right);
      }
    }, [showRightPanel, isSinglePanelMode, focusedPanel]);

    return <TrmrkBtn
      className={focusedPanel === TrmrkAppLayoutPanel.Right ? "trmrk-btn-filled-opposite" : ""}
      borderWidth={ showRightPanel ? 1 : null }
      onClick={toggleRightPanelClicked}
      onContextMenu={toggleRightPanelContextMenu}>
    <TrmrkIcon icon={ `material-symbols:right-panel-${showRightPanel ? "close" : "open" }` } /></TrmrkBtn>
  });

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
  const toolbarContainerElRef = React.useRef<HTMLDivElement | null>(null);
  const toolbarContentsElRef = React.useRef<HTMLDivElement | null>(null);

  const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showLeftPanel);
  const [ allowToggleLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.allowToggleLeftPanel);
  const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showMiddlePanel);
  const [ allowToggleMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.allowToggleMiddlePanel);
  const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.showRightPanel);
  const [ allowToggleRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.allowToggleRightPanel);
  const [ focusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [ isSinglePanelMode, setIsSinglePanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isSinglePanelMode);
  const [ allowsMultiPanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.allowsMultiPanelMode);
  const [ , setToolbarContainerWidth ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContainerWidth);
  const [ , setToolbarContentsWidth ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContentsWidth);
  const [ toolbarContentsMaxOffset, setToolbarContentsMaxOffset ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContentsMaxOffset);
  const [ toolbarContentsOffset, setToolbarContentsOffset ] = useAtom(trmrkTopToolBarContentsAtoms.toolbarContentsOffset);
  const [ , setShowToolbarContentsScrollBtns ] = useAtom(trmrkTopToolBarContentsAtoms.showToolbarContentsScrollBtns);

  const toolbarContentsOffsetValue = React.useMemo(
    () => -1 * Math.max(0, Math.min(toolbarContentsMaxOffset, toolbarContentsOffset)), [
      toolbarContentsMaxOffset,
      toolbarContentsOffset]);

  const showResizePanelsBtn = React.useMemo(
    () => [showLeftPanel, showMiddlePanel, showRightPanel].filter(show => show).length > 0,
    [showLeftPanel, showMiddlePanel, showRightPanel, isSinglePanelMode])

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

  const updateToolbarContentsScrolBtnsVisibility = React.useCallback(() => {
    const toolbarContainerEl = toolbarContainerElRef.current;
    const toolbarContentsEl = toolbarContentsElRef.current;

    if (toolbarContainerEl && toolbarContentsEl) {
      const toolbarContainerElWidth = toolbarContainerEl.offsetWidth;
      const toolbarContentsElWidth = toolbarContentsEl.offsetWidth;

      setToolbarContainerWidth(toolbarContainerElWidth);
      setToolbarContentsWidth(toolbarContentsElWidth);

      let newToolbarContentsMaxOffset = toolbarContentsElWidth - toolbarContainerElWidth + toolbarHorizPaddingPx + toolbarAdditionalOffset;
      newToolbarContentsMaxOffset = Math.max(0, newToolbarContentsMaxOffset);
      const newShowToolbarContentsScrollBtns = newToolbarContentsMaxOffset > toolbarAdditionalOffset;
      
      setToolbarContentsMaxOffset(newToolbarContentsMaxOffset);
      setShowToolbarContentsScrollBtns(newShowToolbarContentsScrollBtns);

      if (!newShowToolbarContentsScrollBtns) {
        setToolbarContentsOffset(0);
      }
    }
  }, []);

  const toolbarContainerElResizeObserver = new ResizeObserver(updateToolbarContentsScrolBtnsVisibility);
  const toolbarContentsElResizeObserver = new ResizeObserver(updateToolbarContentsScrolBtnsVisibility);

  const toolbarContainerElAvailable = React.useCallback((el: HTMLDivElement | null) => {
    toolbarContainerElRef.current = el;

    if (el) {
      toolbarContainerElResizeObserver.observe(el);
      updateToolbarContentsScrolBtnsVisibility();
    }
  }, []);

  const toolbarContentsElAvailable = React.useCallback((el: HTMLDivElement | null) => {
    toolbarContentsElRef.current = el;

    if (el) {
      toolbarContentsElResizeObserver.observe(el);
      updateToolbarContentsScrolBtnsVisibility();
    }
  }, []);

  React.useEffect(() => {
    return () => {
      toolbarContainerElResizeObserver.disconnect();
      toolbarContentsElResizeObserver.disconnect();
      toolbarContainerElRef.current = null;
      toolbarContentsElRef.current = null;
    }
  }, []);

  return <div className="trmrk-toolbar-container" ref={toolbarContainerElAvailable}>
      <ContentsShiftLeftBtn />
      <div className="trmrk-toolbar-contents-wrapper">
        <div className="trmrk-toolbar-contents" style={{ left: `${toolbarContentsOffsetValue}px` }} ref={toolbarContentsElAvailable}>
          { (showBackBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:arrow-back" /></TrmrkBtn> }
          { (showGoToParentBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="mdi:arrow-up" /></TrmrkBtn> }
          { (showHomeBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:home" /></TrmrkBtn> }
          { (showUndoBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:undo" /></TrmrkBtn> }
          { (showRedoBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:redo" /></TrmrkBtn> }
          { (showRefreshBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:refresh" /></TrmrkBtn> }
          { (showPrimaryCustomActionBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="solar:command-outline" /></TrmrkBtn> }
          { (showSecondaryCustomActionBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="solar:command-bold" /></TrmrkBtn> }
          { (showOptionsBtn ?? true) && <TrmrkBtn><TrmrkIcon icon="mdi:dots-vertical" /></TrmrkBtn> }
          { allowToggleLeftPanel && <ToggleLeftPanelBtn></ToggleLeftPanelBtn> }
          { allowToggleMiddlePanel && <ToggleMiddlePanelBtn></ToggleMiddlePanelBtn> }
          { allowToggleRightPanel && <ToggleRightPanelBtn></ToggleRightPanelBtn> }
          { allowsMultiPanelMode && <TrmrkBtn onClick={toggleMultiPanelModeClicked}>
            <TrmrkIcon icon={`material-symbols:view-column${isSinglePanelMode ? "" : "-outline"}-sharp`} /></TrmrkBtn> }
          { showResizePanelsBtn && <TrmrkBtn><TrmrkIcon icon="material-symbols:resize" />
            </TrmrkBtn> }
          {children}
        </div>
      </div>
      <ContentsShiftRightBtn />
    </div>;
}
