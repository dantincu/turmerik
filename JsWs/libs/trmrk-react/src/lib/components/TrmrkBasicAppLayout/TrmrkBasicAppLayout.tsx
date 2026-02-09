import React from "react";
import { useAtom } from "jotai";

import "./TrmrkBasicAppLayout.scss";

import { ComponentProps } from "../defs/common";
import TrmrkHorizStrip from "../TrmrkHorizStrip/TrmrkHorizStrip";

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
              
          <div className="trmrk-app-modal-backdrop trmrk-fade-in">
            <div className="trmrk-app-modal-container">
              <div className="trmrk-app-modal-header">
                <div className="trmrk-horiz-strip trmrk-app-modal-top-bar">
                  <div className="trmrk-leading-content flex">
                    <TrmrkBtn className="trmrk-btn-filled-system" onClick={() => {}}>
                      <TrmrkIcon icon="mdi:chevron-double-up"></TrmrkIcon>
                    </TrmrkBtn>
                  </div>
                  <div className="trmrk-content flex grow content-center ml-[2px]">
                    <h2 className="text-center flex grow items-center justify-center">asdfasdf</h2>
                  </div>
                  <div className="trmrk-trailing-content flex mr-[2px]">
                    <TrmrkBtn className="trmrk-btn-filled-system" onClick={() => {}}>
                      <TrmrkIcon icon="mdi:minimize"></TrmrkIcon>
                    </TrmrkBtn>
                    <TrmrkBtn className="trmrk-btn-filled-system" onClick={() => {}}>
                      <TrmrkIcon icon="mdi:close"></TrmrkIcon>
                    </TrmrkBtn>
                  </div>
                </div>
                <div className="trmrk-horiz-strip trmrk-app-modal-top-toolbar"></div>
              </div>
              <div className="trmrk-app-modal-content">
              asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
              asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
              asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
              asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
              asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
              asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
              asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
              asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdfasdasdfasdf
              asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf asdasdfasdf
              </div>
              <div className="trmrk-app-modal-footer">
                <div className="trmrk-horiz-strip trmrk-app-modal-bottom-bar"></div>
              </div>
            </div>
          </div>
        </div>
      /* **** **** **** **** **** **** **** **** OVERLAPPING_CONTENTS END **** **** **** **** **** **** **** **** */ }


    </div>
  );
}
