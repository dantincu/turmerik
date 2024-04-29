import trmrk_lib from "../../../synced-libs/trmrk";

import { getExportedMembers } from "../../core";
import * as trmrk_text_transform_behavior from "../../main";

export const trmrk = trmrk_lib;
export const trmrkTextTransformBehavior = {
  ...trmrk_text_transform_behavior,
  getExportedMembers,
};
