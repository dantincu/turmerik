"use client";

import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./TrmrkAppLayout.scss";

import TrmrkHorizStrip from '../TrmrkHorizStrip/TrmrkHorizStrip';
import { CommponentProps } from "../defs/common";

import {
  appLayoutAtoms,
  leftPanelComponents,
  rightPanelComponents,
  appBarComponents,
  bottomToolbarComponents,
  topToolbarComponents
} from "./TrmrkAppLayoutService";

export interface TrmrkAppLayoutProps extends CommponentProps {}

export default function TrmrkAppLayout({children, cssClass}: Readonly<TrmrkAppLayoutProps>) {
  const [showAppBarValue] = useAtom(appLayoutAtoms.showAppBar);
  const [showAppBarOnlyValue] = useAtom(appLayoutAtoms.showAppBarOnly);
  const [appBarComponentKeyValue] = useAtom(appLayoutAtoms.appBarComponentKey);

  const [showTopToolbarValue] = useAtom(appLayoutAtoms.showTopToolbar);
  const [topToolbarComponentKeyValue] = useAtom(appLayoutAtoms.topToolbarComponentKey);

  const [showBottomToolbarValue] = useAtom(appLayoutAtoms.showBottomToolbar);
  const [bottomToolbarComponentKeyValue] = useAtom(appLayoutAtoms.bottomToolbarComponentKey);

  const [showLeftPanelValue] = useAtom(appLayoutAtoms.showLeftPanel);
  const [leftPanelComponentKeyValue] = useAtom(appLayoutAtoms.leftPanelComponentKey);
  const [showRightPanelValue] = useAtom(appLayoutAtoms.showRightPanel);
  const [rightPanelComponentKeyValue] = useAtom(appLayoutAtoms.rightPanelComponentKey);

  return (
    <div className={['trmrk-app-layout', cssClass ?? ''].join(' ')}>
      <div className="trmrk-app-header">
        {showAppBarValue && <TrmrkHorizStrip>
            { withValIf(appBarComponents.map[appBarComponentKeyValue!], f => f()) }
          </TrmrkHorizStrip>}
        {showTopToolbarValue && !showAppBarOnlyValue && <TrmrkHorizStrip>
            { withValIf(topToolbarComponents.map[topToolbarComponentKeyValue!], f => f()) }
          </TrmrkHorizStrip>}
      </div>
      <div className="trmrk-app-body">
        <div className={[ "trmrk-split-container", showLeftPanelValue ? "trmrk-has-both-panels" : "" ].join(' ')}>
          { showLeftPanelValue && <div className="trmrk-split-panel1">
            { withValIf(leftPanelComponents.map[leftPanelComponentKeyValue!], f => f()) }
          </div>
          }
          <div className="trmrk-split-panel2">
            <div className={[ "trmrk-split-container", showRightPanelValue ? "trmrk-has-both-panels" : "" ].join(' ')}>
              <div className="trmrk-split-panel1">{children}</div>
              { showRightPanelValue && <div className="trmrk-split-panel2">
                  { withValIf(rightPanelComponents.map[rightPanelComponentKeyValue!], f => f()) }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      { showBottomToolbarValue && !showAppBarOnlyValue && <div className="trmrk-app-footer">
          <TrmrkHorizStrip>{ withValIf(bottomToolbarComponents.map[bottomToolbarComponentKeyValue!], f => f()) }
          </TrmrkHorizStrip>
        </div>
      }
    </div>
  );
}
