import { useAtom } from "jotai";

import { withValIf } from "@/src/trmrk/core";

import "./TrmrkBasicAppLayout.scss";
import { CommponentProps } from "../defs/common";
import TrmrkHorizStrip from "../TrmrkHorizStrip/TrmrkHorizStrip";
import { bottomToolbarComponents, topToolbarComponents } from "./TrmrkBasicAppLayoutService";
import { appBarComponents } from "./TrmrkBasicAppLayoutService";
import { trmrkBasicAppLayoutAtoms } from "./TrmrkBasicAppLayoutService";
export interface TrmrkBasicAppLayoutProps extends CommponentProps {}

export default function TrmrkBasicAppLayout({children, cssClass}: Readonly<TrmrkBasicAppLayoutProps>) {
  const [showAppBarValue] = useAtom(trmrkBasicAppLayoutAtoms.showAppBar);
  const [showAppBarOnlyValue] = useAtom(trmrkBasicAppLayoutAtoms.showAppBarOnly);
  const [appBarComponentKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.appBarComponentKey);

  const [showTopToolbarValue] = useAtom(trmrkBasicAppLayoutAtoms.showTopToolbar);
  const [topToolbarComponentKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.topToolbarComponentKey);

  const [showBottomToolbarValue] = useAtom(trmrkBasicAppLayoutAtoms.showBottomToolbar);
  const [bottomToolbarComponentKeyValue] = useAtom(trmrkBasicAppLayoutAtoms.bottomToolbarComponentKey);

  console.log("topToolbarComponents.map[topToolbarComponentKeyValue!]", topToolbarComponents.map[topToolbarComponentKeyValue!]);

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
        {children}
      </div>
      { showBottomToolbarValue && !showAppBarOnlyValue && <div className="trmrk-app-footer">
          <TrmrkHorizStrip>{ withValIf(bottomToolbarComponents.map[bottomToolbarComponentKeyValue!], f => f()) }
          </TrmrkHorizStrip>
        </div>
      }
    </div>
  );
}
