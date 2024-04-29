import trmrk_lib from "../../../synced-libs/trmrk";

import {
  TextTransformBehaviorLib,
  getExportedMembers,
} from "../../../synced-libs/trmrk-text-transform-behavior/core";

import { getAllTextTransformers } from "../../main";

export const trmrk = trmrk_lib;

const turmerikObj: { turmerik: TextTransformBehaviorLib } =
  (globalThis as any).turmerikObj ?? {};

turmerikObj.turmerik = {
  libs: {
    // trmrk,
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
