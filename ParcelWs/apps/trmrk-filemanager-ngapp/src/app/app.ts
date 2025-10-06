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
  private setupOkValueSubscription: Subscription;
  private appSetupDialogRef: MatDialogRef<unknown, any> | null = null;
  private keyboardShortcutSubscriptions: Subscription[] = [];

  constructor(
    @Inject(AppServiceBase) private appService: AppService,
    private appSetupDialog: MatDialog,
    private keyboardShortcutService: KeyboardShortcutService,
    private componentIdService: ComponentIdService,
    private keyboardServiceRegistrar: KeyboardServiceRegistrar
  ) {
    this.id = this.componentIdService.getNextId();
    this.setupOk = this.setupOk.bind(this);

    this.setupOkValueSubscription = appService.appStateService.setupOk.subscribe((setupOk) => {
      this.setupOk(setupOk);
    });

    if (!appService.appStateService.setupOk.value) {
      setTimeout(() => {
        this.setupOk(false);
      });
    }

    this.setupKeyboardShortcuts();
  }

  ngOnDestroy(): void {
    this.setupOkValueSubscription.unsubscribe();

    this.keyboardShortcutService.unregisterAndUnsubscribeFromScopes(
      this.id,
      this.keyboardShortcutSubscriptions
    );
  }

  setupOk(setupOk: boolean) {
    if (!setupOk && !this.appService.appStateService.performingSetup.value) {
      this.appService.appStateService.performingSetup.next(true);

      this.appSetupDialogRef = openDialog<TrmrkAppSetupDialogComponentData>({
        matDialog: this.appSetupDialog,
        dialogComponent: TrmrkAppSetupModal,
        data: {
          data: {
            optionChosen: (option) => {
              this.appService.currentDriveStorageOption = option;
              this.appService.appStateService.setupOk.next(true);
            },
          },
        },
        dialogPanelSize: DialogPanelSize.Default,
      });

      const subscription = this.appSetupDialogRef.afterClosed().subscribe(() => {
        this.appSetupDialogRef = null;
        subscription.unsubscribe();
        this.appService.appStateService.performingSetup.next(false);
      });
    }
  }

  setupKeyboardShortcuts() {
    return runOnceWhenValueIs(this.keyboardServiceRegistrar.shortcutsReady, true, () => {
      this.keyboardShortcutSubscriptions.push(
        ...this.keyboardShortcutService.registerAndSubscribeToScopes(
          {
            componentId: this.id,
            considerShortcutPredicate: () => this.appService.appStateService.performingSetup.value,
          },
          {
            [keyboardShortcutScopes.appSetupModal]: {
              [keyboardShortcutKeys.closeAppSetupModal]: () => {
                this.appSetupDialogRef?.close();
              },
            },
          }
        )
      );
    });
  }
}
