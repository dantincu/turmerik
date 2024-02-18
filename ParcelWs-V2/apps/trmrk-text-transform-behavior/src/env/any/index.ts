import trmrk_lib from "trmrk";

import { TextTransformBehaviorLib, getExportedMembers } from "./core";
import { getAllTransformers } from "./main";

export const trmrk = trmrk_lib;

declare const turmerikObj: { turmerik: TextTransformBehaviorLib };

turmerikObj.turmerik = {
  libs: {
    trmrk,
  },
  behavior: {
    Transformers: getAllTransformers(),
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
