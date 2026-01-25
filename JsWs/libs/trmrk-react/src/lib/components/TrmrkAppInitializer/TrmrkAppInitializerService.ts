import { atom } from "jotai";

export const appInitializerAtoms = {
  initStarted: atom(false),
  initEnded: atom(false),
  initIsOk: atom(false),
};
