import { atom, PrimitiveAtom, Atom, getDefaultStore } from "jotai";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { NullOrUndef, RefLazyValue, withValIf } from "@/src/trmrk/core";
import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";
import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";

import {
  ParsedUrl,
  defaultUrlSerializer,
} from "@/src/trmrk/services/UrlSerializer";

import {
  IntKeyedComponentsMapManager,
  createIntKeyedComponentsMapManager,
} from "../../services/IntKeyedComponentsMapManager";

import { IntKeyedNode } from "../defs/common";

import { JotaiStore } from "../../services/jotai/core";

export const MODAL_FADE_MILLIS = 300;

export interface TrmrkAppModalPropsCore {
  modalTitle: PrimitiveAtom<string>;
  canCloseManually?: boolean | PrimitiveAtom<boolean> | NullOrUndef;
}

export interface TrmrkAppModalPropsCoreWithData<
  TModalData = any,
> extends TrmrkAppModalPropsCore {
  data: () => TModalData;
  modalId: number;
}

export type TrmrkAppModalNodeFactory<TModalData> = (
  props: TrmrkAppModalPropsCoreWithData<TModalData>,
) => React.ReactNode;

export interface TrmrkAppModalArgs<TModalData> {
  props: TrmrkAppModalPropsCore;
  data?: TModalData | NullOrUndef;
  modal: TrmrkAppModalNodeFactory<TModalData>;
}

export interface TrmrkAppModalData<TModalData> {
  props: TrmrkAppModalPropsCoreWithData<TModalData>;
  args: TrmrkAppModalArgs<TModalData>;
  data: TModalData;
  canCloseManually: PrimitiveAtom<boolean>;
  isMaximized: PrimitiveAtom<boolean>;
}

export interface AppModalsStackArgs {
  stackId?: number | NullOrUndef;
  urlTransformer?: (url: ParsedUrl) => ParsedUrl | NullOrUndef;
  activator?: (currentUrl: ParsedUrl) => boolean | NullOrUndef;
}

export class TrmrkAppModalsStackService extends TrmrkDisposableBase {
  stackId: number;

  minimizedModals: IntKeyedComponentsMapManager<
    TrmrkAppModalNodeFactory<any>,
    TrmrkAppModalData<any>
  >;

  openModals: IntKeyedComponentsMapManager<
    TrmrkAppModalNodeFactory<any>,
    TrmrkAppModalData<any>
  >;

  isClosingModals: PrimitiveAtom<boolean>;
  canCloseCurrentModalManuallyAtom: Atom<boolean>;
  canCloseAllModalsManuallyAtom: Atom<boolean>;
  currentModalIsMaximizedAtom: PrimitiveAtom<boolean>;
  refUrl: ParsedUrl;

  private readonly store: JotaiStore;

  constructor(
    public args: AppModalsStackArgs,
    store?: JotaiStore | NullOrUndef,
  ) {
    super();
    this.stackId = args.stackId ?? defaultComponentIdService.value.getNextId();

    this.minimizedModals = createIntKeyedComponentsMapManager<
      TrmrkAppModalNodeFactory<any>,
      TrmrkAppModalData<any>
    >();

    this.openModals = createIntKeyedComponentsMapManager<
      TrmrkAppModalNodeFactory<any>,
      TrmrkAppModalData<any>
    >();

    this.isClosingModals = atom(false);
    this.store = store ?? getDefaultStore();

    this.canCloseCurrentModalManuallyAtom = atom<boolean>((get) => {
      let canCloseCurrentModalManuallyAtom = false;
      const currentModalKey = get(this.openModals.currentKeyAtom);

      if ((currentModalKey ?? null) !== null) {
        const currentModal =
          this.openModals.keyedMap.map[currentModalKey!].nodeData!;

        canCloseCurrentModalManuallyAtom = get(currentModal.canCloseManually);
      }

      return canCloseCurrentModalManuallyAtom;
    });

    this.canCloseAllModalsManuallyAtom = atom<boolean>((get) => {
      const keysArr = get(this.openModals.keysAtom);

      const canCloseAllModalsManually = keysArr
        .map((key) =>
          get(this.openModals.keyedMap.map[key].nodeData!.canCloseManually),
        )
        .reduce((can1, can2) => can1 && can2, true);

      return canCloseAllModalsManually;
    });

    this.currentModalIsMaximizedAtom = atom(
      (get) => {
        const currentModalId = get(this.openModals.currentKeyAtom);

        if ((currentModalId ?? null) !== null) {
          const currentModal = this.openModals.keyedMap.map[currentModalId!];

          if (currentModal) {
            const isMaximized = get(currentModal.nodeData!.isMaximized);
            return isMaximized;
          }
        }

        return false;
      },
      (get, set, newValue) => {
        const currentModalId = get(this.openModals.currentKeyAtom);

        if ((currentModalId ?? null) !== null) {
          const currentModal = this.openModals.keyedMap.map[currentModalId!];

          if (currentModal) {
            set(currentModal.nodeData!.isMaximized, newValue);
          }
        }
      },
    );

    this.refUrl = defaultUrlSerializer.value.deserializeUrl(location.href);
    this.refUrl = args.urlTransformer?.(this.refUrl) ?? this.refUrl;
  }

  disposeCore() {}

  canActivate(currentUrl?: ParsedUrl | NullOrUndef) {
    currentUrl ??= defaultUrlSerializer.value.deserializeUrl(location.href);

    const canActivate =
      this.args.activator?.(currentUrl) ??
      currentUrl.relUrlStr === this.refUrl.relUrlStr;

    return canActivate;
  }

  canCloseModalManually(modalId: number) {
    const modal = this.openModals.keyedMap.map[modalId];

    const canCloseModal =
      withValIf(modal?.nodeData!.canCloseManually, (canCloseManually) =>
        this.store.get(canCloseManually),
      ) ?? true;

    return canCloseModal;
  }

  canCloseAllModalsManually() {
    const canCloseAllModalsManually = this.store.get(
      this.canCloseAllModalsManuallyAtom,
    );

    return canCloseAllModalsManually;
  }

  openModal<TModalData>(args: TrmrkAppModalArgs<TModalData>) {
    const modalId = defaultComponentIdService.value.getNextId();
    const data = args.data ?? ({} as TModalData);
    let canCloseManually = args.props.canCloseManually ?? true;

    if ("object" !== typeof canCloseManually) {
      canCloseManually = atom(canCloseManually);
    }

    const nodeData: TrmrkAppModalData<TModalData> = {
      props: { modalId, data: () => data, modalTitle: args.props.modalTitle },
      args,
      data,
      canCloseManually,
      isMaximized: atom(false),
    };

    this.openModals.register(args.modal, null, modalId, nodeData);
    this.store.set(this.isClosingModals, () => false);
    return modalId;
  }

  closeModal(modalId: number, isLastModal?: boolean | NullOrUndef) {
    isLastModal ??= this.openModals.getKeys().length === 1;

    if (isLastModal) {
      this.store.set(this.isClosingModals, () => true);
    }

    setTimeout(() => {
      this.openModals.unregister(modalId);
    }, MODAL_FADE_MILLIS);
  }

  closeCurrentModal(
    modalsIdsArr?: number[] | NullOrUndef,
    callback?: (() => void) | NullOrUndef,
  ) {
    modalsIdsArr ??= this.openModals.getKeys();
    const modalId = modalsIdsArr[modalsIdsArr.length - 1];
    this.closeModal(modalId, modalsIdsArr.length === 1);
    callback?.();
  }

  closeAllModalsManually(
    callback?:
      | ((removed: {
          [key: number]: IntKeyedNode<
            TrmrkAppModalNodeFactory<any>,
            TrmrkAppModalData<any>
          >;
        }) => void)
      | NullOrUndef,
  ) {
    if (this.canCloseAllModalsManually()) {
      this.store.set(this.isClosingModals, () => true);

      setTimeout(() => {
        const replaced = this.openModals.replaceAll({});
        callback?.(replaced);
      }, MODAL_FADE_MILLIS);
    }
  }

  minimizeAllModals(
    callback?:
      | ((removed: {
          [key: number]: IntKeyedNode<
            TrmrkAppModalNodeFactory<any>,
            TrmrkAppModalData<any>
          >;
        }) => void)
      | NullOrUndef,
  ) {
    if (this.canCloseAllModalsManually()) {
      const modalsIdsArr = this.minimizedModals.getKeys();

      if (modalsIdsArr.length === 0) {
        this.store.set(this.isClosingModals, () => true);

        setTimeout(() => {
          const openModalsMap = this.openModals.replaceAll({});
          const replaced = this.minimizedModals.replaceAll(openModalsMap);
          callback?.(replaced);
        }, MODAL_FADE_MILLIS);
      }
    }
  }

  restoreMinimizedModals() {
    const modalsIdsArr = this.minimizedModals.getKeys();

    if (modalsIdsArr.length > 0) {
      const minimizedModals = this.minimizedModals.replaceAll([]);

      const currentModal =
        minimizedModals[modalsIdsArr[modalsIdsArr.length - 1]];

      if (currentModal) {
        this.store.set(this.isClosingModals, () => false);
        this.openModals.replaceAll(minimizedModals);
      }
    }
  }
}

export class TrmrkAppModalService extends TrmrkDisposableBase {
  stacks: IntKeyedComponentsMapManager<TrmrkAppModalsStackService>;
  minimizedStacks: TrmrkAppModalsStackService[] = [];
  restorableMinimizedStacks: TrmrkAppModalsStackService[] = [];

  isClosingModals: Atom<boolean>;
  canCloseCurrentModalManuallyAtom: Atom<boolean>;
  canCloseAllModalsManuallyAtom: Atom<boolean>;
  currentModalKey: Atom<number | null>;
  currentModalIsMaximizedAtom: PrimitiveAtom<boolean>;
  hasRestorableMinimizedStacks: PrimitiveAtom<boolean>;

  private readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    super();

    this.stacks =
      createIntKeyedComponentsMapManager<TrmrkAppModalsStackService>();

    this.isClosingModals = atom<boolean>((get) => {
      let isClosingModals = false;
      const currentStackId = get(this.stacks.currentKeyAtom);

      if ((currentStackId ?? null) !== null) {
        const currentStack = this.stacks.keyedMap.map[currentStackId!];

        if (currentStack) {
          isClosingModals = get(currentStack.node.isClosingModals);
        }
      }

      return isClosingModals;
    });

    this.canCloseCurrentModalManuallyAtom = atom<boolean>((get) => {
      let canCloseCurrentModalManually = false;
      const currentStackId = get(this.stacks.currentKeyAtom);

      if ((currentStackId ?? null) !== null) {
        const currentStack = this.stacks.keyedMap.map[currentStackId!]?.node;

        if (currentStack) {
          canCloseCurrentModalManually = get(
            currentStack.canCloseCurrentModalManuallyAtom,
          );
        }
      }

      return canCloseCurrentModalManually;
    });

    this.canCloseAllModalsManuallyAtom = atom<boolean>((get) => {
      let canCloseAllModalsManually = false;

      const currentStackId = get(this.stacks.currentKeyAtom);

      if ((currentStackId ?? null) !== null) {
        const currentStack = this.stacks.keyedMap.map[currentStackId!]?.node;

        if (currentStack) {
          canCloseAllModalsManually = get(
            currentStack.canCloseAllModalsManuallyAtom,
          );
        }
      }

      return canCloseAllModalsManually;
    });

    this.currentModalKey = atom((get) => {
      const currentStackId = get(this.stacks.currentKeyAtom);

      if ((currentStackId ?? null) !== null) {
        const currentStack = this.stacks.keyedMap.map[currentStackId!]?.node;

        if (currentStack) {
          const currentModalId = get(currentStack.openModals.currentKeyAtom);
          return currentModalId;
        }
      }

      return null;
    });

    this.currentModalIsMaximizedAtom = atom(
      (get) => {
        const currentStackId = get(this.stacks.currentKeyAtom);

        if ((currentStackId ?? null) !== null) {
          const currentStack = this.stacks.keyedMap.map[currentStackId!]?.node;

          if (currentStack) {
            const isMaximized = get(currentStack.currentModalIsMaximizedAtom);
            return isMaximized;
          }
        }

        return false;
      },
      (get, set, newValue) => {
        const currentStackId = get(this.stacks.currentKeyAtom);

        if ((currentStackId ?? null) !== null) {
          const currentStack = this.stacks.keyedMap.map[currentStackId!]?.node;

          if (currentStack) {
            set(currentStack.currentModalIsMaximizedAtom, newValue);
          }
        }
      },
    );

    this.hasRestorableMinimizedStacks = atom(false);
    this.store = store ?? getDefaultStore();
  }

  createStack(args: AppModalsStackArgs) {
    const stackService = new TrmrkAppModalsStackService(args, this.store);
    this.stacks.register(stackService, null, stackService.stackId);
    return stackService;
  }

  disposeStack(stackId: number) {
    const retObj = this.stacks.unregister(stackId);
    retObj?.node.dispose();
    return retObj;
  }

  getCurrentStack() {
    const currentStackId = this.store.get(this.stacks.currentKeyAtom);

    const currentStack =
      (currentStackId ?? null) !== null
        ? this.stacks.keyedMap.map[currentStackId!]?.node
        : null;

    return currentStack;
  }

  getCurrentStackOpenModalKeys() {
    const currentStack = this.getCurrentStack();

    if (currentStack) {
      return currentStack.openModals.getKeys();
    } else {
      return null;
    }
  }

  getCurrentStackMinimizedModalKeys() {
    const currentStack = this.getCurrentStack();

    if (currentStack) {
      return currentStack.minimizedModals.getKeys();
    } else {
      return null;
    }
  }

  getOrCreateCurrentStack(args: AppModalsStackArgs) {
    const currentStack = this.getCurrentStack() ?? this.createStack(args);
    return currentStack;
  }

  openModal<TModalData>(
    modalArgs: TrmrkAppModalArgs<TModalData>,
    stackArgs: AppModalsStackArgs,
  ) {
    const currentStack = this.getOrCreateCurrentStack(stackArgs);
    return currentStack.openModal(modalArgs);
  }

  closeModal(modalId: number) {
    const currentStack = this.getCurrentStack();

    if (currentStack) {
      const isLastModal = currentStack.openModals.getKeys().length === 1;
      currentStack.closeModal(modalId, isLastModal);

      if (isLastModal) {
        this.stacks.unregister(currentStack.stackId);
      }
    }
  }

  closeCurrentModal() {
    const currentStack = this.getCurrentStack();

    if (currentStack) {
      const currentModalIds = currentStack.openModals.getKeys();
      const isLastModal = currentModalIds.length === 1;

      currentStack.closeCurrentModal(currentModalIds, () => {
        if (isLastModal) {
          this.stacks.unregister(currentStack.stackId);
        }
      });
    }
  }

  closeAllModalsManually() {
    const currentStack = this.getCurrentStack();

    if (currentStack) {
      currentStack.closeAllModalsManually(() => {
        this.stacks.unregister(currentStack.stackId);
      });
    }
  }

  minimizeAllModals() {
    const currentStack = this.getCurrentStack();

    if (currentStack) {
      currentStack.minimizeAllModals(() => {
        this.minimizedStacks.push(currentStack);
        this.restorableMinimizedStacks.push(currentStack);
        this.stacks.unregister(currentStack.stackId);
        this.store.set(this.hasRestorableMinimizedStacks, true);
      });
    }
  }

  restoreMinimizedModals() {
    const currentStack = this.getCurrentStack();

    if (currentStack) {
      currentStack.restoreMinimizedModals();
      const idx = this.restorableMinimizedStacks.indexOf(currentStack);
      this.restorableMinimizedStacks.splice(idx, 1);

      this.store.set(
        this.hasRestorableMinimizedStacks,
        this.restorableMinimizedStacks.length > 0,
      );
    }
  }

  updateRestorableMinimizedStacks(
    stackKeys?: number[] | NullOrUndef,
    currentUrl?: ParsedUrl | NullOrUndef,
  ) {
    currentUrl ??= defaultUrlSerializer.value.deserializeUrl(location.href);
    stackKeys ??= this.stacks.getKeys();

    this.restorableMinimizedStacks = this.minimizedStacks.filter((stack) =>
      stack.canActivate(currentUrl),
    );

    return this.restorableMinimizedStacks;
  }

  clearRestorableMinimizedStacks() {
    this.restorableMinimizedStacks = [];
  }

  disposeCore() {}
}

export const defaultTrmrkAppModalService = new RefLazyValue(
  () => new TrmrkAppModalService(),
);
