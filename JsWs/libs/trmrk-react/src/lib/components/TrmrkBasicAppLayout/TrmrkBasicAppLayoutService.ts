import { atom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import { createIntKeyedComponentsMapManager } from "../../services/IntKeyedComponentsMapManager";

export const trmrkBasicAppLayoutAtoms = {
  cssClass: atom<string | null>(null),
  showAppBar: atom(false),
  showAppBarOnly: atom(false),
  appBarComponentKey: atom<number | null>(null),
  showTopToolbar: atom(false),
  topToolbarComponentKey: atom<number | null>(null),
  showBottomToolbar: atom(false),
  bottomToolbarComponentKey: atom<number | null>(null),
};

export const appBarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const topToolbarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const bottomToolbarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const appOverlappingContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);
