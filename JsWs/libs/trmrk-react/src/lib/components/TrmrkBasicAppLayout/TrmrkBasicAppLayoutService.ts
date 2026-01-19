import { atom } from "jotai";

import { ComponentsMap } from "../defs/common";

export const trmrkBasicAppLayoutAtoms = {
  showAppBar: atom(false),
  showAppBarOnly: atom(false),
  appBarComponentKey: atom<string | null>(null),
  showTopToolbar: atom(false),
  topToolbarComponentKey: atom<string | null>(null),
  showBottomToolbar: atom(false),
  bottomToolbarComponentKey: atom<string | null>(null),
};

export const appBarComponents: ComponentsMap = {
  map: {},
};

export const topToolbarComponents: ComponentsMap = {
  map: {},
};

export const bottomToolbarComponents: ComponentsMap = {
  map: {},
};
