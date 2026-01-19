import { getVarName } from "@/src/trmrk/Reflection/core";

export const ButtonsTestAppBarTypeName = getVarName(() => ButtonsTestAppBar);

export default function ButtonsTestAppBar() {
  return <h1 className="text-center grow">Buttons Test</h1>;
}
