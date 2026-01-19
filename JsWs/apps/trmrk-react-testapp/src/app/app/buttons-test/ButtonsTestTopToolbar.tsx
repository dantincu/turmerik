import { Icon } from "@iconify/react";

import { getVarName } from "@/src/trmrk/Reflection/core";
import TrmrkBtn from "@/src/trmrk-react/components/TrmrkBtn/TrmrkBtn";

export const ButtonsTestTopToolbarTypeName = getVarName(() => ButtonsTestTopToolbar);

export default function ButtonsTestTopToolbar() {
  return <><TrmrkBtn borderWidth={1}><div className="trmrk-icon-wrapper"><Icon icon="mdi-light:home" /></div></TrmrkBtn></>;
}
