"use client";

import { useAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";

import "./TrmrkAppLayout.scss";

import TrmrkHorizStrip from '../TrmrkHorizStrip/TrmrkHorizStrip';
import { CommponentProps } from "../defs/Common";

import {
  TrmrkAppLayoutComponentsMap,
  appBarComponentKey,
  bottomToolbarComponentKey,
  showAppBarOnly,
  leftPanelComponentKey,
  leftPanelComponents,
  rightPanelComponentKey,
  rightPanelComponents,
  showAppBar,
  showBottomToolbar,
  showLeftPanel,
  showRightPanel,
  showTopToolbar,
  topToolbarComponentKey,
  appBarComponents,
  bottomToolbarComponents,
  topToolbarComponents
} from "./TrmrkAppLayoutService";

export interface TrmrkAppLayoutProps extends CommponentProps {}

export default function TrmrkAppLayout({children, cssClass}: Readonly<TrmrkAppLayoutProps>) {
  const [showAppBarValue] = useAtom(showAppBar);
  const [showAppBarOnlyValue] = useAtom(showAppBarOnly);
  const [appBarComponentKeyValue] = useAtom(appBarComponentKey);

  const [showTopToolbarValue] = useAtom(showTopToolbar);
  const [topToolbarComponentKeyValue] = useAtom(topToolbarComponentKey);

  const [showBottomToolbarValue] = useAtom(showBottomToolbar);
  const [bottomToolbarComponentKeyValue] = useAtom(bottomToolbarComponentKey);

  const [showLeftPanelValue] = useAtom(showLeftPanel);
  const [leftPanelComponentKeyValue] = useAtom(leftPanelComponentKey);

  const [showRightPanelValue] = useAtom(showRightPanel);
  const [rightPanelComponentKeyValue] = useAtom(rightPanelComponentKey);

  return (
    <div className={['trmrk-app-layout', cssClass ?? ''].join(' ')}>
      <div className="trmrk-app-header">
        {showAppBarValue && <TrmrkHorizStrip>{ appBarComponents.map[appBarComponentKeyValue!] }</TrmrkHorizStrip>}
        {showTopToolbarValue && !showAppBarOnlyValue && <TrmrkHorizStrip>{ topToolbarComponents.map[topToolbarComponentKeyValue!] }</TrmrkHorizStrip>}
      </div>
      <div className="trmrk-app-body">
        <div className={[ "trmrk-split-container", showLeftPanelValue ? "trmrk-has-both-panels" : "" ].join(' ')}>
          { showLeftPanelValue && <div className="trmrk-split-panel1">
            { leftPanelComponents.map[leftPanelComponentKeyValue!] }
          </div>
          }
          <div className="trmrk-split-panel2">
            <div className={[ "trmrk-split-container", showRightPanelValue ? "trmrk-has-both-panels" : "" ].join(' ')}>
              <div className="trmrk-split-panel1">{children}</div>
              { showRightPanelValue && <div className="trmrk-split-panel2">
                  { rightPanelComponents.map[rightPanelComponentKeyValue!] }
                </div>
              }
            </div>
          </div>
        </div>
      </div>
      { showBottomToolbarValue && !showAppBarOnlyValue && <div className="trmrk-app-footer">
          <TrmrkHorizStrip>{ bottomToolbarComponents.map[bottomToolbarComponentKeyValue!] }
          </TrmrkHorizStrip>
        </div>
      }
    </div>
  );
}
