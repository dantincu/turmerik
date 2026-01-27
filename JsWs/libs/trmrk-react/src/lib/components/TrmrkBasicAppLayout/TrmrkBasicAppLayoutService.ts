import { atom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import { createIntKeyedComponentsMapManager } from "../../services/IntKeyedComponentsMapManager";

export const trmrkBasicAppLayoutAtoms = {
  cssClass: atom<string | null>(null),
  showAppBar: atom(true),
  showAppBarOnly: atom(false),
  appBarContentsKey: atom<number | null>(null),
  showTopToolbar: atom(true),
  topToolbarContentsKey: atom<number | null>(null),
  showBottomToolbar: atom(false),
  bottomToolbarContentsKey: atom<number | null>(null),
  showToolbars: atom(true),
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
