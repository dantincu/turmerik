import trmrk_lib from "trmrk";

import { TextTransformBehaviorLib, getExportedMembers } from "./core";

export const trmrk = trmrk_lib;

declare const turmerikObj: { turmerik: TextTransformBehaviorLib };

turmerikObj.turmerik = {
  libs: {
    trmrk,
  },
  behavior: {
    Transformers: [],
  },
  exportedMembers: {
    Transformers: [],
  },
  getExportedMembers: () => turmerik.exportedMembers,
};

turmerikObj.turmerik.exportedMembers = getExportedMembers(
  "turmerik.behavior",
  turmerikObj.turmerik.behavior
);

export const turmerik = turmerikObj.turmerik;
