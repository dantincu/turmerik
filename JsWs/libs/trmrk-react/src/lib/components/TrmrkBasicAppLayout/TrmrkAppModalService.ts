import { atom, PrimitiveAtom, Atom } from "jotai";

import { NullOrUndef, RefLazyValue, MtblRefValue } from "@/src/trmrk/core";
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

  constructor() {
    super();

    this.minimizedModals = createIntKeyedComponentsMapManager<
      TrmrkAppModalNodeFactory,
      TrmrkAppModalData
    >();

    this.openModals = createIntKeyedComponentsMapManager<
      TrmrkAppModalNodeFactory,
      TrmrkAppModalData
    >();
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
    return modalId;
  }

  closeModal(modalId: number) {
    return this.openModals.unregister(modalId);
  }

  closeCurrentModal() {
    const openModalsIdsArr = this.openModals.getCurrentKeys();
    const modalId = openModalsIdsArr[openModalsIdsArr.length - 1];
    return this.openModals.unregister(modalId);
  }

  minimizeAllModals() {
    if (Object.keys(this.minimizedModals.keyedMap.map).length === 0) {
      const openModalsMap = this.openModals.replaceAll({});
      this.minimizedModals.replaceAll(openModalsMap);
    }
  }
}

export const defaultTrmrkAppModalService = new RefLazyValue(
  () => new TrmrkAppModalService(),
);
