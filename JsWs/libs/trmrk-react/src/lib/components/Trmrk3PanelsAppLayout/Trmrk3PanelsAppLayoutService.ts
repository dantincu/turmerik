import { atom } from "jotai";

import { ComponentsMap } from "../defs/common";

export const trmrk3PanelsAppLayoutAtoms = {
  showLeftPanel: atom(false),
  showLeftPanelLoader: atom(false),
  leftPanelComponentKey: atom<string | null>(null),
  showMainPanelLoader: atom(false),
  showRightPanel: atom(false),
  showRightPanelLoader: atom(false),
  rightPanelComponentKey: atom<string | null>(null),
};

export const leftPanelComponents: ComponentsMap = {
  map: {},
};

export const rightPanelComponents: ComponentsMap = {
  map: {},
};
