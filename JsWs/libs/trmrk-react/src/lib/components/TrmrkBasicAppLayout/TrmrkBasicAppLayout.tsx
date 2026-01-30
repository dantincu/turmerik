import React from "react";
import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./TrmrkBasicAppLayout.scss";

import { ComponentProps } from "../defs/common";
import TrmrkHorizStrip from "../TrmrkHorizStrip/TrmrkHorizStrip";
import { bottomToolbarContents, topToolbarContents, useShowToolbars, useToolbarContentKeys } from "./TrmrkBasicAppLayoutService";
import { appBarContents } from "./TrmrkBasicAppLayoutService";
import { trmrkBasicAppLayoutAtoms, appOverlappingContents } from "./TrmrkBasicAppLayoutService";

export interface TrmrkBasicAppLayoutProps extends ComponentProps {}

export default function TrmrkBasicAppLayout({children, className: cssClass}: Readonly<TrmrkBasicAppLayoutProps>) {
  const [ overlappingContentKeys ] = useAtom(appOverlappingContents.value.currentKeysAtom);
  const [cssClassValue] = useAtom(trmrkBasicAppLayoutAtoms.cssClass);
  const [showAppBarOnly] = useAtom(trmrkBasicAppLayoutAtoms.showAppBarOnly);
  const [showToolbars] = useAtom(trmrkBasicAppLayoutAtoms.showToolbars);

  const showToolbarAtoms = useShowToolbars();
  const toolbarContentKeys = useToolbarContentKeys();

  return (
    <div className={['trmrk-app-layout', cssClass ?? '', cssClassValue ?? ''].join(' ')}>
      { (showToolbarAtoms.appBar.value || (showToolbars && showToolbarAtoms.topToolbar.value)) && <div className="trmrk-app-header">
        {showToolbarAtoms.appBar.value && <TrmrkHorizStrip className="trmrk-app-bar">
            { toolbarContentKeys.appBar.value && appBarContents.value.keyedMap.map[toolbarContentKeys.appBar.value]?.node }
          </TrmrkHorizStrip>}
        {showToolbars && showToolbarAtoms.topToolbar.value && !showAppBarOnly && <TrmrkHorizStrip className="trmrk-top-toolbar">
            { toolbarContentKeys.topToolbar.value && withValIf(
              topToolbarContents.value.keyedMap.map[toolbarContentKeys.topToolbar.value], f => f.node) }
          </TrmrkHorizStrip>}
      </div> }
      <div className="trmrk-app-body">
        {children}
      </div>
      { showToolbars && showToolbarAtoms.bottomToolbar.value && !showAppBarOnly && <div className="trmrk-app-footer">
          <TrmrkHorizStrip>{ toolbarContentKeys.bottomToolbar.value && bottomToolbarContents.value.keyedMap.map[toolbarContentKeys.bottomToolbar.value]?.node }
          </TrmrkHorizStrip>
        </div>
      }
      <div className="trmrk-overlapping-contents">
        { overlappingContentKeys.map(key => <React.Fragment key={key}>
          { appOverlappingContents.value.keyedMap.map[key].node }
        </React.Fragment>) }
      </div>
    </div>
  );
}
