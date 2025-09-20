import { Component, OnDestroy, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { AppService } from './services/app-service';
import { openDialog, DialogPanelSize } from '../trmrk-angular/services/common/trmrk-dialog';
import { AppServiceBase } from '../trmrk-angular/services/common/app-service-base';
import { TrmrkAppSetupModal } from './components/common/trmrk-app-setup-modal/trmrk-app-setup-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  private setupOkValueSubscription: Subscription;

  constructor(
    @Inject(AppServiceBase) private appService: AppService,
    private appSetupDialog: MatDialog
  ) {
    this.setupOkValue = this.setupOkValue.bind(this);

    this.setupOkValueSubscription = appService.appStateService.setupOk.subscribe((setupOk) => {
      this.setupOkValue(setupOk);
    });

    if (!appService.appStateService.setupOk.value) {
      setTimeout(() => {
        this.setupOkValue(false);
      });
    }
  }

  ngOnDestroy(): void {
    this.setupOkValueSubscription.unsubscribe();
  }

  setupOkValue(setupOk: boolean) {
    if (!setupOk) {
      openDialog({
        matDialog: this.appSetupDialog,
        dialogComponent: TrmrkAppSetupModal,
        data: {
          data: {},
        },
        dialogPanelSize: DialogPanelSize.Default,
      });
    }
  }
}
