import React from "react";
import { useAtom, SetStateAction } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkTopToolBarContents.scss";
import { UseSetAtom } from "../../services/jotai/core";
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
  showEditBtn?: boolean | NullOrUndef;
  showEditDoneBtn?: boolean | NullOrUndef;
  showSaveBtn?: boolean | NullOrUndef;
  saveBtnEnabled?: boolean | NullOrUndef;
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

const togglePanelClicked = (
  {
    panel,
    primaryAltPanel,
    secondaryAltPanel,
    isMultiPanelMode,
    focusedPanel,
    setFocusedPanel,
    showPanel,
    setShowPanel,
    allowShowPrimaryAltPanel,
    showPrimaryAltPanel,
    setShowPrimaryAltPanel,
    allowShowSecondaryAltPanel,
    showSecondaryAltPanel,
    setShowSecondaryAltPanel,
  }: {
    panel: TrmrkAppLayoutPanel,
    primaryAltPanel: TrmrkAppLayoutPanel,
    secondaryAltPanel: TrmrkAppLayoutPanel,
    isMultiPanelMode: boolean,
    focusedPanel: TrmrkAppLayoutPanel,
    setFocusedPanel: UseSetAtom<TrmrkAppLayoutPanel>,
    showPanel: boolean,
    setShowPanel: UseSetAtom<boolean>
    allowShowPrimaryAltPanel: boolean,
    showPrimaryAltPanel: boolean,
    setShowPrimaryAltPanel: UseSetAtom<boolean>,
    allowShowSecondaryAltPanel: boolean,
    showSecondaryAltPanel: boolean,
    setShowSecondaryAltPanel: UseSetAtom<boolean>,
  }
) => {
  const willShowPanel = !(showPanel || focusedPanel === panel);

  if (isMultiPanelMode) {
    setShowPanel(willShowPanel);
  }

  if (willShowPanel) {
    setFocusedPanel(panel);
  } else {
    if (allowShowPrimaryAltPanel && showPrimaryAltPanel) {
      setFocusedPanel(primaryAltPanel);
    } else if (allowShowSecondaryAltPanel && showSecondaryAltPanel) {
      setFocusedPanel(secondaryAltPanel);
    } else if (allowShowPrimaryAltPanel) {
      setFocusedPanel(primaryAltPanel);

      if (isMultiPanelMode) {
          setShowPrimaryAltPanel(true);
      }
    } else {
      setFocusedPanel(secondaryAltPanel)

      if (isMultiPanelMode) {
        setShowSecondaryAltPanel(true);
      }
    }
  }
};

const ToggleLeftPanelBtn = React.memo(() => {
    const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show);
    const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.show);
    const [ allowShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.allowShow);
    const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.show);
    const [ allowShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.allowShow);
    const [ focusedPanel, setFocusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
    const [ isMultiPanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode);

    const toggleLeftPanelClicked = React.useCallback(() => {
      togglePanelClicked({
        panel: TrmrkAppLayoutPanel.Left,
        primaryAltPanel: TrmrkAppLayoutPanel.Middle,
        secondaryAltPanel: TrmrkAppLayoutPanel.Right,
        isMultiPanelMode,
        focusedPanel,
        setFocusedPanel,
        showPanel: showLeftPanel,
        setShowPanel: setShowLeftPanel,
        allowShowPrimaryAltPanel: allowShowMiddlePanel,
        showPrimaryAltPanel: showMiddlePanel,
        setShowPrimaryAltPanel: setShowMiddlePanel,
        allowShowSecondaryAltPanel: allowShowRightPanel,
        showSecondaryAltPanel: showRightPanel,
        setShowSecondaryAltPanel: setShowRightPanel
      });
    }, [showLeftPanel, showMiddlePanel, allowShowMiddlePanel, showRightPanel, allowShowRightPanel, isMultiPanelMode, focusedPanel]);

    const toggleLeftPanelContextMenu = React.useCallback((event: React.MouseEvent) => {
      event.preventDefault();

      if (showLeftPanel) {
        setFocusedPanel(TrmrkAppLayoutPanel.Left);
      }
    }, [showLeftPanel, focusedPanel]);

    return <TrmrkBtn
      className={focusedPanel === TrmrkAppLayoutPanel.Left ? "trmrk-btn-filled-opposite" : ""}
      borderWidth={showLeftPanel ? 1 : null}
      onClick={toggleLeftPanelClicked}
      onContextMenu={toggleLeftPanelContextMenu}>
        <TrmrkIcon icon={ `material-symbols:left-panel-${showLeftPanel ? "close" : "open" }` } />
      </TrmrkBtn>
  });
  
const ToggleMiddlePanelBtn = React.memo(() => {
    const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show);
    const [ allowShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show);
    const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.show);
    const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.show);
    const [ allowShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.allowShow);
    const [ focusedPanel, setFocusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
    const [ isMultiPanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode);

    const toggleMiddlePanelClicked = React.useCallback(() => {
    togglePanelClicked({
      panel: TrmrkAppLayoutPanel.Middle,
      primaryAltPanel: TrmrkAppLayoutPanel.Left,
      secondaryAltPanel: TrmrkAppLayoutPanel.Right,
      isMultiPanelMode,
      focusedPanel,
      setFocusedPanel,
      showPanel: showMiddlePanel,
      setShowPanel: setShowMiddlePanel,
      allowShowPrimaryAltPanel: allowShowRightPanel,
      showPrimaryAltPanel: showRightPanel,
      setShowPrimaryAltPanel: setShowRightPanel,
      allowShowSecondaryAltPanel: allowShowLeftPanel,
      showSecondaryAltPanel: showLeftPanel,
      setShowSecondaryAltPanel: setShowLeftPanel
    });
    }, [showLeftPanel, allowShowLeftPanel, showMiddlePanel, showRightPanel, allowShowRightPanel, isMultiPanelMode, focusedPanel]);

    const toggleMiddlePanelContextMenu = React.useCallback((event: React.MouseEvent) => {
      event.preventDefault();

      if (showMiddlePanel) {
        setFocusedPanel(TrmrkAppLayoutPanel.Middle);
      }
    }, [showMiddlePanel, isMultiPanelMode, focusedPanel]);

    return <TrmrkBtn
      className={focusedPanel === TrmrkAppLayoutPanel.Middle ? "trmrk-btn-filled-opposite" : ""}
      borderWidth={ showMiddlePanel ? 1 : null }
      onClick={toggleMiddlePanelClicked}
      onContextMenu={toggleMiddlePanelContextMenu}>
    <TrmrkIcon icon={ `material-symbols:left-panel-${showMiddlePanel ? "close" : "open" }-outline` } /></TrmrkBtn>;
  });

const ToggleRightPanelBtn = React.memo(() => {
    const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show);
    const [ allowShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show);
    const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.show);
    const [ allowShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.allowShow);
    const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.show);
    const [ focusedPanel, setFocusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
    const [ isMultiPanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode);

    const toggleRightPanelClicked = React.useCallback(() => {
    togglePanelClicked({
      panel: TrmrkAppLayoutPanel.Right,
      primaryAltPanel: TrmrkAppLayoutPanel.Middle,
      secondaryAltPanel: TrmrkAppLayoutPanel.Left,
      isMultiPanelMode,
      focusedPanel,
      setFocusedPanel,
      showPanel: showRightPanel,
      setShowPanel: setShowRightPanel,
      allowShowPrimaryAltPanel: allowShowMiddlePanel,
      showPrimaryAltPanel: showMiddlePanel,
      setShowPrimaryAltPanel: setShowMiddlePanel,
      allowShowSecondaryAltPanel: allowShowLeftPanel,
      showSecondaryAltPanel: showLeftPanel,
      setShowSecondaryAltPanel: setShowLeftPanel
    });
    }, [showLeftPanel, allowShowLeftPanel, showMiddlePanel, allowShowMiddlePanel, showRightPanel, isMultiPanelMode, focusedPanel]);

    const toggleRightPanelContextMenu = React.useCallback((event: React.MouseEvent) => {
      event.preventDefault();

      if (showRightPanel) {
        setFocusedPanel(TrmrkAppLayoutPanel.Right);
      }
    }, [showRightPanel, isMultiPanelMode, focusedPanel]);

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
  showEditBtn,
  showEditDoneBtn,
  showSaveBtn,
  saveBtnEnabled,
  showRefreshBtn,
  showPrimaryCustomActionBtn,
  showSecondaryCustomActionBtn,
  showOptionsBtn
}: Readonly<TrmrkTopToolBarContentsProps>) {
  const toolbarContainerElRef = React.useRef<HTMLDivElement | null>(null);
  const toolbarContentsElRef = React.useRef<HTMLDivElement | null>(null);

  const [ showLeftPanel, setShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show);
  const [ allowShowLeftPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.allowShow);
  const [ showMiddlePanel, setShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.show);
  const [ allowShowMiddlePanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.allowShow);
  const [ showRightPanel, setShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.show);
  const [ allowShowRightPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.allowShow);
  const [ focusedPanel ] = useAtom(trmrk3PanelsAppLayoutAtoms.focusedPanel);
  const [ isMultiPanelMode, setIsMultiPanelMode ] = useAtom(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode);
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
    () => [
      (allowShowLeftPanel && showLeftPanel),
      (allowShowMiddlePanel && showMiddlePanel),
      (allowShowRightPanel && showRightPanel)].filter(show => show).length > 1,
    [showLeftPanel, showMiddlePanel, showRightPanel, isMultiPanelMode]);

  const showToggleLeftPanelBtn = React.useMemo(
    () => allowShowLeftPanel && (allowShowMiddlePanel || allowShowRightPanel),
    [allowShowLeftPanel, allowShowMiddlePanel, allowShowRightPanel]);

  const showToggleMiddlePanelBtn = React.useMemo(
    () => allowShowMiddlePanel && allowShowRightPanel,
    [allowShowMiddlePanel, allowShowRightPanel]);

  const showToggleRightPanelBtn = React.useMemo(
    () => allowShowRightPanel && allowShowMiddlePanel,
    [allowShowRightPanel, allowShowMiddlePanel]);

  const showToggleMultiPanelMode = React.useMemo(
    () => showToggleLeftPanelBtn || showToggleMiddlePanelBtn || showToggleRightPanelBtn,
    [showToggleLeftPanelBtn, showToggleMiddlePanelBtn, showToggleRightPanelBtn])

  const toggleMultiPanelModeClicked = React.useCallback(() => {
    const willBeMultiPanelMode = !isMultiPanelMode;
    setIsMultiPanelMode(willBeMultiPanelMode);

    if (!willBeMultiPanelMode) {
      setShowLeftPanel(false);
      setShowMiddlePanel(false);
      setShowRightPanel(false);
    }
  }, [showLeftPanel, showMiddlePanel, showRightPanel, isMultiPanelMode, focusedPanel]);

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
          { (showEditBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="mdi:edit" /></TrmrkBtn> }
          { (showEditDoneBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="mdi:done" /></TrmrkBtn> }
          { (showSaveBtn ?? false) && <TrmrkBtn disabled={saveBtnEnabled === false}><TrmrkIcon icon="mdi:content-save" /></TrmrkBtn> }
          { (showRefreshBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="material-symbols:refresh" /></TrmrkBtn> }
          { (showPrimaryCustomActionBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="solar:command-outline" /></TrmrkBtn> }
          { (showSecondaryCustomActionBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="solar:command-bold" /></TrmrkBtn> }
          {children}
          { showToggleLeftPanelBtn && <ToggleLeftPanelBtn></ToggleLeftPanelBtn> }
          { showToggleMiddlePanelBtn && <ToggleMiddlePanelBtn></ToggleMiddlePanelBtn> }
          { showToggleRightPanelBtn && <ToggleRightPanelBtn></ToggleRightPanelBtn> }
          { showToggleMultiPanelMode && <TrmrkBtn onClick={toggleMultiPanelModeClicked}>
            <TrmrkIcon icon={`material-symbols:view-column${isMultiPanelMode ? "-outline" : ""}-sharp`} /></TrmrkBtn> }
          { showResizePanelsBtn && <TrmrkBtn><TrmrkIcon icon="material-symbols:resize" />
            </TrmrkBtn> }
          { (showOptionsBtn ?? false) && <TrmrkBtn><TrmrkIcon icon="mdi:dots-vertical" /></TrmrkBtn> }
          <TrmrkBtn><TrmrkIcon icon="material-symbols:tab-group" /></TrmrkBtn>
          <TrmrkBtn><TrmrkIcon icon="mdi:close" /></TrmrkBtn>
        </div>
      </div>
      <ContentsShiftRightBtn />
    </div>;
}
