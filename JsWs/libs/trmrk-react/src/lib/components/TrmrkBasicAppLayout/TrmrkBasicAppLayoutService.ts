import { atom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import { ComponentsMap } from "../defs/common";
import { createIntKeyedComponentsMapManager } from "../../services/IntKeyedComponentsMapManager";

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

export const appOverlappingContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);
