import { atom, PrimitiveAtom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import TrmrkAppModal, {
  TrmrkAppModalProps,
} from "../TrmrkAppModal/TrmrkAppModal";

export interface TrmrkAppModalArgs {
  props: () => TrmrkAppModalProps;
}

export class TrmrkAppModalService {}

export const defaultTrmrkAppModalService = new RefLazyValue(
  () => new TrmrkAppModalService(),
);

console.log("TrmrkAppModal", TrmrkAppModal);
