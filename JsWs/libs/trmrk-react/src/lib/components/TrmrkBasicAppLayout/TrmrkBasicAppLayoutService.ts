import { atom, useAtom, PrimitiveAtom } from "jotai";

import { RefLazyValue } from "@/src/trmrk/core";

import { trmrkUseAtom, TrmrkUseAtom } from "../../services/jotai/core";
import { createIntKeyedComponentsMapManager } from "../../services/IntKeyedComponentsMapManager";

export interface TrmrkToolbarAtoms {
  show: PrimitiveAtom<boolean>;
  contentsKey: PrimitiveAtom<number | null>;
  overridingContentsKey: PrimitiveAtom<number | null>;
}

const createToolbarAtoms = (show: boolean): TrmrkToolbarAtoms => ({
  show: atom(show),
  contentsKey: atom<number | null>(null),
  overridingContentsKey: atom<number | null>(null),
});

export const trmrkBasicAppLayoutAtoms = {
  cssClass: atom<string | null>(null),
  showToolbars: atom(true),
  appBar: createToolbarAtoms(true),
  topToolbar: createToolbarAtoms(true),
  bottomToolbar: createToolbarAtoms(false),
};

export const appBarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const overridingAppBarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const topToolbarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const overridingTopToolbarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const bottomToolbarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const overridingBottomToolbarContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const appOverlappingContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export interface ToolbarAtoms<Value> {
  appBar: TrmrkUseAtom<Value>;
  topToolbar: TrmrkUseAtom<Value>;
  bottomToolbar: TrmrkUseAtom<Value>;
}

export const useShowToolbars = (): ToolbarAtoms<boolean> => ({
  appBar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appBar.show),
  topToolbar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.topToolbar.show),
  bottomToolbar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.bottomToolbar.show),
});

export const useToolbarContentKeys = (): ToolbarAtoms<number | null> => ({
  appBar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appBar.contentsKey),
  topToolbar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.topToolbar.contentsKey),
  bottomToolbar: trmrkUseAtom(
    trmrkBasicAppLayoutAtoms.bottomToolbar.contentsKey,
  ),
});

export const useToolbarOverridingContentKeys = (): ToolbarAtoms<
  number | null
> => ({
  appBar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appBar.overridingContentsKey),
  topToolbar: trmrkUseAtom(
    trmrkBasicAppLayoutAtoms.topToolbar.overridingContentsKey,
  ),
  bottomToolbar: trmrkUseAtom(
    trmrkBasicAppLayoutAtoms.bottomToolbar.overridingContentsKey,
  ),
});
