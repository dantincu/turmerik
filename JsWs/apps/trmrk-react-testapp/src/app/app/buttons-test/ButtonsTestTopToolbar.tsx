import { Icon } from "@iconify/react";

import { getVarName } from "@/src/trmrk/Reflection/core";
import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";
import TrmrkLongPressable from "@/src/trmrk-react/components/TrmrkLongPressable/TrmrkLongPressable";

export const ButtonsTestTopToolbarTypeName = getVarName(() => ButtonsTestTopToolbar);

export default function ButtonsTestTopToolbar() {
  return <><TrmrkLongPressable hoc={{
      component: (hoc) => (props) => <TrmrkBtn borderWidth={1} {...props} hoc={hoc}><div className="trmrk-icon-wrapper"><Icon icon="mdi:home" /></div></TrmrkBtn>
    }}
    args={hostElem => {
    return ({
      hostElem,
      longPressOrRightClick: (e) => console.log("longPressOrRightClick", e),
      shortPressOrLeftClick: (e) => console.log("shortPressOrLeftClick", e)
    });
  }}></TrmrkLongPressable></>;
}
