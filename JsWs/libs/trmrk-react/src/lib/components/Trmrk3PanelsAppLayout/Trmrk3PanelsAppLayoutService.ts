import { atom, useAtom } from "jotai";

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
  allowShowLeftPanel: atom(false),
  showLeftPanelLoader: atom(false),
  leftPanelContentsKey: atom<number | null>(null),
  allowToggleLeftPanel: atom(true),
  showMiddlePanel: atom(true),
  allowShowMiddlePanel: atom(true),
  showMiddlePanelLoader: atom(false),
  middlePanelContentsKey: atom<number | null>(null),
  allowToggleMiddlePanel: atom(true),
  showRightPanel: atom(false),
  allowShowRightPanel: atom(false),
  showRightPanelLoader: atom(false),
  rightPanelContentsKey: atom<number | null>(null),
  allowToggleRightPanel: atom(true),
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
