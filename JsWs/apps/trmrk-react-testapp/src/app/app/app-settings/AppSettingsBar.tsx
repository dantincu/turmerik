import { getVarName } from "@/src/trmrk/Reflection/core";

export const AppSettingsBarTypeName = getVarName(() => AppSettingsBar);

export default function AppSettingsBar() {
  return <h1 className="text-center grow">App Settings</h1>;
}
