import React from "react";
import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./TrmrkBasicAppLayout.scss";

import { ComponentProps } from "../defs/common";
import TrmrkHorizStrip from "../TrmrkHorizStrip/TrmrkHorizStrip";
import { bottomToolbarContents, topToolbarContents } from "./TrmrkBasicAppLayoutService";
import { appBarContents } from "./TrmrkBasicAppLayoutService";
import { trmrkBasicAppLayoutAtoms, appOverlappingContents } from "./TrmrkBasicAppLayoutService";

export interface TrmrkBasicAppLayoutProps extends ComponentProps {}

export default function TrmrkBasicAppLayout({children, cssClass}: Readonly<TrmrkBasicAppLayoutProps>) {
  const [ overlappingContentKeys ] = useAtom(appOverlappingContents.value.currentKeysAtom);

  const [cssClassValue] = useAtom(trmrkBasicAppLayoutAtoms.cssClass);
  const [showAppBar] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [showAppBarOnly] = useAtom(trmrkBasicAppLayoutAtoms.showAppBarOnly);
  const [appBarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.appBarContentsKey);

  const [showTopToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [topToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarContentsKey);

  const [showBottomToolbar] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [bottomToolbarContentsKey] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarContentsKey);
  const [showToolbars] = useAtom(trmrkBasicAppLayoutAtoms.showToolbars);

  return (
    <div className={['trmrk-app-layout', cssClass ?? '', cssClassValue ?? ''].join(' ')}>
      { (showAppBar || (showToolbars && showTopToolbar)) && <div className="trmrk-app-header">
        {showAppBar && <TrmrkHorizStrip>
            { appBarContentsKey && withValIf(
              appBarContents.value.keyedMap.map[appBarContentsKey], f => f.node()) }
          </TrmrkHorizStrip>}
        {showToolbars && showTopToolbar && !showAppBarOnly && <TrmrkHorizStrip>
            { topToolbarContentsKey && withValIf(
              topToolbarContents.value.keyedMap.map[topToolbarContentsKey], f => f.node()) }
          </TrmrkHorizStrip>}
      </div> }
      <div className="trmrk-app-body">
        {children}
      </div>
      { showToolbars && showBottomToolbar && !showAppBarOnly && <div className="trmrk-app-footer">
          <TrmrkHorizStrip>{ bottomToolbarContentsKey && withValIf(
            bottomToolbarContents.value.keyedMap.map[bottomToolbarContentsKey], f => f.node()) }
          </TrmrkHorizStrip>
        </div>
      }
      <div className="trmrk-overlapping-contents">
        { overlappingContentKeys.map(key => <React.Fragment key={key}>
          { appOverlappingContents.value.keyedMap.map[key].node() }
        </React.Fragment>) }
      </div>
    </div>
  );
}
