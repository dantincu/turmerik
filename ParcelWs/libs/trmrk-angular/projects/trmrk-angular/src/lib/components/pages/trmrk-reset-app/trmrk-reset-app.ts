import { Component, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AppStateServiceBase } from '../../../services/app-state-service-base';

import { TrmrkHorizStrip } from '../../common/trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkUserMessage } from '../../common/trmrk-user-message/trmrk-user-message';
import { TrmrkLoading } from '../../common/trmrk-loading/trmrk-loading';
import { TrmrkAppPage } from '../../common/trmrk-app-page/trmrk-app-page';

import { jsonBool } from '../../../../trmrk/core';
import { replaceQueryParams } from '../../../../trmrk/url';

@Component({
  selector: 'trmrk-reset-app',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TrmrkAppPage,
    TrmrkUserMessage,
    TrmrkHorizStrip,
    TrmrkLoading,
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
    public router: Router,
    private route: ActivatedRoute,
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
            const onComplete = () => {
              const url = replaceQueryParams('', null, false);
              window.location.href = `${url}?reset=false`;
              // this.router.navigate([url], { queryParams: { reset: 'false' } });
            };

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
    const url = replaceQueryParams('', null, false);
    this.router.navigate([url]);
  }
}
