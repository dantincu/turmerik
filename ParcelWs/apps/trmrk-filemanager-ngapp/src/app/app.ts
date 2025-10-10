import { Component, OnDestroy, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { openDialog, DialogPanelSize } from '../trmrk-angular/services/common/trmrk-dialog';
import { AppServiceBase } from '../trmrk-angular/services/common/app-service-base';
import { KeyboardShortcutService } from '../trmrk-angular/services/common/keyboard-shortcut-service';
import { ComponentIdService } from '../trmrk-angular/services/common/component-id-service';
import { runOnceWhenValueIs } from '../trmrk-angular/services/common/TrmrkObservable';
import { KeyboardServiceRegistrar } from './services/common/keyboard-service-registrar';

import {
  keyboardShortcutKeys,
  keyboardShortcutScopes,
} from './services/common/keyboard-service-registrar';

import { AppService } from './services/common/app-service';

import {
  TrmrkAppSetupModal,
  TrmrkAppSetupDialogComponentData,
} from './components/common/trmrk-app-setup-modal/trmrk-app-setup-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  id: number;
  setupModalId: number | null = null;
  private setupModalIsShown = false;
  private performAppSetupSubscription: Subscription;
  private keyboardShortcutSubscriptions: Subscription[] = [];

  constructor(
    @Inject(AppServiceBase) private appService: AppService,
    private appSetupDialog: MatDialog,
    private keyboardShortcutService: KeyboardShortcutService,
    private componentIdService: ComponentIdService,
    private keyboardServiceRegistrar: KeyboardServiceRegistrar
  ) {
    this.id = this.componentIdService.getNextId();
    this.toggleAppSetupModal = this.toggleAppSetupModal.bind(this);

    this.performAppSetupSubscription = appService.appStateSvc.performAppSetup.subscribe((show) => {
      this.toggleAppSetupModal(show);
    });

    setTimeout(() => {
      appService.appStateSvc.performAppSetup.next(true);
    });

    this.setupKeyboardShortcuts();
  }

  ngOnDestroy(): void {
    this.performAppSetupSubscription.unsubscribe();

    this.keyboardShortcutService.unregisterAndUnsubscribeFromScopes(
      this.id,
      this.keyboardShortcutSubscriptions
    );
  }

  toggleAppSetupModal(show: boolean) {
    if (show !== this.setupModalIsShown) {
      this.setupModalIsShown = show;

      if (show) {
        this.appService.appStateSvc.performAppSetup.next(true, true);

        const appSetupDialogRef = openDialog<TrmrkAppSetupDialogComponentData>({
          matDialog: this.appSetupDialog,
          dialogComponent: TrmrkAppSetupModal,
          data: {
            data: {
              modalIdAvailable: (modalId) => (this.setupModalId = modalId),
              optionChosen: (option) => {
                this.appService.currentDriveStorageOption = option;
                this.appService.appStateService.performAppSetup.next(false);
                this.appService.appStateService.hasBeenSetUp.next(true, true);
              },
              errorMessage: this.appService.appStateSvc.appSetupModalErrorMsg.value,
            },
          },
          dialogPanelSize: DialogPanelSize.Default,
        });

        const subscription = appSetupDialogRef.afterClosed().subscribe(() => {
          this.setupModalId = null;
          subscription.unsubscribe();
          this.appService.appStateSvc.performAppSetup.next(false, true);
        });
      } else {
        this.closeSetupModal();
      }
    }
  }

  closeSetupModal() {
    if (this.setupModalId) {
      this.setupModalIsShown = false;
      this.appService.closeModal(this.setupModalId);
    }
  }

  setupKeyboardShortcuts() {
    return runOnceWhenValueIs(this.keyboardServiceRegistrar.shortcutsReady, true, () => {
      this.keyboardShortcutSubscriptions.push(
        ...this.keyboardShortcutService.registerAndSubscribeToScopes(
          {
            componentId: this.id,
            considerShortcutPredicate: () => this.appService.appStateService.performAppSetup.value,
          },
          {
            [keyboardShortcutScopes.appSetupModal]: {
              [keyboardShortcutKeys.closeAppSetupModal]: () => {
                this.closeSetupModal();
              },
            },
          }
        )
      );
    });
  }
}
