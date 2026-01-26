import React from "react";
import { useAtom } from "jotai";

import { NullOrUndef } from "@/src/trmrk/core";
import "./TrmrkAppBarContents.scss";
import { ComponentProps } from "../defs/common";
import TrmrkBtn from "../TrmrkBtn/TrmrkBtn";
import TrmrkIcon from "../TrmrkIcon/TrmrkIcon";
import { trmrkBasicAppLayoutAtoms } from "../TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

export interface TrmrkAppBarContentsProps extends ComponentProps {
  leadingChildren?: (() => React.ReactNode) | NullOrUndef
}

export default function TrmrkAppBarContents({ children, leadingChildren }: TrmrkAppBarContentsProps) {
  const [ showToolbars, setShowToolbars ] = useAtom(trmrkBasicAppLayoutAtoms.showToolbars);

  const toggleToolbarsClicked = React.useCallback(() => {
    setShowToolbars(!showToolbars);
  }, [showToolbars]);

  const LeadingChildren = React.useMemo(() => leadingChildren ?? (() => null), [leadingChildren]);

  return <><LeadingChildren></LeadingChildren><div className="text-center grow">{children}</div>
      <TrmrkBtn onClick={toggleToolbarsClicked} className="trmrk-btn-filled-system mr-[2px]">
        <TrmrkIcon icon={ `mdi:chevron-double-${showToolbars ? 'up' : 'down'}` }></TrmrkIcon>
      </TrmrkBtn></>;
}
