import { Injectable, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { NullOrUndef } from '../../../trmrk/core';
import { ModalIdService } from './modal-id-service';
import { AppServiceBase } from './app-service-base';
import { updateModalVisibility, TrmrkDialogComponentDataCore } from './trmrk-dialog';

export interface ModalServiceSetupArgs {
  hostEl: () => HTMLElement;
  modalType: string;
  onCloseModal: () => void;
  data: TrmrkDialogComponentDataCore;
}

@Injectable()
export class ModalService implements OnDestroy {
  private _modalId: number;
  private currentModalIdChangedSubscription: Subscription;
  private closeModalSubscription: Subscription;
  private closeAllModalsSubscription: Subscription;
  private hostEl!: () => HTMLElement;
  private onCloseModal!: () => void;

  constructor(private modalIdService: ModalIdService, private appService: AppServiceBase) {
    this._modalId = modalIdService.getNextId();

    this.currentModalIdChangedSubscription = appService.appStateService.currentModalId.subscribe(
      (currentModalId) => {
        setTimeout(() => {
          updateModalVisibility(this.hostEl(), this.modalId === currentModalId);
        });
      }
    );

    this.closeModalSubscription = appService.onCloseModal.subscribe((modalId) => {
      if (this.modalId === modalId) {
        this.closeModal();
      }
    });

    this.closeAllModalsSubscription = appService.onCloseAllModals.subscribe(() => {
      this.closeModal();
    });
  }

  get modalId() {
    return this._modalId;
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  setup(args: ModalServiceSetupArgs) {
    this.hostEl = args.hostEl;
    this.onCloseModal = args.onCloseModal;

    this.appService.registerModal({
      modalId: this.modalId,
      modalType: args.modalType,
    });

    if (args.data.modalIdAvailable) {
      args.data.modalIdAvailable(this.modalId);
    }
  }

  closeModal() {
    this.onCloseModal();
    updateModalVisibility(this.hostEl(), true);
  }

  destroy() {
    this.currentModalIdChangedSubscription.unsubscribe();
    this.closeModalSubscription.unsubscribe();
    this.closeAllModalsSubscription.unsubscribe();
    this.hostEl = null!;
    this.onCloseModal = null!;
  }
}
