import { atom, useAtom, PrimitiveAtom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import { TrmrkUseAtom, trmrkUseAtom } from "../../services/jotai/core";
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

const createPanelAtoms = (): TrmrkPanelAtoms => ({
  show: atom(false),
  allowShow: atom(false),
  showLoader: atom(false),
  contentsKey: atom<number | null>(null),
});

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

export interface PanelAtoms<Value> {
  leftPanel: TrmrkUseAtom<Value>;
  middlePanel: TrmrkUseAtom<Value>;
  rightPanel: TrmrkUseAtom<Value>;
}

export const useShowPanelAtoms = (): PanelAtoms<boolean> => ({
  leftPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.show),
  middlePanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.show),
  rightPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.show),
});

export const useAllowShowPanelAtoms = (): PanelAtoms<boolean> => ({
  leftPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.allowShow),
  middlePanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.allowShow),
  rightPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.allowShow),
});

export const useShowPanelLoaderAtoms = (): PanelAtoms<boolean> => ({
  leftPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.showLoader),
  middlePanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.showLoader),
  rightPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.showLoader),
});

export const useContentsKeyPanelAtoms = (): PanelAtoms<number | null> => ({
  leftPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.contentsKey),
  middlePanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.contentsKey),
  rightPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.contentsKey),
});
