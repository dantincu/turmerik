import { atom, PrimitiveAtom } from "jotai";

import {
  actWithValIf,
  NullOrUndef,
  RefLazyValue,
  UserMessageLevel,
} from "@/src/trmrk/core";
import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import { trmrkUseAtom, TrmrkUseAtom } from "../../services/jotai/core";

import {
  createIntKeyedComponentsMapManager,
  IntKeyedComponentsMapManager,
} from "../../services/IntKeyedComponentsMapManager";

import { defaultTrmrkAppModalService } from "./TrmrkAppModalService";
console.log("defaultTrmrkAppModalService", defaultTrmrkAppModalService);

export interface TrmrkToolbarAtoms {
  show: PrimitiveAtom<boolean>;
  contentsKey: PrimitiveAtom<number | null>;
  overridingContentsKey: PrimitiveAtom<number | null>;
}

export interface InitLayoutPartArgs {
  allowShow?: boolean | NullOrUndef;
  contents?: React.ReactNode | NullOrUndef;
  typeName?: string | NullOrUndef;
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
  appUserMessage: {
    show: atom<number | null>(null),
    level: atom<UserMessageLevel | null>(null),
    content: atom<React.ReactNode>(null),
    autoCloseMillis: atom<number | null>(null),
    cssClass: atom<string | null>(null),
  },
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

export interface AppUserMessageAtoms {
  show: TrmrkUseAtom<number | null>;
  level: TrmrkUseAtom<UserMessageLevel | null>;
  content: TrmrkUseAtom<React.ReactNode>;
  autoCloseMillis: TrmrkUseAtom<number | null>;
  cssClass: TrmrkUseAtom<string | null>;
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

export const useAppUserMessage = (): AppUserMessageAtoms => ({
  show: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appUserMessage.show),
  level: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appUserMessage.level),
  content: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appUserMessage.content),
  autoCloseMillis: trmrkUseAtom(
    trmrkBasicAppLayoutAtoms.appUserMessage.autoCloseMillis,
  ),
  cssClass: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appUserMessage.cssClass),
});

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

export interface InitBasicAppLayoutAppUserMessageArgs {
  show?: number | NullOrUndef;
  level?: UserMessageLevel | NullOrUndef;
  content?: React.ReactNode;
  autoCloseMillis?: number | NullOrUndef;
}

export interface InitBasicAppLayoutArgs {
  showToolbarAtoms: ToolbarAtoms<boolean>;
  toolbarContentKeyAtoms: ToolbarAtoms<number | null>;
  overridingToolbarContentKeyAtoms: ToolbarAtoms<number | null>;
  appUserMessageAtoms: AppUserMessageAtoms;
  appBar?: InitLayoutPartArgs | NullOrUndef;
  topToolbar?: InitLayoutPartArgs | NullOrUndef;
  bottomToolbar?: InitLayoutPartArgs | NullOrUndef;
  overridingAppBar?: InitLayoutPartArgs | NullOrUndef;
  overridingTopToolbar?: InitLayoutPartArgs | NullOrUndef;
  overridingBottomToolbar?: InitLayoutPartArgs | NullOrUndef;
  appUserMessage?: InitBasicAppLayoutAppUserMessageArgs | NullOrUndef;
}

export interface InitBasicAppLayoutResult {
  appBarContentsId?: number | NullOrUndef;
  topToolbarContentsId?: number | NullOrUndef;
  bottomToolbarContentsId?: number | NullOrUndef;
  overridingAppBarContentsId?: number | NullOrUndef;
  overridingTopToolbarContentsId?: number | NullOrUndef;
  overridingBottomToolbarContentsId?: number | NullOrUndef;
}

export const initBasicAppLayout = (args: InitBasicAppLayoutArgs) => {
  const retObj: InitBasicAppLayoutResult = {
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
  };

  const appUserMessageArgs = args.appUserMessage ?? {};
  args.appUserMessageAtoms.show.set(appUserMessageArgs.show ?? null);
  args.appUserMessageAtoms.level.set(appUserMessageArgs.level ?? null);
  args.appUserMessageAtoms.content.set(appUserMessageArgs.content);

  args.appUserMessageAtoms.autoCloseMillis.set(
    appUserMessageArgs.autoCloseMillis ?? null,
  );

  return retObj;
};

export const cleanupBasicAppLayout = (result: InitBasicAppLayoutResult) => {
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
};
