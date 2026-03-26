import { atom, PrimitiveAtom, Atom, getDefaultStore } from "jotai";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import {
  NullOrUndef,
  RefLazyValue,
  withValIf,
  actWithValIf,
  MtblRefValue,
} from "@/src/trmrk/core";

import { TrmrkDisposableBase } from "@/src/trmrk/TrmrkDisposableBase";
import { defaultComponentIdService } from "@/src/trmrk/services/ComponentIdService";
import { defaultAnimationDurationMillis } from "@/src/trmrk-browser/core";

import {
  IntKeyedComponentsMapManager,
  createIntKeyedComponentsMapManager,
} from "../../services/IntKeyedComponentsMapManager";

import { IntKeyedNode } from "../defs/common";
import { JotaiStore } from "../../services/jotai/core";
import { updateRef } from "../../services/utils";

export interface TrmrkPopoverPropsCore {
  rootElRef?: React.Ref<HTMLDivElement>;
  popoverTitle: PrimitiveAtom<string>;
  canCloseManually?: boolean | PrimitiveAtom<boolean> | NullOrUndef;
}

export interface TrmrkPopoverPropsCoreWithData<
  TPopoverData = any,
> extends TrmrkPopoverPropsCore {
  data: TPopoverData;
  popoverId: number;
}

export type TrmrkPopoverNodeFactory<TPopoverData> = (
  props: TrmrkPopoverPropsCoreWithData<TPopoverData>,
) => React.ReactNode;

export interface TrmrkPopoverArgs<TPopoverData> {
  props: TrmrkPopoverPropsCore;
  data?: TPopoverData | NullOrUndef;
  popover: TrmrkPopoverNodeFactory<TPopoverData>;
  anchorElAtom: PrimitiveAtom<HTMLElement | null>;
  sameWidthAsAnchorEl?: boolean | NullOrUndef;
  backdropCssClass?: string | NullOrUndef;
}

export interface TrmrkPopoverData<TPopoverData> {
  props: TrmrkPopoverPropsCoreWithData<TPopoverData>;
  args: TrmrkPopoverArgs<TPopoverData>;
  data: TPopoverData;
  canCloseManually: PrimitiveAtom<boolean>;
  isMaximized: PrimitiveAtom<boolean>;
  placeOnTop: PrimitiveAtom<boolean>;
  placeOnLeft: PrimitiveAtom<boolean>;
  rootElRef: MtblRefValue<HTMLDivElement | null>;
  rootElResizeObserver: ResizeObserver;
  anchorElRef: MtblRefValue<HTMLElement | null>;
  anchorElResizeObserver: ResizeObserver;
  isPlacingPopover: boolean;
  updatePopoverPositionCallback: () => void;
  anchorElAtomUnsubscribe: () => void;
}

export class TrmrkPopoverService extends TrmrkDisposableBase {
  openPopovers: IntKeyedComponentsMapManager<
    TrmrkPopoverNodeFactory<any>,
    TrmrkPopoverData<any>
  >;

  isClosingPopovers: PrimitiveAtom<boolean>;
  canCloseCurrentPopoverManuallyAtom: Atom<boolean>;
  canCloseAllPopoversManuallyAtom: Atom<boolean>;
  currentPopoverIsMaximizedAtom: PrimitiveAtom<boolean>;
  currentPopoverIsFadingOutAtom: PrimitiveAtom<boolean>;
  currentPopoverIsPlacedOnTop: Atom<boolean>;
  currentPopoverIsPlacedOnLeft: Atom<boolean>;
  currentPopoverAnchorEl: PrimitiveAtom<HTMLElement | null>;

  readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    super();

    this.openPopovers = createIntKeyedComponentsMapManager<
      TrmrkPopoverNodeFactory<any>,
      TrmrkPopoverData<any>
    >();

    this.isClosingPopovers = atom(false);
    this.store = store ?? getDefaultStore();

    this.canCloseCurrentPopoverManuallyAtom = atom((get) => {
      let canCloseCurrentModalManuallyAtom = false;
      const currentModalKey = get(this.openPopovers.currentKeyAtom);

      if ((currentModalKey ?? null) !== null) {
        const currentPopover =
          this.openPopovers.keyedMap.map[currentModalKey!]?.nodeData;

        if (currentPopover) {
          canCloseCurrentModalManuallyAtom = get(
            currentPopover.canCloseManually,
          );
        }
      }

      return canCloseCurrentModalManuallyAtom;
    });

    this.canCloseAllPopoversManuallyAtom = atom((get) => {
      const keysArr = get(this.openPopovers.keysAtom);

      const canCloseAllModalsManually = keysArr
        .map((key) =>
          get(this.openPopovers.keyedMap.map[key].nodeData!.canCloseManually),
        )
        .reduce((can1, can2) => can1 && can2, true);

      return canCloseAllModalsManually;
    });

    this.currentPopoverIsMaximizedAtom = atom(
      (get) => {
        const currentModalKey = get(this.openPopovers.currentKeyAtom);

        if ((currentModalKey ?? null) !== null) {
          const currentPopover =
            this.openPopovers.keyedMap.map[currentModalKey!];

          if (currentPopover) {
            const isMaximized = get(currentPopover.nodeData!.isMaximized);

            return isMaximized;
          }
        }

        return false;
      },
      (get, set, newValue) => {
        const currentModalKey = get(this.openPopovers.currentKeyAtom);

        if ((currentModalKey ?? null) !== null) {
          const currentPopover =
            this.openPopovers.keyedMap.map[currentModalKey!];

          if (currentPopover) {
            set(currentPopover.nodeData!.isMaximized, newValue);
          }
        }
      },
    );

    this.currentPopoverIsFadingOutAtom = atom(false);

    this.currentPopoverIsPlacedOnTop = atom<boolean>((get) => {
      let currentPopoverIsPlacedOnTop = false;
      const currentModalKey = get(this.openPopovers.currentKeyAtom);

      if ((currentModalKey ?? null) !== null) {
        const currentPopover =
          this.openPopovers.keyedMap.map[currentModalKey!]?.nodeData;

        if (currentPopover) {
          currentPopoverIsPlacedOnTop = get(currentPopover.placeOnTop);
        }
      }

      return currentPopoverIsPlacedOnTop;
    });

    this.currentPopoverIsPlacedOnLeft = atom<boolean>((get) => {
      let currentPopoverIsPlacedOnLeft = false;
      const currentModalKey = get(this.openPopovers.currentKeyAtom);

      if ((currentModalKey ?? null) !== null) {
        const currentPopover =
          this.openPopovers.keyedMap.map[currentModalKey!]?.nodeData;

        if (currentPopover) {
          currentPopoverIsPlacedOnLeft = get(currentPopover.placeOnLeft);
        }
      }

      return currentPopoverIsPlacedOnLeft;
    });

    this.currentPopoverAnchorEl = atom(
      (get) => {
        const currentModalKey = get(this.openPopovers.currentKeyAtom);

        if ((currentModalKey ?? null) !== null) {
          const currentPopover =
            this.openPopovers.keyedMap.map[currentModalKey!];

          if (currentPopover) {
            const currentPopoverAnchorEl = get(
              currentPopover.nodeData!.args.anchorElAtom,
            );
            return currentPopoverAnchorEl;
          }
        }

        return null;
      },
      (get, set, newValue) => {
        const currentModalKey = get(this.openPopovers.currentKeyAtom);

        if ((currentModalKey ?? null) !== null) {
          const currentPopover =
            this.openPopovers.keyedMap.map[currentModalKey!];

          if (currentPopover) {
            set(currentPopover.nodeData!.args.anchorElAtom, newValue);
          }
        }
      },
    );
  }

  disposeCore() {}

  canClosePopoverManually(popoverId: number) {
    const popover = this.openPopovers.keyedMap.map[popoverId];

    const canCloseModal =
      withValIf(popover?.nodeData!.canCloseManually, (canCloseManually) =>
        this.store.get(canCloseManually),
      ) ?? true;

    return canCloseModal;
  }

  canCloseAllPopoversManually() {
    const canCloseAllPopoversManually = this.store.get(
      this.canCloseAllPopoversManuallyAtom,
    );

    return canCloseAllPopoversManually;
  }

  unregisterPopoverEvents<TPopoverData>(
    nodeData: TrmrkPopoverData<TPopoverData> | number | NullOrUndef,
  ) {
    if ((nodeData ?? null) !== null) {
      if ("number" === typeof nodeData) {
        nodeData = this.openPopovers.keyedMap.map[nodeData]?.nodeData;
      }

      nodeData!.anchorElResizeObserver.disconnect();
      nodeData!.rootElResizeObserver.disconnect();
      nodeData!.anchorElAtomUnsubscribe();

      window.removeEventListener(
        "resize",
        nodeData!.updatePopoverPositionCallback,
      );
    }
  }

  unregisterCurrentPopoverEvents() {
    this.unregisterPopoverEvents(this.openPopovers.getCurrentKey());
  }

  openPopover<TPopoverData>(args: TrmrkPopoverArgs<TPopoverData>) {
    this.unregisterCurrentPopoverEvents();
    const popoverId = defaultComponentIdService.value.getNextId();
    const data = args.data ?? ({} as TPopoverData);
    let canCloseManually = args.props.canCloseManually ?? true;

    if ("object" !== typeof canCloseManually) {
      canCloseManually = atom(canCloseManually);
    }

    const rootElRefObj: MtblRefValue<HTMLDivElement | null> = {
      value: null,
    };

    const anchorElRefObj: MtblRefValue<HTMLElement | null> = {
      value: this.store.get(args.anchorElAtom),
    };

    const placeOnTop = atom(false);
    const placeOnLeft = atom(false);

    const anchorElAtomSubscription = this.store.sub(args.anchorElAtom, () => {
      anchorElResizeObserver.disconnect();
      anchorElRefObj.value = this.store.get(args.anchorElAtom);

      actWithValIf(anchorElRefObj.value, (anchorEl) => {
        anchorElResizeObserver.observe(anchorEl);
        updatePopoverPositionCallback();
      });
    });

    const updatePopoverPositionCallback = () => {
      actWithValIf(rootElRefObj.value, (rootEl) => {
        actWithValIf(anchorElRefObj.value, (anchorEl) => {
          if (!nodeData.isPlacingPopover) {
            nodeData.isPlacingPopover = true;
            const vpWidth = window.innerWidth;
            const vpHeight = window.innerHeight;
            const vpHalfWidth = Math.round(vpWidth / 2);
            const vpHalfHeight = Math.round(vpHeight / 2);

            const anchorElRectangle = anchorEl.getBoundingClientRect();
            let rootElWidth = rootEl.offsetWidth;
            let rootElHeight = rootEl.offsetHeight;

            if (args.sameWidthAsAnchorEl) {
              rootElWidth = Math.min(vpWidth, anchorElRectangle.width);
              rootEl.style.width = `${rootElWidth}px`;
            }

            let left = anchorElRectangle.x;
            let top = anchorElRectangle.y;
            let shouldPlaceOnLeft = left > vpHalfWidth;
            let shouldPlaceOnTop = top > vpHalfHeight;

            if (shouldPlaceOnLeft) {
              left -= rootElWidth - anchorElRectangle.width;
            }

            if (shouldPlaceOnTop) {
              top -= rootElHeight - anchorElRectangle.height;
            }

            left = Math.min(left, vpWidth - rootElWidth);
            top = Math.min(top, vpHeight - rootElHeight);
            left = Math.max(left, 0);
            top = Math.max(top, 0);

            rootEl.style.left = `${left}px`;
            rootEl.style.top = `${top}px`;

            this.store.set(placeOnLeft, shouldPlaceOnLeft);
            this.store.set(placeOnTop, shouldPlaceOnTop);

            setTimeout(() => {
              nodeData.isPlacingPopover = false;
            });
          }
        });
      });
    };

    const rootElResizeObserver = new ResizeObserver(
      updatePopoverPositionCallback,
    );
    const anchorElResizeObserver = new ResizeObserver(
      updatePopoverPositionCallback,
    );

    window.addEventListener("resize", updatePopoverPositionCallback);

    const rootElAvailable: React.Ref<HTMLDivElement> = (el) => {
      rootElResizeObserver.disconnect();
      rootElRefObj.value = el;

      actWithValIf(el, (rootEl) => {
        rootElResizeObserver.observe(rootEl);
        updatePopoverPositionCallback();
      });

      actWithValIf(args.props.rootElRef, (ref) => updateRef(ref, el));
    };

    const nodeData: TrmrkPopoverData<TPopoverData> = {
      props: {
        popoverId,
        data,
        popoverTitle: args.props.popoverTitle,
        rootElRef: rootElAvailable,
      },
      args,
      data,
      isMaximized: atom(false),
      canCloseManually,
      placeOnTop,
      placeOnLeft,
      rootElRef: rootElRefObj,
      rootElResizeObserver,
      anchorElRef: anchorElRefObj,
      anchorElResizeObserver,
      isPlacingPopover: false,
      updatePopoverPositionCallback,
      anchorElAtomUnsubscribe: anchorElAtomSubscription,
    };

    this.store.set(this.isClosingPopovers, () => false);
    const alreadyHasModals = this.openPopovers.getKeys().length > 0;

    if (alreadyHasModals) {
      this.store.set(this.currentPopoverIsFadingOutAtom, () => true);

      setTimeout(() => {
        this.store.set(this.currentPopoverIsFadingOutAtom, () => false);
        this.openPopovers.register(args.popover, null, popoverId, nodeData);
      }, defaultAnimationDurationMillis);
    } else {
      this.openPopovers.register(args.popover, null, popoverId, nodeData);
    }

    return popoverId;
  }

  closePopover(
    popoverId: number,
    isLastPopover?: boolean | NullOrUndef,
    callback?: (() => void) | NullOrUndef,
  ) {
    isLastPopover ??= this.openPopovers.getKeys().length === 1;
    this.store.set(this.currentPopoverIsFadingOutAtom, () => true);

    if (isLastPopover) {
      this.store.set(this.isClosingPopovers, () => true);
    }

    setTimeout(() => {
      this.store.set(this.currentPopoverIsFadingOutAtom, () => false);

      const popoverData = this.openPopovers.unregister(
        popoverId,
        true,
      )?.nodeData;

      this.unregisterPopoverEvents(popoverData);
      callback?.();
    }, defaultAnimationDurationMillis);
  }

  closeCurrentPopover(
    popoverIdsArr?: number[] | NullOrUndef,
    callback?: (() => void) | NullOrUndef,
  ) {
    popoverIdsArr ??= this.openPopovers.getKeys();
    const popoverId = popoverIdsArr[popoverIdsArr.length - 1];
    this.closePopover(popoverId, popoverIdsArr.length === 1, callback);
  }

  closeAllPopoversManually(
    callback?:
      | ((removed: {
          [key: number]: IntKeyedNode<
            TrmrkPopoverNodeFactory<any>,
            TrmrkPopoverData<any>
          >;
        }) => void)
      | NullOrUndef,
  ) {
    if (this.canCloseAllPopoversManually()) {
      this.store.set(this.isClosingPopovers, () => true);

      setTimeout(() => {
        this.unregisterCurrentPopoverEvents();
        const replaced = this.openPopovers.replaceAll({});
        callback?.(replaced);
      }, defaultAnimationDurationMillis);
    }
  }
}

export const defaultTrmrkPopoverService = new RefLazyValue(
  () => new TrmrkPopoverService(),
);
