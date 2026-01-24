import { atom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import { createIntKeyedComponentsMapManager } from "../../services/IntKeyedComponentsMapManager";

export const trmrk3PanelsAppLayoutAtoms = {
  showLeftPanel: atom(false),
  showLeftPanelLoader: atom(false),
  leftPanelComponentKey: atom<number | null>(null),
  showMainPanelLoader: atom(false),
  showRightPanel: atom(false),
  showRightPanelLoader: atom(false),
  rightPanelComponentKey: atom<number | null>(null),
};

export const leftPanelComponents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const rightPanelComponents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);
