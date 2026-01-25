import { atom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import { createIntKeyedComponentsMapManager } from "../../services/IntKeyedComponentsMapManager";

export enum TrmrkAppLayoutPanel {
  None = 0,
  Left,
  Middle,
  Right,
}

export const trmrk3PanelsAppLayoutAtoms = {
  showLeftPanel: atom(false),
  showLeftPanelLoader: atom(false),
  leftPanelContentsKey: atom<number | null>(null),
  allowToggleLeftPanel: atom(false),
  showMiddlePanel: atom(true),
  showMiddlePanelLoader: atom(false),
  middlePanelContentsKey: atom<number | null>(null),
  allowToggleMiddlePanel: atom(false),
  showRightPanel: atom(false),
  showRightPanelLoader: atom(false),
  rightPanelContentsKey: atom<number | null>(null),
  allowToggleRightPanel: atom(false),
  focusedPanel: atom(TrmrkAppLayoutPanel.Middle),
  isSinglePanelMode: atom(true),
  allowsMultiPanelMode: atom(true),
};

export const leftPanelContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const middlePanelContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const rightPanelContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);
