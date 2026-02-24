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
import { JotaiStore, trmrkUseAtom } from "../../services/jotai/core";
import { updateRef } from "../../services/utils";

export interface TrmrkPopoverPropsCore {
  rootElRef?: React.Ref<HTMLDivElement>;
  popoverTitle: PrimitiveAtom<string>;
  canCloseManually?: boolean | PrimitiveAtom<boolean> | NullOrUndef;
}

export interface TrmrkPopoverPropsCoreWithData<
  TPopoverData = any,
> extends TrmrkPopoverPropsCore {
  data: () => TPopoverData;
  popoverId: number;
}

export type TrmrkPopoverNodeFactory<TPopoverData> = (
  props: TrmrkPopoverPropsCoreWithData<TPopoverData>,
) => React.ReactNode;

export interface TrmrkPopoverArgs<TPopoverData> {
  props: TrmrkPopoverPropsCore;
  data?: TPopoverData | NullOrUndef;
  popover: TrmrkPopoverNodeFactory<TPopoverData>;
}

export interface TrmrkPopoverData<TPopoverData> {
  props: TrmrkPopoverPropsCoreWithData<TPopoverData>;
  args: TrmrkPopoverArgs<TPopoverData>;
  data: TPopoverData;
  canCloseManually: PrimitiveAtom<boolean>;
  rootElRef: MtblRefValue<HTMLDivElement | null>;
}

export class TrmrkPopoverService extends TrmrkDisposableBase {
  openPopovers: IntKeyedComponentsMapManager<
    TrmrkPopoverNodeFactory<any>,
    TrmrkPopoverData<any>
  >;

  isClosingPopovers: PrimitiveAtom<boolean>;
  canCloseCurrentPopoverManuallyAtom: Atom<boolean>;
  canCloseAllPopoversManuallyAtom: Atom<boolean>;
  currentPopoverIsFadingOutAtom: PrimitiveAtom<boolean>;

  private readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    super();

    this.openPopovers = createIntKeyedComponentsMapManager<
      TrmrkPopoverNodeFactory<any>,
      TrmrkPopoverData<any>
    >();

    this.isClosingPopovers = atom(false);
    this.store = store ?? getDefaultStore();

    this.canCloseCurrentPopoverManuallyAtom = atom<boolean>((get) => {
      let canCloseCurrentModalManuallyAtom = false;
      const currentModalKey = get(this.openPopovers.currentKeyAtom);

      if ((currentModalKey ?? null) !== null) {
        const currentPopover =
          this.openPopovers.keyedMap.map[currentModalKey!].nodeData!;

        canCloseCurrentModalManuallyAtom = get(currentPopover.canCloseManually);
      }

      return canCloseCurrentModalManuallyAtom;
    });

    this.canCloseAllPopoversManuallyAtom = atom<boolean>((get) => {
      const keysArr = get(this.openPopovers.keysAtom);

      const canCloseAllModalsManually = keysArr
        .map((key) =>
          get(this.openPopovers.keyedMap.map[key].nodeData!.canCloseManually),
        )
        .reduce((can1, can2) => can1 && can2, true);

      return canCloseAllModalsManually;
    });

    this.currentPopoverIsFadingOutAtom = atom(false);
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

  openPopover<TPopoverData>(args: TrmrkPopoverArgs<TPopoverData>) {
    const popoverId = defaultComponentIdService.value.getNextId();
    const data = args.data ?? ({} as TPopoverData);
    let canCloseManually = args.props.canCloseManually ?? true;

    if ("object" !== typeof canCloseManually) {
      canCloseManually = atom(canCloseManually);
    }

    const rootElRefObj: MtblRefValue<HTMLDivElement | null> = {
      value: null,
    };

    const updatePopoverPosition = () => {
      actWithValIf(rootElRefObj.value, (rootEl) => {
        
      });
    };

    const rootElResizeObserver = new ResizeObserver(updatePopoverPosition);

    const rootElAvailable: React.Ref<HTMLDivElement> = (el) => {
      rootElResizeObserver.disconnect();
      rootElRefObj.value = el;

      actWithValIf(el, (rootEl) => {
        rootElResizeObserver.observe(rootEl);
        updatePopoverPosition();
      });

      actWithValIf(args.props.rootElRef, (ref) => updateRef(ref, el));
    };

    const nodeData: TrmrkPopoverData<TPopoverData> = {
      props: {
        popoverId,
        data: () => data,
        popoverTitle: args.props.popoverTitle,
        rootElRef: rootElAvailable,
      },
      args,
      data,
      canCloseManually,
      rootElRef: rootElRefObj,
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
      this.openPopovers.unregister(popoverId, true);
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
        const replaced = this.openPopovers.replaceAll({});
        callback?.(replaced);
      }, defaultAnimationDurationMillis);
    }
  }
}

export const defaultTrmrkPopoverService = new RefLazyValue(
  () => new TrmrkPopoverService(),
);
