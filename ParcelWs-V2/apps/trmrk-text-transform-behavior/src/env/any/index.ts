import trmrk_lib from "trmrk";

import { TextTransformBehaviorLib, getExportedMembers } from "../../core";
import { getAllTextTransformers } from "../../main";

export const trmrk = trmrk_lib;

const turmerikObj: { turmerik: TextTransformBehaviorLib } =
  (globalThis as any).turmerikObj ?? {};

turmerikObj.turmerik = {
  libs: {
    trmrk,
  },
  behavior: {
    TextTransformers: getAllTextTransformers(),
  },
  exportedMembers: {
    TextTransformers: [],
  },
  getExportedMembers: () => turmerik.exportedMembers,
};

turmerikObj.turmerik.exportedMembers = getExportedMembers(
  "turmerik.behavior",
  turmerikObj.turmerik.behavior
);

export const turmerik = turmerikObj.turmerik;
