import { atom, PrimitiveAtom, getDefaultStore } from "jotai";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { NullOrUndef, RefLazyValue } from "@/src/trmrk/core";
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

import { JotaiStore } from "../../services/jotai/core";

export const MODAL_FADE_MILLIS = 300;

export enum ModalCloseKind {
  Button,
  Programatically,
}

export type TrmrkAppModalNodeFactory = (modalId: number) => React.ReactNode;

export interface ModalClosedEvent {
  modalId: number;
  modalData: TrmrkAppModalData;
  closeKind: ModalCloseKind;
  minimized: boolean;
}

export type ModalClosedEventHandler = (event: ModalClosedEvent) => void;

export interface TrmrkAppModalArgs {
  modal: TrmrkAppModalNodeFactory;
  closed?: ModalClosedEventHandler | NullOrUndef;
  urlTransformer?: (url: ParsedUrl) => ParsedUrl | NullOrUndef;
  activator?: (
    data: TrmrkAppModalData,
    currentUrl: ParsedUrl,
  ) => boolean | NullOrUndef;
}

export interface TrmrkAppModalData {
  modalId: number;
  args: TrmrkAppModalArgs;
  refUrl: ParsedUrl;
}

export class TrmrkAppModalService extends TrmrkDisposableBase {
  minimizedModals: IntKeyedComponentsMapManager<
    TrmrkAppModalNodeFactory,
    TrmrkAppModalData
  >;

  openModals: IntKeyedComponentsMapManager<
    TrmrkAppModalNodeFactory,
    TrmrkAppModalData
  >;

  isClosingModals: PrimitiveAtom<boolean>;

  private readonly store: JotaiStore;

  constructor(store?: JotaiStore | NullOrUndef) {
    super();

    this.minimizedModals = createIntKeyedComponentsMapManager<
      TrmrkAppModalNodeFactory,
      TrmrkAppModalData
    >();

    this.openModals = createIntKeyedComponentsMapManager<
      TrmrkAppModalNodeFactory,
      TrmrkAppModalData
    >();

    this.isClosingModals = atom(false);
    this.store = store ?? getDefaultStore();
  }

  disposeCore() {}

  openModal(args: TrmrkAppModalArgs) {
    const modalId = defaultComponentIdService.value.getNextId();
    let refUrl = defaultUrlSerializer.value.deserializeUrl(location.href);
    refUrl = args.urlTransformer?.(refUrl) ?? refUrl;

    const modalData: TrmrkAppModalData = {
      modalId,
      args,
      refUrl,
    };

    this.openModals.register(modalId, args.modal, null, modalData);
    this.store.set(this.isClosingModals, () => false);
    return modalId;
  }

  closeModal(modalId: number) {
    this.store.set(this.isClosingModals, () => true);

    setTimeout(() => {
      this.openModals.unregister(modalId);
    }, MODAL_FADE_MILLIS);
  }

  closeCurrentModal() {
    const modalsIdsArr = this.openModals.getCurrentKeys();
    const modalId = modalsIdsArr[modalsIdsArr.length - 1];
    this.closeModal(modalId);
  }

  minimizeAllModals() {
    const modalsIdsArr = this.minimizedModals.getCurrentKeys();

    if (modalsIdsArr.length === 0) {
      this.store.set(this.isClosingModals, () => true);

      setTimeout(() => {
        const openModalsMap = this.openModals.replaceAll({});
        this.minimizedModals.replaceAll(openModalsMap);
      }, MODAL_FADE_MILLIS);
    }
  }

  restoreMinimizedModals(router: AppRouterInstance) {
    const modalsIdsArr = this.minimizedModals.getCurrentKeys();

    if (modalsIdsArr.length > 0) {
      const minimizedModals = this.minimizedModals.replaceAll([]);

      const currentModal =
        minimizedModals[modalsIdsArr[modalsIdsArr.length - 1]];

      if (currentModal) {
        var newUrl = currentModal.data!.refUrl.relUrlStr;
        router.push(newUrl);

        this.store.set(this.isClosingModals, () => false);
        this.openModals.replaceAll(minimizedModals);
      }
    }
  }
}

export const defaultTrmrkAppModalService = new RefLazyValue(
  () => new TrmrkAppModalService(),
);
