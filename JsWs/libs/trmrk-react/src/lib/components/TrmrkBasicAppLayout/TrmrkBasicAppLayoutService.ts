import { atom, PrimitiveAtom } from "jotai";

import {
  actWithValIf,
  NullOrUndef,
  RefLazyValue,
  UserMessageLevel,
} from "@/src/trmrk/core";

import { trmrkUseAtom, TrmrkUseAtom } from "../../services/jotai/core";

import {
  createIntKeyedComponentsMapManager,
  IntKeyedComponentsMapManager,
} from "../../services/IntKeyedComponentsMapManager";

import { defaultTrmrkAppModalService } from "./TrmrkAppModalService";

export interface TrmrkToolbarAtoms {
  show: PrimitiveAtom<boolean>;
  contentsKey: PrimitiveAtom<number | null>;
  showOverriding: PrimitiveAtom<boolean>;
  overridingContentsKey: PrimitiveAtom<number | null>;
}

export interface InitLayoutPartArgs {
  allowShow?: boolean | NullOrUndef;
  contents?: React.ReactNode | NullOrUndef;
  typeName?: string | NullOrUndef;
  showLoader?: boolean | NullOrUndef;
}

export interface UserMessageAtoms<TContentNode = React.ReactNode> {
  show: PrimitiveAtom<number>;
  level: PrimitiveAtom<UserMessageLevel | null>;
  content: PrimitiveAtom<TContentNode | null>;
  autoCloseMillis: PrimitiveAtom<number | null>;
  cssClass: PrimitiveAtom<string | null>;
}

export interface UserMessageAtomsArgs<TContentNode = React.ReactNode> {
  show?: PrimitiveAtom<number> | NullOrUndef;
  level?: PrimitiveAtom<UserMessageLevel | null> | NullOrUndef;
  content?: PrimitiveAtom<TContentNode | null> | NullOrUndef;
  autoCloseMillis?: PrimitiveAtom<number | null> | NullOrUndef;
  cssClass?: PrimitiveAtom<string | null> | NullOrUndef;
}

export const createUserMessageAtoms = <TContentNode = React.ReactNode>(
  args: UserMessageAtomsArgs<TContentNode>,
): UserMessageAtoms<TContentNode> => ({
  show: args.show ?? atom<number>(0),
  level: args.level ?? atom<UserMessageLevel | null>(null),
  content: args.content ?? atom<TContentNode | null>(null),
  autoCloseMillis: args.autoCloseMillis ?? atom<number | null>(null),
  cssClass: args.cssClass ?? atom<string | null>(null),
});

const createToolbarAtoms = (show: boolean): TrmrkToolbarAtoms => ({
  show: atom(show),
  contentsKey: atom<number | null>(null),
  showOverriding: atom(false),
  overridingContentsKey: atom<number | null>(null),
});

export const trmrkBasicAppLayoutAtoms = {
  cssClass: atom<string | null>(null),
  hideHeaderAndFooter: atom(false),
  showToolbars: atom(true),
  appBar: createToolbarAtoms(true),
  topToolbar: createToolbarAtoms(true),
  bottomToolbar: createToolbarAtoms(false),
  appUserMessage: createUserMessageAtoms({}),
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

export const appLeadingOverlappingContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export const appTrailingOverlappingContents = new RefLazyValue(() =>
  createIntKeyedComponentsMapManager(),
);

export interface ToolbarAtoms<Value> {
  appBar: TrmrkUseAtom<Value>;
  topToolbar: TrmrkUseAtom<Value>;
  bottomToolbar: TrmrkUseAtom<Value>;
}

export interface UseUserMessageAtoms<TContentNode = React.ReactNode> {
  show: TrmrkUseAtom<number>;
  level: TrmrkUseAtom<UserMessageLevel | null>;
  content: TrmrkUseAtom<TContentNode | null>;
  autoCloseMillis: TrmrkUseAtom<number | null>;
  cssClass: TrmrkUseAtom<string | null>;
}

export const useShowToolbars = (): ToolbarAtoms<boolean> => ({
  appBar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appBar.show),
  topToolbar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.topToolbar.show),
  bottomToolbar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.bottomToolbar.show),
});

export const useShowOverridingToolbars = (): ToolbarAtoms<boolean> => ({
  appBar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.appBar.showOverriding),
  topToolbar: trmrkUseAtom(trmrkBasicAppLayoutAtoms.topToolbar.showOverriding),
  bottomToolbar: trmrkUseAtom(
    trmrkBasicAppLayoutAtoms.bottomToolbar.showOverriding,
  ),
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

export const useAppUserMessage = (): UseUserMessageAtoms => ({
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
  showLoaderAtom: TrmrkUseAtom<boolean> | NullOrUndef,
) => {
  args ??= {};
  const allowShow = args.allowShow ?? (args.contents ?? null) !== null;

  if (allowShowAtom) {
    allowShowAtom.set(allowShow);
  }

  const contentsId = allowShow
    ? contentsKeyManager.value.register(args.contents, args.typeName).key
    : null;

  contentsKeyAtom.set(contentsId);

  if (showLoaderAtom) {
    showLoaderAtom.set(args.showLoader ?? false);
  }

  return contentsId;
};

export interface InitBasicAppLayoutAppUserMessageArgs {
  show?: number | NullOrUndef;
  level?: UserMessageLevel | NullOrUndef;
  content?: React.ReactNode;
  autoCloseMillis?: number | NullOrUndef;
}

export interface UseBasicAppLayoutAtoms {
  showToolbarAtoms: ToolbarAtoms<boolean>;
  toolbarContentKeyAtoms: ToolbarAtoms<number | null>;
  showOverridingToolbarAtoms: ToolbarAtoms<boolean>;
  overridingToolbarContentKeyAtoms: ToolbarAtoms<number | null>;
  appUserMessageAtoms: UseUserMessageAtoms;
}

export interface InitBasicAppLayoutArgs extends UseBasicAppLayoutAtoms {
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
  defaultTrmrkAppModalService.value.updateRestorableMinimizedStacks();

  const retObj: InitBasicAppLayoutResult = {
    appBarContentsId: initLayoutPart(
      args.appBar,
      args.showToolbarAtoms.appBar,
      appBarContents,
      args.toolbarContentKeyAtoms.appBar,
      null,
    ),
    topToolbarContentsId: initLayoutPart(
      args.topToolbar,
      args.showToolbarAtoms.topToolbar,
      topToolbarContents,
      args.toolbarContentKeyAtoms.topToolbar,
      null,
    ),
    bottomToolbarContentsId: initLayoutPart(
      args.bottomToolbar,
      args.showToolbarAtoms.bottomToolbar,
      bottomToolbarContents,
      args.toolbarContentKeyAtoms.bottomToolbar,
      null,
    ),
    overridingAppBarContentsId: initLayoutPart(
      args.overridingAppBar,
      args.showOverridingToolbarAtoms.appBar,
      overridingAppBarContents,
      args.overridingToolbarContentKeyAtoms.appBar,
      null,
    ),
    overridingTopToolbarContentsId: initLayoutPart(
      args.overridingTopToolbar,
      args.showOverridingToolbarAtoms.topToolbar,
      overridingTopToolbarContents,
      args.overridingToolbarContentKeyAtoms.topToolbar,
      null,
    ),
    overridingBottomToolbarContentsId: initLayoutPart(
      args.overridingBottomToolbar,
      args.showOverridingToolbarAtoms.bottomToolbar,
      overridingBottomToolbarContents,
      args.overridingToolbarContentKeyAtoms.bottomToolbar,
      null,
    ),
  };

  const appUserMessageArgs = args.appUserMessage ?? {};
  args.appUserMessageAtoms.show.set(appUserMessageArgs.show ?? 0);
  args.appUserMessageAtoms.level.set(appUserMessageArgs.level ?? null);
  args.appUserMessageAtoms.content.set(appUserMessageArgs.content);

  args.appUserMessageAtoms.autoCloseMillis.set(
    appUserMessageArgs.autoCloseMillis ?? null,
  );

  return retObj;
};

export const cleanupBasicAppLayout = (result: InitBasicAppLayoutResult) => {
  defaultTrmrkAppModalService.value.clearRestorableMinimizedStacks();

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

export const useBasicAppLayoutAtoms = (): UseBasicAppLayoutAtoms => ({
  showToolbarAtoms: useShowToolbars(),
  toolbarContentKeyAtoms: useToolbarContentKeys(),
  showOverridingToolbarAtoms: useShowOverridingToolbars(),
  overridingToolbarContentKeyAtoms: useToolbarOverridingContentKeys(),
  appUserMessageAtoms: useAppUserMessage(),
});
