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
  const [appBarComponentKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.appBarComponentKey);

  const [showTopToolbarValue] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [topToolbarComponentKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarComponentKey);

  const [showBottomToolbarValue] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [bottomToolbarComponentKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarComponentKey);

  return (
    <div className={['trmrk-app-layout', cssClass ?? '', cssClassValue ?? ''].join(' ')}>
      <div className="trmrk-app-header">
        {showAppBarValue && <TrmrkHorizStrip>
            { withValIf(appBarContents.value.keyedMap.map[appBarComponentKeyValue!], f => f.component()) }
          </TrmrkHorizStrip>}
        {showTopToolbarValue && !showAppBarOnlyValue && <TrmrkHorizStrip>
            { withValIf(topToolbarContents.value.keyedMap.map[topToolbarComponentKeyValue!], f => f.component()) }
          </TrmrkHorizStrip>}
      </div>
      <div className="trmrk-app-body">
        {children}
      </div>
      { showBottomToolbarValue && !showAppBarOnlyValue && <div className="trmrk-app-footer">
          <TrmrkHorizStrip>{ withValIf(bottomToolbarContents.value.keyedMap.map[bottomToolbarComponentKeyValue!], f => f.component()) }
          </TrmrkHorizStrip>
        </div>
      }
      <div className="trmrk-overlapping-contents">
        { overlappingContentKeys.map(key => <React.Fragment key={key}>
          { appOverlappingContents.value.keyedMap.map[key].component() }
        </React.Fragment>) }
      </div>
    </div>
  );
}
