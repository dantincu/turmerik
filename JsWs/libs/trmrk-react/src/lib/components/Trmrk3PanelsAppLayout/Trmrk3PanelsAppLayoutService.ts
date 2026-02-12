import { atom, Atom, PrimitiveAtom } from "jotai";

import {
  NullOrUndef,
  RefLazyValue,
  UserMessageLevel,
  actWithValIf,
} from "@/src/trmrk/core";

import {
  TrmrkUseAtom,
  trmrkUseAtom,
  UseSetAtom,
} from "../../services/jotai/core";

import { createIntKeyedComponentsMapManager } from "../../services/IntKeyedComponentsMapManager";

import {
  appBarContents,
  bottomToolbarContents,
  topToolbarContents,
  ToolbarAtoms,
  overridingAppBarContents,
  overridingBottomToolbarContents,
  overridingTopToolbarContents,
  InitLayoutPartArgs,
  initLayoutPart,
  InitBasicAppLayoutArgs,
  InitBasicAppLayoutResult,
  initBasicAppLayout,
  cleanupBasicAppLayout,
} from "../TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

export enum TrmrkAppLayoutPanel {
  None = 0,
  Left,
  Middle,
  Right,
}

export interface TrmrkPanelAtoms {
  panel: TrmrkAppLayoutPanel;
  show: PrimitiveAtom<boolean>;
  allowShow: PrimitiveAtom<boolean>;
  render: Atom<boolean>;
  showLoader: PrimitiveAtom<boolean>;
  contentsKey: PrimitiveAtom<number | null>;
}

const createPanelAtoms = (panel: TrmrkAppLayoutPanel): TrmrkPanelAtoms => {
  const retObj: Partial<TrmrkPanelAtoms> = {
    panel,
    show: atom(false),
    allowShow: atom(false),
    showLoader: atom(false),
    contentsKey: atom<number | null>(null),
  };

  retObj.render = atom((get) => {
    let retVal = get(trmrk3PanelsAppLayoutAtoms.focusedPanel) === panel;

    if (!retVal) {
      retVal =
        get(trmrk3PanelsAppLayoutAtoms.isMultiPanelMode) &&
        get(retObj.allowShow!) &&
        get(retObj.show!);
    }

    return retVal;
  });

  return retObj as TrmrkPanelAtoms;
};

export const trmrk3PanelsAppLayoutConstants = {
  defaultLeftPanelWidthRatio: 33.333,
  defaultMiddlePanelWidthRatio: 50.0,
};

export const trmrk3PanelsAppLayoutVars = {
  leftPanelWidthRatio:
    trmrk3PanelsAppLayoutConstants.defaultLeftPanelWidthRatio,
  middlePanelWidthRatio:
    trmrk3PanelsAppLayoutConstants.defaultMiddlePanelWidthRatio,
};

export const trmrk3PanelsAppLayoutAtoms = {
  leftPanel: createPanelAtoms(TrmrkAppLayoutPanel.Left),
  middlePanel: createPanelAtoms(TrmrkAppLayoutPanel.Middle),
  rightPanel: createPanelAtoms(TrmrkAppLayoutPanel.Right),
  focusedPanel: atom(TrmrkAppLayoutPanel.Middle),
  isMultiPanelMode: atom(false),
  isResizingPanels: atom(false),
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

export const useRenderPanelAtoms = (): PanelAtoms<boolean> => ({
  leftPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.render),
  middlePanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.render),
  rightPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.render),
});

export const useShowPanelLoaderAtoms = (): PanelAtoms<boolean> => ({
  leftPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.showLoader),
  middlePanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.showLoader),
  rightPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.showLoader),
});

export const usePanelContentsKeyAtoms = (): PanelAtoms<number | null> => ({
  leftPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.leftPanel.contentsKey),
  middlePanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.middlePanel.contentsKey),
  rightPanel: trmrkUseAtom(trmrk3PanelsAppLayoutAtoms.rightPanel.contentsKey),
});

export interface Init3PanelsAppLayoutArgs extends InitBasicAppLayoutArgs {
  allowShowPanelAtoms: PanelAtoms<boolean>;
  panelContentKeyAtoms: PanelAtoms<number | null>;
  leftPanel?: InitLayoutPartArgs | NullOrUndef;
  middlePanel?: InitLayoutPartArgs | NullOrUndef;
  rightPanel?: InitLayoutPartArgs | NullOrUndef;
  focusedPanel?: TrmrkAppLayoutPanel | NullOrUndef;
  setFocusedPanel: UseSetAtom<TrmrkAppLayoutPanel>;
  appUserMessage?:
    | {
        show: number | null;
        level: UserMessageLevel | null;
        content: React.ReactNode;
        autoCloseMillis?: number | NullOrUndef;
      }
    | NullOrUndef;
}

export interface Init3PanelsAppLayoutResult extends InitBasicAppLayoutResult {
  leftPanelContentsId?: number | NullOrUndef;
  middlePanelContentsId?: number | NullOrUndef;
  rightPanelContentsId?: number | NullOrUndef;
}

export const init3PanelsAppLayout = (args: Init3PanelsAppLayoutArgs) => {
  const retObj: Init3PanelsAppLayoutResult = {
    ...initBasicAppLayout(args),
    leftPanelContentsId: initLayoutPart(
      args.leftPanel,
      args.allowShowPanelAtoms.leftPanel,
      leftPanelContents,
      args.panelContentKeyAtoms.leftPanel,
    ),
    middlePanelContentsId: initLayoutPart(
      args.middlePanel,
      args.allowShowPanelAtoms.middlePanel,
      middlePanelContents,
      args.panelContentKeyAtoms.middlePanel,
    ),
    rightPanelContentsId: initLayoutPart(
      args.rightPanel,
      args.allowShowPanelAtoms.rightPanel,
      rightPanelContents,
      args.panelContentKeyAtoms.rightPanel,
    ),
  };

  let focusedPanel = args.focusedPanel ?? getDefaultPanelToFocus(retObj);
  args.setFocusedPanel(focusedPanel);

  return retObj;
};

export const getDefaultPanelToFocus = (retObj: Init3PanelsAppLayoutResult) => {
  let focusedPanel: TrmrkAppLayoutPanel;

  if ((retObj.middlePanelContentsId ?? null) !== null) {
    focusedPanel = TrmrkAppLayoutPanel.Middle;
  } else if ((retObj.rightPanelContentsId ?? null) !== null) {
    focusedPanel = TrmrkAppLayoutPanel.Right;
  } else if ((retObj.leftPanelContentsId ?? null) !== null) {
    focusedPanel = TrmrkAppLayoutPanel.Left;
  } else {
    focusedPanel = TrmrkAppLayoutPanel.Middle;
  }

  return focusedPanel;
};

export const cleanup3PanelsAppLayout = (result: Init3PanelsAppLayoutResult) => {
  cleanupBasicAppLayout(result);

  actWithValIf(result.leftPanelContentsId, (id) => {
    leftPanelContents.value.unregister(id);
  });

  actWithValIf(result.middlePanelContentsId, (id) => {
    middlePanelContents.value.unregister(id);
  });

  actWithValIf(result.rightPanelContentsId, (id) => {
    rightPanelContents.value.unregister(id);
  });
};
