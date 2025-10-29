import { MkScriptsJsWsSyncBehaviorData } from "../../core";
import { getJsWsSyncProfile } from "../../main";

const turmerikObj: { turmerik: MkScriptsJsWsSyncBehaviorData } =
  (globalThis as any).turmerikObj ?? {};

turmerikObj.turmerik = {
  behavior: {
    Profile: getJsWsSyncProfile(),
  },
  getExportedMembers: () => turmerik.behavior.Profile,
};

export const turmerik = turmerikObj.turmerik;
