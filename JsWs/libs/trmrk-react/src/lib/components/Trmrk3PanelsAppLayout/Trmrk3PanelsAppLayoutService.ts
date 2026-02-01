import { atom, PrimitiveAtom } from "jotai";

import { NullOrUndef, RefLazyValue, actWithValIf } from "@/src/trmrk/core";
import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import {
  TrmrkUseAtom,
  trmrkUseAtom,
  UseSetAtom,
} from "../../services/jotai/core";

import {
  createIntKeyedComponentsMapManager,
  IntKeyedComponentsMapManager,
} from "../../services/IntKeyedComponentsMapManager";

import {
  appBarContents,
  bottomToolbarContents,
  topToolbarContents,
  ToolbarAtoms,
  overridingAppBarContents,
  overridingBottomToolbarContents,
  overridingTopToolbarContents,
} from "../TrmrkBasicAppLayout/TrmrkBasicAppLayoutService";

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
  leftPanel: createPanelAtoms(),
  middlePanel: createPanelAtoms(),
  rightPanel: createPanelAtoms(),
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

export interface InitLayoutPartArgs {
  allowShow?: boolean | NullOrUndef;
  contents?: React.ReactNode | NullOrUndef;
  typeName?: string | NullOrUndef;
}

export interface InitLayoutArgs {
  allowShowPanelAtoms: PanelAtoms<boolean>;
  panelContentKeyAtoms: PanelAtoms<number | null>;
  showToolbarAtoms: ToolbarAtoms<boolean>;
  toolbarContentKeyAtoms: ToolbarAtoms<number | null>;
  overridingToolbarContentKeyAtoms: ToolbarAtoms<number | null>;
  appBar?: InitLayoutPartArgs | NullOrUndef;
  topToolbar?: InitLayoutPartArgs | NullOrUndef;
  bottomToolbar?: InitLayoutPartArgs | NullOrUndef;
  overridingAppBar?: InitLayoutPartArgs | NullOrUndef;
  overridingTopToolbar?: InitLayoutPartArgs | NullOrUndef;
  overridingBottomToolbar?: InitLayoutPartArgs | NullOrUndef;
  leftPanel?: InitLayoutPartArgs | NullOrUndef;
  middlePanel?: InitLayoutPartArgs | NullOrUndef;
  rightPanel?: InitLayoutPartArgs | NullOrUndef;
  focusedPanel?: TrmrkAppLayoutPanel | NullOrUndef;
  setFocusedPanel: UseSetAtom<TrmrkAppLayoutPanel>;
}

export interface InitLayoutResult {
  appBarContentsId?: number | NullOrUndef;
  topToolbarContentsId?: number | NullOrUndef;
  bottomToolbarContentsId?: number | NullOrUndef;
  overridingAppBarContentsId?: number | NullOrUndef;
  overridingTopToolbarContentsId?: number | NullOrUndef;
  overridingBottomToolbarContentsId?: number | NullOrUndef;
  leftPanelContentsId?: number | NullOrUndef;
  middlePanelContentsId?: number | NullOrUndef;
  rightPanelContentsId?: number | NullOrUndef;
}

export const initLayoutPart = (
  args: InitLayoutPartArgs | NullOrUndef,
  allowShowAtom: TrmrkUseAtom<boolean> | NullOrUndef,
  contentsKeyManager: RefLazyValue<IntKeyedComponentsMapManager>,
  contentsKeyAtom: TrmrkUseAtom<number | null>,
) => {
  args ??= {};
  const allowShow = args.allowShow ?? (args.contents ?? null) !== null;

  if (allowShowAtom) {
    allowShowAtom.set(allowShow);
  }

  const contentsId = allowShow
    ? contentsKeyManager.value.register(
        defaultComponentIdService.value.getNextId(),
        args.contents,
        args.typeName,
      )
    : null;

  contentsKeyAtom.set(contentsId);
  return contentsId;
};

export const initLayout = (args: InitLayoutArgs) => {
  const retObj: InitLayoutResult = {
    appBarContentsId: initLayoutPart(
      args.appBar,
      null,
      appBarContents,
      args.toolbarContentKeyAtoms.appBar,
    ),
    topToolbarContentsId: initLayoutPart(
      args.topToolbar,
      null,
      topToolbarContents,
      args.toolbarContentKeyAtoms.topToolbar,
    ),
    bottomToolbarContentsId: initLayoutPart(
      args.bottomToolbar,
      null,
      bottomToolbarContents,
      args.toolbarContentKeyAtoms.bottomToolbar,
    ),
    overridingAppBarContentsId: initLayoutPart(
      args.overridingAppBar,
      null,
      overridingAppBarContents,
      args.overridingToolbarContentKeyAtoms.appBar,
    ),
    overridingTopToolbarContentsId: initLayoutPart(
      args.overridingTopToolbar,
      null,
      overridingTopToolbarContents,
      args.overridingToolbarContentKeyAtoms.topToolbar,
    ),
    overridingBottomToolbarContentsId: initLayoutPart(
      args.overridingBottomToolbar,
      null,
      overridingBottomToolbarContents,
      args.overridingToolbarContentKeyAtoms.bottomToolbar,
    ),
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

export const getDefaultPanelToFocus = (retObj: InitLayoutResult) => {
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

export const cleanupLayout = (result: InitLayoutResult) => {
  actWithValIf(result.appBarContentsId, (id) => {
    appBarContents.value.unregister(id);
  });

  actWithValIf(result.topToolbarContentsId, (id) => {
    topToolbarContents.value.unregister(id);
  });

  actWithValIf(result.bottomToolbarContentsId, (id) => {
    bottomToolbarContents.value.unregister(id);
  });

  actWithValIf(result.overridingAppBarContentsId, (id) => {
    overridingAppBarContents.value.unregister(id);
  });

  actWithValIf(result.overridingTopToolbarContentsId, (id) => {
    overridingTopToolbarContents.value.unregister(id);
  });

  actWithValIf(result.overridingBottomToolbarContentsId, (id) => {
    overridingBottomToolbarContents.value.unregister(id);
  });

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
