import React from "react";
import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./TrmrkBasicAppLayout.scss";

import { ComponentProps } from "../defs/common";
import TrmrkHorizStrip from "../TrmrkHorizStrip/TrmrkHorizStrip";
import { defaultTrmrkAppModalService } from "./TrmrkAppModalService";

import {
  appBarContents,
  bottomToolbarContents,
  topToolbarContents,
  useShowToolbars,
  useToolbarContentKeys,
  useToolbarOverridingContentKeys,
  overridingAppBarContents,
  overridingBottomToolbarContents,
  overridingTopToolbarContents,
  useAppUserMessage
} from "./TrmrkBasicAppLayoutService";

import { trmrkBasicAppLayoutAtoms, appOverlappingContents } from "./TrmrkBasicAppLayoutService";
import TrmrkMessagePopover from "../TrmrkMessagePopover/TrmrkMessagePopover";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";

export interface TrmrkBasicAppLayoutProps extends ComponentProps {}

export default function TrmrkBasicAppLayout({children, className: cssClass}: Readonly<TrmrkBasicAppLayoutProps>) {
  const [ overlappingContentKeys ] = useAtom(appOverlappingContents.value.currentKeysAtom);
  const [cssClassValue] = useAtom(trmrkBasicAppLayoutAtoms.cssClass);
  const [showToolbars] = useAtom(trmrkBasicAppLayoutAtoms.showToolbars);
  const [openModalsCurrentKeys] = useAtom(defaultTrmrkAppModalService.value.openModals.currentKeysAtom);
  const [isClosingModals] = useAtom(defaultTrmrkAppModalService.value.isClosingModals);

  const showToolbarAtoms = useShowToolbars();
  const toolbarContentKeys = useToolbarContentKeys();
  const overridingToolbarContentKeys = useToolbarOverridingContentKeys();
  const appUserMessageAtoms = useAppUserMessage();

  const showAppBar = React.useMemo(() => {
    const retVal = showToolbarAtoms.appBar.value || (overridingToolbarContentKeys.appBar.value ?? null) !== null;
    return retVal;
  }, [
    showToolbarAtoms.appBar.value,
    overridingToolbarContentKeys.appBar.value
  ]);

  const showTopToolbar = React.useMemo(() => {
    let retVal = showToolbars && showToolbarAtoms.topToolbar.value;
    retVal ||= (overridingToolbarContentKeys.topToolbar.value ?? null) !== null;
    return retVal;
  }, [
    showToolbars,
    showToolbarAtoms.topToolbar.value,
    overridingToolbarContentKeys.topToolbar.value
  ]);

  const showBottomToolbar = React.useMemo(() => {
    let retVal = showToolbars && showToolbarAtoms.bottomToolbar.value;
    retVal ||= (overridingToolbarContentKeys.bottomToolbar.value ?? null) !== null;
    return retVal;
  }, [
    showToolbars,
    showToolbarAtoms.bottomToolbar.value,
    overridingToolbarContentKeys.bottomToolbar.value
  ]);

  const appBarContentsNode = React.useMemo(() => {
    let retVal: React.ReactNode = null;

    if ((overridingToolbarContentKeys.appBar.value ?? null) !== null) {
      retVal = overridingAppBarContents.value.keyedMap.map[overridingToolbarContentKeys.appBar.value!]?.node;
    } else if ((toolbarContentKeys.appBar.value ?? null) !== null) {
      retVal = appBarContents.value.keyedMap.map[toolbarContentKeys.appBar.value!]?.node;
    }

    return retVal;
  }, [
    overridingToolbarContentKeys.appBar.value,
    toolbarContentKeys.appBar.value
  ]);

  const topToolbarContentsNode = React.useMemo(() => {
    let retVal: React.ReactNode = null;

    if ((overridingToolbarContentKeys.topToolbar.value ?? null) !== null) {
      retVal = overridingTopToolbarContents.value.keyedMap.map[overridingToolbarContentKeys.topToolbar.value!]?.node;
    } else if (showToolbars && (showToolbarAtoms.topToolbar.value ?? null) !== null) {
      retVal = topToolbarContents.value.keyedMap.map[toolbarContentKeys.topToolbar.value!]?.node;
    }

    return retVal;
  }, [
    overridingToolbarContentKeys.topToolbar.value,
    toolbarContentKeys.topToolbar.value
  ]);

  const bottomToolbarContentsNode = React.useMemo(() => {
    let retVal: React.ReactNode = null;

    if ((overridingToolbarContentKeys.bottomToolbar.value ?? null) !== null) {
      retVal = overridingBottomToolbarContents.value.keyedMap.map[overridingToolbarContentKeys.bottomToolbar.value!]?.node;
    } else if (showToolbars && (showToolbarAtoms.bottomToolbar.value ?? null) !== null) {
      retVal = bottomToolbarContents.value.keyedMap.map[toolbarContentKeys.bottomToolbar.value!]?.node;
    }

    return retVal;
  }, [
    overridingToolbarContentKeys.bottomToolbar.value,
    toolbarContentKeys.bottomToolbar.value
  ]);

  const openModalCurrentKey = React.useMemo(
    () => openModalsCurrentKeys.length ? openModalsCurrentKeys[openModalsCurrentKeys.length - 1] : null,
    [openModalsCurrentKeys])

  const openModalNode = React.useMemo(() => {
    return (openModalCurrentKey ?? null) !== null && withValIf(
      defaultTrmrkAppModalService.value.openModals.keyedMap.map[openModalCurrentKey!],
      modal => modal.node(modal.key))
  }, [openModalCurrentKey]);

  React.useEffect(() => {
    console.log("APP LAYOUT MOUNTED");
  }, []);

  return (
    <div className={['trmrk-app-layout', cssClass ?? '', cssClassValue ?? ''].join(' ')}>


      { /* **** **** **** **** **** **** **** **** APP_BAR START **** **** **** **** **** **** **** **** */
        (showAppBar || showTopToolbar) && <div className="trmrk-app-header">
          { showAppBar && <TrmrkHorizStrip className="trmrk-app-bar">{ appBarContentsNode }</TrmrkHorizStrip> }
          { showTopToolbar && <TrmrkHorizStrip className="trmrk-top-toolbar">{ topToolbarContentsNode }</TrmrkHorizStrip> }
        </div>
      /* **** **** **** **** **** **** **** **** APP_BAR END **** **** **** **** **** **** **** **** */ }



      { /* **** **** **** **** **** **** **** **** BODY START **** **** **** **** **** **** **** **** */
        <div className="trmrk-app-body">
          {children}
        </div>
      /* **** **** **** **** **** **** **** **** BODY END **** **** **** **** **** **** **** **** */ }



      { /* **** **** **** **** **** **** **** **** FOOTER START **** **** **** **** **** **** **** **** */
        showBottomToolbar && <div className="trmrk-app-footer">
          <TrmrkHorizStrip className="trmrk-bottom-toolbar">{ bottomToolbarContentsNode }</TrmrkHorizStrip>
        </div>
      /* **** **** **** **** **** **** **** **** FOOTER END **** **** **** **** **** **** **** **** */ }



      { /* **** **** **** **** **** **** **** **** OVERLAPPING_CONTENTS START **** **** **** **** **** **** **** **** */
        <div className="trmrk-overlapping-contents">
          { overlappingContentKeys.map(key => <React.Fragment key={key}>
            { appOverlappingContents.value.keyedMap.map[key]?.node }
          </React.Fragment>) }
          
          { ((appUserMessageAtoms.show.value ?? null) !== null && (appUserMessageAtoms.level.value ?? null) !== null) && <TrmrkMessagePopover
            show={appUserMessageAtoms.show.value}
            msgLevel={appUserMessageAtoms.level.value}
            autoCloseMillis={appUserMessageAtoms.autoCloseMillis.value}
            className={[appUserMessageAtoms.cssClass.value ?? "", "trmrk-app-user-message-popover-container"].join(' ')}>
              { appUserMessageAtoms.content.value }</TrmrkMessagePopover> }
          
          { ((openModalCurrentKey ?? null) !== null) && <div className={[
            "trmrk-app-modal-backdrop",
            isClosingModals ? "trmrk-fade-out" : "trmrk-fade-in"].join(" ")}>
            { openModalNode }
          </div> }
        </div>
      /* **** **** **** **** **** **** **** **** OVERLAPPING_CONTENTS END **** **** **** **** **** **** **** **** */ }


    </div>
  );
}
