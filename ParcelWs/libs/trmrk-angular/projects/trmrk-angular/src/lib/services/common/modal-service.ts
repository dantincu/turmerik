import { Injectable, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { ModalIdService } from './modal-id-service';
import { AppStateServiceBase } from './app-state-service-base';
import { handleModalIdChanged } from './trmrk-dialog';

export interface ModalServiceSetupArgs {
  hostEl: () => HTMLElement;
}

@Injectable()
export class ModalService implements OnDestroy {
  private _modalId: number;
  private currentModalIdChangedSubscription: Subscription;
  private hostEl!: () => HTMLElement;

  constructor(
    private modalIdService: ModalIdService,
    private appStateService: AppStateServiceBase
  ) {
    this._modalId = modalIdService.getNextId();

    this.currentModalIdChangedSubscription = appStateService.currentModalId.subscribe(
      (currentModalId) => {
        handleModalIdChanged(this.hostEl(), this.modalId, currentModalId);
      }
    );

    appStateService.currentModalId.next(this.modalId);
  }

  get modalId() {
    return this._modalId;
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  setup(args: ModalServiceSetupArgs) {
    this.hostEl = args.hostEl;
  }

  destroy() {
    this.currentModalIdChangedSubscription.unsubscribe();
    this.hostEl = null!;
  }
}
