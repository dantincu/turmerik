import { atom, PrimitiveAtom, Atom, getDefaultStore } from "jotai";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  NullOrUndef,
  RefLazyValue,
  withValIf,
  withVal,
} from "@/src/trmrk/core";

import { toNumMap, mapNumMap } from "@/src/trmrk/map";

import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";
import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";
import { defaultAnimationDurationMillis } from "@/src/trmrk-browser/core";

import {
  ParsedUrl,
  defaultUrlSerializer,
} from "@/src/trmrk/services/UrlSerializer";

import {
  IntKeyedComponentsMapManager,
  createIntKeyedComponentsMapManager,
} from "../../services/IntKeyedComponentsMapManager";

import { IntKeyedNode } from "../defs/common";
import { JotaiStore, trmrkUseAtom } from "../../services/jotai/core";

import {
  UseUserMessageAtoms,
  UserMessageAtoms,
  UserMessageAtomsArgs,
  createUserMessageAtoms,
} from "./TrmrkBasicAppLayoutService";

import { defaultTrmrkPopoverService } from "./TrmrkPopoverService";

export interface TrmrkAppModalPropsCore {
  modalTitle: PrimitiveAtom<string>;
  canCloseManually?: boolean | PrimitiveAtom<boolean> | NullOrUndef;
}

export interface TrmrkAppModalPropsCoreWithData<
  TModalData = any,
> extends TrmrkAppModalPropsCore {
  data: TModalData;
  modalId: number;
}

export type TrmrkAppModalNodeFactory<TModalData> = (
  props: TrmrkAppModalPropsCoreWithData<TModalData>,
) => React.ReactNode;

export interface TrmrkAppModalArgs<TModalData> {
  props: TrmrkAppModalPropsCore;
  data?: TModalData | NullOrUndef;
  modal: TrmrkAppModalNodeFactory<TModalData>;
  userMessage?: UserMessageAtomsArgs<() => React.ReactNode> | NullOrUndef;
}

export interface TrmrkAppModalData<TModalData> {
  props: TrmrkAppModalPropsCoreWithData<TModalData>;
  args: TrmrkAppModalArgs<TModalData>;
  data: TModalData;
  canCloseManually: PrimitiveAtom<boolean>;
  isMaximized: PrimitiveAtom<boolean>;
  userMessageAtoms: UserMessageAtoms<() => React.ReactNode>;
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
  currentModalIsFadingOutAtom: PrimitiveAtom<boolean>;
  currentModalUserMessageAtoms: UserMessageAtoms<() => React.ReactNode>;
  refUrl: ParsedUrl;

  minimizedModalTitlesAtom: Atom<string[]>;

  readonly store: JotaiStore;

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

    this.currentModalIsFadingOutAtom = atom(false);

    this.currentModalUserMessageAtoms = {
      show: atom(
        (get) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              const show = get(currentModal.nodeData!.userMessageAtoms.show);
              return show;
            }
          }

          return 0;
        },
        (get, set, newValue) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              set(currentModal.nodeData!.userMessageAtoms.show, newValue);
            }
          }
        },
      ),
      level: atom(
        (get) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              const level = get(currentModal.nodeData!.userMessageAtoms.level);
              return level;
            }
          }

          return null;
        },
        (get, set, newValue) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              set(currentModal.nodeData!.userMessageAtoms.level, newValue);
            }
          }
        },
      ),
      content: atom(
        (get) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              const content = get(
                currentModal.nodeData!.userMessageAtoms.content,
              );
              return content;
            }
          }

          return null;
        },
        (get, set, newValue) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              set(currentModal.nodeData!.userMessageAtoms.content, newValue);
            }
          }
        },
      ),
      autoCloseMillis: atom(
        (get) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              const autoCloseMillis = get(
                currentModal.nodeData!.userMessageAtoms.autoCloseMillis,
              );

              return autoCloseMillis;
            }
          }

          return null;
        },
        (get, set, newValue) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              set(
                currentModal.nodeData!.userMessageAtoms.autoCloseMillis,
                newValue,
              );
            }
          }
        },
      ),
      cssClass: atom(
        (get) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              const cssClass = get(
                currentModal.nodeData!.userMessageAtoms.cssClass,
              );

              return cssClass;
            }
          }

          return null;
        },
        (get, set, newValue) => {
          const currentModalId = get(this.openModals.currentKeyAtom);

          if ((currentModalId ?? null) !== null) {
            const currentModal = this.openModals.keyedMap.map[currentModalId!];

            if (currentModal) {
              set(currentModal.nodeData!.userMessageAtoms.cssClass, newValue);
            }
          }
        },
      ),
    };

    this.minimizedModalTitlesAtom = atom((get) => {
      const minimizedModalKeysArr = get(this.minimizedModals.keysAtom);

      const minimizedModalTitles = minimizedModalKeysArr.map((key) =>
        withValIf(this.minimizedModals.keyedMap.map[key], (node) =>
          get(node.nodeData!.props.modalTitle),
        ),
      );

      return minimizedModalTitles;
    });

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
    defaultTrmrkPopoverService.value.closeAllPopoversManually();
    const modalId = defaultComponentIdService.value.getNextId();
    const data = args.data ?? ({} as TModalData);
    let canCloseManually = args.props.canCloseManually ?? true;

    if ("object" !== typeof canCloseManually) {
      canCloseManually = atom(canCloseManually);
    }

    const nodeData: TrmrkAppModalData<TModalData> = {
      props: { modalId, data, modalTitle: args.props.modalTitle },
      args,
      data,
      canCloseManually,
      isMaximized: atom(false),
      userMessageAtoms: createUserMessageAtoms(args.userMessage ?? {}),
    };

    this.store.set(this.isClosingModals, () => false);
    const alreadyHasModals = this.openModals.getKeys().length > 0;

    if (alreadyHasModals) {
      this.store.set(this.currentModalIsFadingOutAtom, () => true);

      setTimeout(() => {
        this.store.set(this.currentModalIsFadingOutAtom, () => false);
        this.openModals.register(args.modal, null, modalId, nodeData);
      }, defaultAnimationDurationMillis);
    } else {
      this.openModals.register(args.modal, null, modalId, nodeData);
    }

    return modalId;
  }

  closeModal(
    modalId: number,
    isLastModal?: boolean | NullOrUndef,
    callback?: (() => void) | NullOrUndef,
  ) {
    defaultTrmrkPopoverService.value.closeAllPopoversManually();
    isLastModal ??= this.openModals.getKeys().length === 1;
    this.store.set(this.currentModalIsFadingOutAtom, () => true);

    if (isLastModal) {
      this.store.set(this.isClosingModals, () => true);
    }

    setTimeout(() => {
      this.store.set(this.currentModalIsFadingOutAtom, () => false);
      this.openModals.unregister(modalId, true);
      callback?.();
    }, defaultAnimationDurationMillis);
  }

  closeCurrentModal(
    modalsIdsArr?: number[] | NullOrUndef,
    callback?: (() => void) | NullOrUndef,
  ) {
    modalsIdsArr ??= this.openModals.getKeys();
    const modalId = modalsIdsArr[modalsIdsArr.length - 1];
    this.closeModal(modalId, modalsIdsArr.length === 1, callback);
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
      defaultTrmrkPopoverService.value.closeAllPopoversManually();
      this.store.set(this.isClosingModals, () => true);

      setTimeout(() => {
        const replaced = this.openModals.replaceAll({});
        callback?.(replaced);
      }, defaultAnimationDurationMillis);
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
      defaultTrmrkPopoverService.value.closeAllPopoversManually();
      const modalsIdsArr = this.minimizedModals.getKeys();

      if (modalsIdsArr.length === 0) {
        this.store.set(this.isClosingModals, () => true);

        setTimeout(() => {
          const modalId = this.openModals.getCurrentKey();
          const openModalsMap = this.openModals.replaceAll({});
          const replaced = this.minimizedModals.replaceAll(openModalsMap);
          this.store.set(this.minimizedModals.currentKeyAtom, modalId);
          callback?.(replaced);
        }, defaultAnimationDurationMillis);
      }
    }
  }

  restoreMinimizedModals() {
    const modalsIdsArr = this.minimizedModals.getKeys();

    if (modalsIdsArr.length > 0) {
      defaultTrmrkPopoverService.value.closeAllPopoversManually();
      const modalId = this.minimizedModals.getCurrentKey();
      const minimizedModals = this.minimizedModals.replaceAll([]);

      this.store.set(this.isClosingModals, () => false);
      this.openModals.replaceAll(minimizedModals);
      this.store.set(this.openModals.currentKeyAtom, modalId);
    }
  }
}

export class TrmrkAppModalService extends TrmrkDisposableBase {
  stacks: IntKeyedComponentsMapManager<TrmrkAppModalsStackService>;
  minimizedStacks: TrmrkAppModalsStackService[] = [];
  minimizedStackIds: PrimitiveAtom<number[]>;
  minimizedStacksModalIds: Atom<{ [key: number]: number[] }>;

  minimizedStacksModalTitles: Atom<{
    [key: number]: { [key: number]: string };
  }>;

  restorableMinimizedStacks: TrmrkAppModalsStackService[] = [];
  restorableMinimizedStackIds: PrimitiveAtom<number[]>;
  restorableMinimizedStacksModalIds: Atom<{ [key: number]: number[] }>;

  restorableMinimizedStacksModalTitles: Atom<{
    [key: number]: { [key: number]: string };
  }>;

  isClosingModals: Atom<boolean>;
  canCloseCurrentModalManuallyAtom: Atom<boolean>;
  canCloseAllModalsManuallyAtom: Atom<boolean>;
  currentModalKey: Atom<number | null>;
  currentModalIsMaximizedAtom: PrimitiveAtom<boolean>;
  currentModalIsFadingOut: PrimitiveAtom<boolean>;
  currentModalUserMessageAtoms: UserMessageAtoms<() => React.ReactNode>;

  readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    super();

    this.stacks =
      createIntKeyedComponentsMapManager<TrmrkAppModalsStackService>();

    this.minimizedStackIds = atom<number[]>([]);
    this.restorableMinimizedStackIds = atom<number[]>([]);

    this.minimizedStacksModalIds = atom((get) => {
      const minimizedStackIdsArr = get(this.minimizedStackIds);

      const minimizedStacksModalIds = toNumMap(
        minimizedStackIdsArr.map((stackId) => ({
          key: stackId,
          value: withValIf(
            this.stacks.keyedMap.map[stackId],
            (stackNode) => get(stackNode.node.minimizedModals.keysAtom),
            () => [],
          ),
        })),
      );

      return minimizedStacksModalIds;
    });

    this.minimizedStacksModalTitles = atom((get) => {
      const minimizedStacksModalIds = get(this.minimizedStacksModalIds);

      const minimizedStacksModalTitles = mapNumMap(
        minimizedStacksModalIds,
        (modalIdsArr, stackId) =>
          withValIf(
            this.stacks.keyedMap.map[stackId],
            (stackNode) =>
              toNumMap(
                modalIdsArr.map((modalId) => ({
                  key: modalId,
                  value: withValIf(
                    stackNode.node.minimizedModals.keyedMap.map[modalId],
                    (modalNode) =>
                      get(modalNode.nodeData!.args.props.modalTitle),
                  ),
                })),
              ),
            () =>
              ({}) as {
                [key: number]: string;
              },
          ),
      );

      return minimizedStacksModalTitles;
    });

    this.restorableMinimizedStacksModalIds = atom((get) => {
      const restorableMinimizedStackIds = get(this.restorableMinimizedStackIds);

      const restorableMinimizedStacksModalIds = toNumMap(
        restorableMinimizedStackIds.map((stackId) => ({
          key: stackId,
          value: withValIf(
            this.restorableMinimizedStacks.filter(
              (stack) => stack.stackId === stackId,
            )[0],
            (stackNode) => get(stackNode.minimizedModals.keysAtom),
            () => {
              return [];
            },
          ),
        })),
      );

      return restorableMinimizedStacksModalIds;
    });

    this.restorableMinimizedStacksModalTitles = atom((get) => {
      const restorableMinimizedStacksModalIds = get(
        this.restorableMinimizedStacksModalIds,
      );

      const restorableMinimizedStacksModalTitles = mapNumMap(
        restorableMinimizedStacksModalIds,
        (modalIdsArr, stackId) =>
          withValIf(
            this.restorableMinimizedStacks.filter(
              (stack) => stack.stackId === stackId,
            )[0],
            (stackNode) =>
              toNumMap(
                modalIdsArr.map((modalId) => ({
                  key: modalId,
                  value: withValIf(
                    stackNode.minimizedModals.keyedMap.map[modalId],
                    (modalNode) => {
                      const retVal = get(
                        modalNode.nodeData!.args.props.modalTitle,
                      );

                      return retVal;
                    },
                  ),
                })),
              ),
            () =>
              ({}) as {
                [key: number]: string;
              },
          ),
      );

      return restorableMinimizedStacksModalTitles;
    });

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

    this.currentModalIsFadingOut = atom(
      (get) => {
        const currentStackId = get(this.stacks.currentKeyAtom);

        if ((currentStackId ?? null) !== null) {
          const currentStack = this.stacks.keyedMap.map[currentStackId!]?.node;

          if (currentStack) {
            const currentModalIsFadingOut = get(
              currentStack.currentModalIsFadingOutAtom,
            );

            return currentModalIsFadingOut;
          }
        }

        return false;
      },
      (get, set, newValue) => {
        const currentStackId = get(this.stacks.currentKeyAtom);

        if ((currentStackId ?? null) !== null) {
          const currentStack = this.stacks.keyedMap.map[currentStackId!]?.node;

          if (currentStack) {
            set(currentStack.currentModalIsFadingOutAtom, newValue);
          }
        }
      },
    );

    this.currentModalUserMessageAtoms = {
      show: atom(
        (get) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              const show = get(currentStack.currentModalUserMessageAtoms.show);

              return show;
            }
          }

          return 0;
        },
        (get, set, newValue) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              set(currentStack.currentModalUserMessageAtoms.show, newValue);
            }
          }
        },
      ),
      level: atom(
        (get) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              const level = get(
                currentStack.currentModalUserMessageAtoms.level,
              );

              return level;
            }
          }

          return null;
        },
        (get, set, newValue) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              set(currentStack.currentModalUserMessageAtoms.level, newValue);
            }
          }
        },
      ),
      content: atom(
        (get) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              const content = get(
                currentStack.currentModalUserMessageAtoms.content,
              );

              return content;
            }
          }

          return null;
        },
        (get, set, newValue) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              set(currentStack.currentModalUserMessageAtoms.content, newValue);
            }
          }
        },
      ),
      autoCloseMillis: atom(
        (get) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              const autoCloseMillis = get(
                currentStack.currentModalUserMessageAtoms.autoCloseMillis,
              );

              return autoCloseMillis;
            }
          }

          return null;
        },
        (get, set, newValue) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              set(
                currentStack.currentModalUserMessageAtoms.autoCloseMillis,
                newValue,
              );
            }
          }
        },
      ),
      cssClass: atom(
        (get) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              const cssClass = get(
                currentStack.currentModalUserMessageAtoms.cssClass,
              );

              return cssClass;
            }
          }

          return null;
        },
        (get, set, newValue) => {
          const currentStackId = get(this.stacks.currentKeyAtom);

          if ((currentStackId ?? null) !== null) {
            const currentStack =
              this.stacks.keyedMap.map[currentStackId!]?.node;

            if (currentStack) {
              set(currentStack.currentModalUserMessageAtoms.cssClass, newValue);
            }
          }
        },
      ),
    };

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

      currentStack.closeModal(modalId, isLastModal, () => {
        if (isLastModal) {
          this.stacks.unregister(currentStack.stackId);
        }
      });
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
        const idx = this.minimizedStacks.indexOf(currentStack);

        if (idx < 0) {
          this.minimizedStacks.push(currentStack);
        }

        this.stacks.unregister(currentStack.stackId);

        this.store.set(
          this.minimizedStackIds,
          this.minimizedStacks.map((stack) => stack.stackId),
        );

        this.updateRestorableMinimizedStacks();
      });
    }
  }

  restoreMinimizedModals(stackId: number) {
    const stack = this.restorableMinimizedStacks.find(
      (stack) => stack.stackId === stackId,
    );

    if (stack) {
      stack.restoreMinimizedModals();
      const restorableidx = this.restorableMinimizedStacks.indexOf(stack);
      this.restorableMinimizedStacks.splice(restorableidx, 1);
      const idx = this.minimizedStacks.indexOf(stack);
      this.minimizedStacks.splice(idx, 1);
      this.stacks.register(stack, null, stack.stackId);

      this.store.set(
        this.restorableMinimizedStackIds,
        this.restorableMinimizedStacks.map((stack) => stack.stackId),
      );

      this.store.set(
        this.minimizedStackIds,
        this.minimizedStacks.map((stack) => stack.stackId),
      );
    }
  }

  updateRestorableMinimizedStacks(currentUrl?: ParsedUrl | NullOrUndef) {
    currentUrl ??= defaultUrlSerializer.value.deserializeUrl(location.href);

    this.restorableMinimizedStacks = this.minimizedStacks.filter((stack) =>
      stack.canActivate(currentUrl),
    );

    this.store.set(
      this.restorableMinimizedStackIds,
      this.restorableMinimizedStacks.map((stack) => stack.stackId),
    );

    return this.restorableMinimizedStacks;
  }

  clearRestorableMinimizedStacks() {
    this.restorableMinimizedStacks = [];
    this.store.set(this.restorableMinimizedStackIds, []);
  }

  disposeCore() {}
}

export const defaultTrmrkAppModalService = new RefLazyValue(
  () => new TrmrkAppModalService(),
);

export const useCurrentModalUserMessage = (
  appModalService?: TrmrkAppModalService | NullOrUndef,
): UseUserMessageAtoms<() => React.ReactNode> =>
  withVal(
    appModalService ?? defaultTrmrkAppModalService.value,
    (appModalService) => ({
      show: trmrkUseAtom(appModalService.currentModalUserMessageAtoms.show),
      level: trmrkUseAtom(appModalService.currentModalUserMessageAtoms.level),
      content: trmrkUseAtom(
        appModalService.currentModalUserMessageAtoms.content,
      ),
      autoCloseMillis: trmrkUseAtom(
        appModalService.currentModalUserMessageAtoms.autoCloseMillis,
      ),
      cssClass: trmrkUseAtom(
        appModalService.currentModalUserMessageAtoms.cssClass,
      ),
    }),
  );
