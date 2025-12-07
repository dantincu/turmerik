import { Injectable, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Subscription } from 'rxjs';

import { ModalIdService } from './modal-id-service';
import { AppServiceBase } from './app-service-base';
import { updateModalVisibility, TrmrkDialogComponentDataCore } from './trmrk-dialog';

export interface ModalServiceSetupArgs {
  hostEl: () => HTMLElement;
  modalType: string;
  dialogRef: MatDialogRef<any>;
  data: TrmrkDialogComponentDataCore;
}

@Injectable()
export class ModalService implements OnDestroy {
  private _modalId: number;
  private currentModalIdChangedSubscription: Subscription;
  private closeModalSubscription: Subscription;
  private closeAllModalsSubscription: Subscription;
  private modalClosedSubscription: Subscription | null = null;
  private hostEl!: () => HTMLElement;
  dialogRef!: MatDialogRef<any>;

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
    this.dispose();
  }

  setup(args: ModalServiceSetupArgs) {
    this.hostEl = args.hostEl;
    this.dialogRef = args.dialogRef;

    this.modalClosedSubscription = args.dialogRef.afterClosed().subscribe(() => {
      updateModalVisibility(this.hostEl(), true);
    });

    this.appService.registerModal({
      modalId: this.modalId,
      modalType: args.modalType,
    });

    if (args.data.modalIdAvailable) {
      args.data.modalIdAvailable(this.modalId);
    }
  }

  dispose() {
    this.currentModalIdChangedSubscription.unsubscribe();
    this.closeModalSubscription.unsubscribe();
    this.closeAllModalsSubscription.unsubscribe();
    this.modalClosedSubscription?.unsubscribe();
    this.modalClosedSubscription = null;
    this.hostEl = null!;
    this.dialogRef = null!;
  }

  private closeModal() {
    this.dialogRef?.close();
  }
}
