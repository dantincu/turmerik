import { MkScriptsParcelWsSyncBehaviorData } from "../../core";
import { getParcelWsSyncProfile } from "../../main";

const turmerikObj: { turmerik: MkScriptsParcelWsSyncBehaviorData } =
  (globalThis as any).turmerikObj ?? {};

turmerikObj.turmerik = {
  behavior: {
    Profile: getParcelWsSyncProfile(),
  },
  getExportedMembers: () => turmerik.behavior.Profile,
};

export const turmerik = turmerikObj.turmerik;
