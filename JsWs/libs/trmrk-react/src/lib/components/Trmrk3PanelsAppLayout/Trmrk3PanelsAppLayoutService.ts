import { atom, useAtom, PrimitiveAtom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import { createIntKeyedComponentsMapManager } from "../../services/IntKeyedComponentsMapManager";

export enum TrmrkAppLayoutPanel {
  None = 0,
  Left,
  Middle,
  Right,
}

export interface TrmrkPanelAtoms {
  show: PrimitiveAtom<boolean>;
  allowShow: PrimitiveAtom<boolean>;
  showLoader: PrimitiveAtom<boolean>;
  contentsKey: PrimitiveAtom<number | null>;
}

const createPanelAtoms = () =>
  ({
    show: atom(false),
    allowShow: atom(false),
    showLoader: atom(false),
    contentsKey: atom(null),
  }) as TrmrkPanelAtoms;

export const trmrk3PanelsAppLayoutAtoms = {
  leftPanel: createPanelAtoms(),
  middlePanel: createPanelAtoms(),
  rightPanel: createPanelAtoms(),
  focusedPanel: atom(TrmrkAppLayoutPanel.Middle),
  isMultiPanelMode: atom(false),
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
