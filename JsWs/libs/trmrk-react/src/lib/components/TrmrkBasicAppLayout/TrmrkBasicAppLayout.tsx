import React from "react";
import { useAtom } from "jotai";
import { atomEffect } from 'jotai-effect';

import { withValIf } from "@/src/trmrk/core";
import { isDebugLoggingEnabled } from "@/src/trmrk/dev";

import "./TrmrkBasicAppLayout.scss";

import { ComponentProps } from "../defs/common";
import TrmrkHorizStrip from "../TrmrkHorizStrip/TrmrkHorizStrip";

import {
  defaultTrmrkAppModalService,
  useCurrentModalUserMessage
} from "./TrmrkAppModalService";

import { defaultTrmrkPopoverService } from "./TrmrkPopoverService";

import {
  appBarContents,
  bottomToolbarContents,
  topToolbarContents,
  useShowToolbars,
  useShowOverridingToolbars,
  useToolbarContentKeys,
  useToolbarOverridingContentKeys,
  overridingAppBarContents,
  overridingBottomToolbarContents,
  overridingTopToolbarContents,
  useAppUserMessage
} from "./TrmrkBasicAppLayoutService";

import { trmrkBasicAppLayoutAtoms } from "./TrmrkBasicAppLayoutService";
import TrmrkMessagePopover from "../TrmrkMessagePopover/TrmrkMessagePopover";

export interface TrmrkBasicAppLayoutProps extends ComponentProps {}

const lifecycleEffect = atomEffect((get, set) => {
  if (isDebugLoggingEnabled.value) {
    console.log('APP HAS BEEN MOUNTED');
  }

  return () => {
    if (isDebugLoggingEnabled.value) {
      console.log('APP HAS BEEN UNMOUNTED');
    }
  };
});

export default function TrmrkBasicAppLayout({children, className: cssClass}: Readonly<TrmrkBasicAppLayoutProps>) {
  useAtom(lifecycleEffect);
  const layoutRenderIdRef = React.useRef(0);
  const [cssClassValue] = useAtom(trmrkBasicAppLayoutAtoms.cssClass);
  const [hideHeaderAndFooter] = useAtom(trmrkBasicAppLayoutAtoms.hideHeaderAndFooter);
  const [showToolbars] = useAtom(trmrkBasicAppLayoutAtoms.showToolbars);
  const [currentModalStackKey] = useAtom(defaultTrmrkAppModalService.value.stacks.currentKeyAtom);
  const [currentModalKey] = useAtom(defaultTrmrkAppModalService.value.currentModalKey);
  const [isClosingModals] = useAtom(defaultTrmrkAppModalService.value.isClosingModals);
  const [currentPopoverKey] = useAtom(defaultTrmrkPopoverService.value.openPopovers.currentKeyAtom);
  const [isClosingPopovers] = useAtom(defaultTrmrkPopoverService.value.isClosingPopovers);

  const showToolbarAtoms = useShowToolbars();
  const showOverridingToolbarAtoms = useShowOverridingToolbars();
  const toolbarContentKeys = useToolbarContentKeys();
  const overridingToolbarContentKeys = useToolbarOverridingContentKeys();
  const appUserMessageAtoms = useAppUserMessage();
  const currentModalUserMessage = useCurrentModalUserMessage();

  const showAppBar = React.useMemo(() => {
    const retVal = (!hideHeaderAndFooter && showToolbarAtoms.appBar.value) || showOverridingToolbarAtoms.appBar.value;
    return retVal;
  }, [
    showToolbarAtoms.appBar.value,
    showOverridingToolbarAtoms.appBar.value,
    hideHeaderAndFooter
  ]);

  const showTopToolbar = React.useMemo(() => {
    let retVal = !hideHeaderAndFooter && showToolbars && showToolbarAtoms.topToolbar.value;
    retVal ||= showOverridingToolbarAtoms.topToolbar.value;
    return retVal;
  }, [
    showToolbars,
    showToolbarAtoms.topToolbar.value,
    showOverridingToolbarAtoms.topToolbar.value,
    hideHeaderAndFooter
  ]);

  const showBottomToolbar = React.useMemo(() => {
    let retVal = !hideHeaderAndFooter && showToolbars && showToolbarAtoms.bottomToolbar.value;
    retVal ||= showOverridingToolbarAtoms.bottomToolbar.value;
    return retVal;
  }, [
    showToolbars,
    showToolbarAtoms.bottomToolbar.value,
    showOverridingToolbarAtoms.bottomToolbar.value,
    hideHeaderAndFooter
  ]);

  const AppBarContents = React.useMemo(() => {
    let retVal: (() => React.ReactNode);

    if (showOverridingToolbarAtoms.appBar.value) {
      retVal = overridingAppBarContents.value.keyedMap.map[overridingToolbarContentKeys.appBar.value!]?.node ?? (() => null);
    } else if (!hideHeaderAndFooter && showToolbarAtoms.appBar.value) {
      retVal = appBarContents.value.keyedMap.map[toolbarContentKeys.appBar.value!]?.node ?? (() => null);
    } else {
      retVal = () => null;
    }

    return retVal;
  }, [
    overridingToolbarContentKeys.appBar.value,
    toolbarContentKeys.appBar.value,
    showToolbarAtoms.appBar.value,
    showOverridingToolbarAtoms.appBar.value,
    hideHeaderAndFooter
  ]);

  const TopToolbarContents = React.useMemo(() => {
    let retVal: (() => React.ReactNode);

    if (showOverridingToolbarAtoms.topToolbar.value) {
      retVal = overridingTopToolbarContents.value.keyedMap.map[overridingToolbarContentKeys.topToolbar.value!]?.node ?? (() => null);
    } else if (!hideHeaderAndFooter && showToolbars && showToolbarAtoms.topToolbar.value) {
      retVal = topToolbarContents.value.keyedMap.map[toolbarContentKeys.topToolbar.value!]?.node ?? (() => null);
    } else {
      retVal = () => null;
    }

    return retVal;
  }, [
    overridingToolbarContentKeys.topToolbar.value,
    toolbarContentKeys.topToolbar.value,
    showToolbarAtoms.topToolbar.value,
    showOverridingToolbarAtoms.topToolbar.value,
    hideHeaderAndFooter
  ]);

  const BottomToolbarContents = React.useMemo(() => {
    let retVal: (() => React.ReactNode);

    if (showOverridingToolbarAtoms.bottomToolbar.value) {
      retVal = overridingBottomToolbarContents.value.keyedMap.map[overridingToolbarContentKeys.bottomToolbar.value!]?.node ?? (() => null);
    } else if (!hideHeaderAndFooter && showToolbars && showToolbarAtoms.bottomToolbar.value) {
      retVal = bottomToolbarContents.value.keyedMap.map[toolbarContentKeys.bottomToolbar.value!]?.node ?? (() => null);
    } else {
      retVal = () => null;
    }

    return retVal;
  }, [
    overridingToolbarContentKeys.bottomToolbar.value,
    toolbarContentKeys.bottomToolbar.value,
    showToolbarAtoms.bottomToolbar.value,
    showOverridingToolbarAtoms.bottomToolbar.value,
    hideHeaderAndFooter
  ]);

  const currentModalsStack = React.useMemo(
    () => (currentModalStackKey ?? null) !== null ? defaultTrmrkAppModalService.value.stacks.keyedMap.map[currentModalStackKey!]?.node ?? null : null,
    [currentModalStackKey]);

  const openModalNode = React.useMemo(() => {
    return ((currentModalKey ?? null) !== null && (currentModalsStack ?? null) !== null) ? withValIf(
      currentModalsStack!.openModals.keyedMap.map[currentModalKey!],
      modal => modal.node(modal.nodeData!.props)) : null;
  }, [currentModalKey, currentModalsStack]);

  const openPopoverNode = React.useMemo(() => {
    return (((currentPopoverKey ?? null) !== null) ? withValIf(
      defaultTrmrkPopoverService.value.openPopovers.keyedMap.map[currentPopoverKey!],
      popover => popover.node(popover.nodeData!.props)) : null);
  }, [currentPopoverKey]);

  const openPopoverBackdropCssClass = React.useMemo(() => {
    return (((currentPopoverKey ?? null) !== null) ? withValIf(
      defaultTrmrkPopoverService.value.openPopovers.keyedMap.map[currentPopoverKey!],
      popover => popover.nodeData!.args.backdropCssClass ?? ""): null);
  }, [currentPopoverKey]);

  React.useEffect(() => {
    if (isDebugLoggingEnabled.value) {
      console.log("APP LAYOUT MOUNTED", layoutRenderIdRef.current++);
    }
  }, []);

  return (
    <div className={['trmrk-app-layout', cssClass ?? '', cssClassValue ?? ''].join(' ')}>


      { /* **** **** **** **** **** **** **** **** APP_BAR START **** **** **** **** **** **** **** **** */
        (showAppBar || showTopToolbar) && <div className="trmrk-app-header">
          { showAppBar && <TrmrkHorizStrip className="trmrk-app-bar"><AppBarContents /></TrmrkHorizStrip> }
          { showTopToolbar && <TrmrkHorizStrip className="trmrk-top-toolbar"><TopToolbarContents /></TrmrkHorizStrip> }
        </div>
      /* **** **** **** **** **** **** **** **** APP_BAR END **** **** **** **** **** **** **** **** */ }



      { /* **** **** **** **** **** **** **** **** BODY START **** **** **** **** **** **** **** **** */
        <div className="trmrk-app-body">
          {children}
        </div>
      /* **** **** **** **** **** **** **** **** BODY END **** **** **** **** **** **** **** **** */ }



      { /* **** **** **** **** **** **** **** **** FOOTER START **** **** **** **** **** **** **** **** */
        showBottomToolbar && <div className="trmrk-app-footer">
          <TrmrkHorizStrip className="trmrk-bottom-toolbar"><BottomToolbarContents /></TrmrkHorizStrip>
        </div>
      /* **** **** **** **** **** **** **** **** FOOTER END **** **** **** **** **** **** **** **** */ }



      { /* **** **** **** **** **** **** **** **** OVERLAPPING_CONTENTS START **** **** **** **** **** **** **** **** */
        <div className="trmrk-overlapping-contents">
          { ((appUserMessageAtoms.level.value ?? null) !== null) && <TrmrkMessagePopover
            show={appUserMessageAtoms.show.value}
            msgLevel={appUserMessageAtoms.level.value}
            autoCloseMillis={appUserMessageAtoms.autoCloseMillis.value}
            className={[appUserMessageAtoms.cssClass.value ?? "", "trmrk-app-user-message-popover-container"].join(' ')}>
              { appUserMessageAtoms.content.value }</TrmrkMessagePopover> }
          
          { ((currentModalKey ?? null) !== null) && <div className={[
              "trmrk-app-modal-backdrop",
              isClosingModals ? "trmrk-opac-fade-out" : "trmrk-opac-fade-in"].join(" ")}>
            { openModalNode }
            { ((currentModalUserMessage.show.value ?? null) !== null && (currentModalUserMessage.level.value ?? null) !== null) && <TrmrkMessagePopover
              show={currentModalUserMessage.show.value}
              msgLevel={currentModalUserMessage.level.value}
              autoCloseMillis={currentModalUserMessage.autoCloseMillis.value}
              className={[currentModalUserMessage.cssClass.value ?? "", "trmrk-current-modal-user-message-popover-container"].join(' ')}>
                { currentModalUserMessage.content.value?.() }</TrmrkMessagePopover> }
          </div> }

          { ((currentPopoverKey ?? null) !== null) && <div className={[
            "trmrk-popover-backdrop",
            isClosingPopovers ? "trmrk-opac-fade-out" : "trmrk-opac-fade-in",
            openPopoverBackdropCssClass
          ].join(" ")}>
            { openPopoverNode }
          </div> }
        </div>
      /* **** **** **** **** **** **** **** **** OVERLAPPING_CONTENTS END **** **** **** **** **** **** **** **** */ }


    </div>
  );
}
