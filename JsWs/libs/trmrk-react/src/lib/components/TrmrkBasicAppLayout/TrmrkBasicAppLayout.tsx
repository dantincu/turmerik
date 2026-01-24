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
  const [showAppBarValue] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [showAppBarOnlyValue] = useAtom(trmrkBasicAppLayoutAtoms.showAppBarOnly);
  const [appBarContentsKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.appBarContentsKey);

  const [showTopToolbarValue] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [topToolbarContentsKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarContentsKey);

  const [showBottomToolbarValue] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [bottomToolbarContentsKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarContentsKey);

  return (
    <div className={['trmrk-app-layout', cssClass ?? '', cssClassValue ?? ''].join(' ')}>
      <div className="trmrk-app-header">
        {showAppBarValue && <TrmrkHorizStrip>
            { appBarContentsKeyValue && withValIf(
              appBarContents.value.keyedMap.map[appBarContentsKeyValue], f => f.node()) }
          </TrmrkHorizStrip>}
        {showTopToolbarValue && !showAppBarOnlyValue && <TrmrkHorizStrip>
            { topToolbarContentsKeyValue && withValIf(
              topToolbarContents.value.keyedMap.map[topToolbarContentsKeyValue], f => f.node()) }
          </TrmrkHorizStrip>}
      </div>
      <div className="trmrk-app-body">
        {children}
      </div>
      { showBottomToolbarValue && !showAppBarOnlyValue && <div className="trmrk-app-footer">
          <TrmrkHorizStrip>{ bottomToolbarContentsKeyValue && withValIf(
            bottomToolbarContents.value.keyedMap.map[bottomToolbarContentsKeyValue], f => f.node()) }
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
