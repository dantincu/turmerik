import { Component, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  TrmrkLoading,
  TrmrkAppPage,
  TrmrkUserMessage,
  TrmrkHorizStrip,
  AppStateServiceBase,
} from 'trmrk-angular';

import { jsonBool } from '../../../../trmrk/core';

@Component({
  selector: 'trmrk-reset-app',
  imports: [
    TrmrkLoading,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    TrmrkUserMessage,
    MatMenuModule,
    TrmrkHorizStrip,
    TrmrkAppPage,
  ],
  templateUrl: './trmrk-reset-app.html',
  styleUrl: './trmrk-reset-app.scss',
})
export class TrmrkResetApp implements OnDestroy {
  @ViewChild(MatMenu) optionsMenu!: MatMenu;

  isResetting: boolean | null = null;
  showSuccessMessage = 0;
  showTopHorizStrip = true;
  private routeSub: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appStateService: AppStateServiceBase
  ) {
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const resetParam = params.get('reset');

      if (resetParam === jsonBool.true) {
        this.isResetting = true;
      } else if (resetParam === jsonBool.false) {
        this.isResetting = false;
      } else {
        this.isResetting = null;
      }

      if (this.isResetting) {
        this.showTopHorizStrip = true;

        setTimeout(() => {
          for (let storage of [localStorage, sessionStorage]) {
            for (let i = 0; i < storage.length; i++) {
              const key = storage.key(i);

              if (key?.startsWith(this.appStateService.dbObjNamePrefix)) {
                storage.removeItem(key);
              }
            }
          }

          indexedDB.databases().then((databases) => {
            const onComplete = () =>
              (window.location.href = '/reset-app?reset=false');

            databases = databases.filter((db) =>
              db.name?.startsWith(this.appStateService.dbObjNamePrefix)
            );

            if (!databases.length) {
              onComplete();
            } else {
              const promises = databases.map((db) =>
                indexedDB.deleteDatabase(db.name!)
              );

              Promise.all(promises).then(onComplete);
            }
          });
        }, 0);
      } else if (this.isResetting === false) {
        this.showSuccessMessage++;
        this.showTopHorizStrip = true;
      } else {
        this.showSuccessMessage = 0;
        this.showTopHorizStrip = false;
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  successMessageClose() {
    this.router.navigate(['/reset-app']);
  }
}
