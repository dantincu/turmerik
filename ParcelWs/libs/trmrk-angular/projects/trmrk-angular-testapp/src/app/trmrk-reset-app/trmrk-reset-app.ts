import { Component, ViewChild, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule, MatMenu } from '@angular/material/menu';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TrmrkLoading, TrmrkAppPage } from 'trmrk-angular';
import { TrmrkUserMessage } from 'trmrk-angular';

import { jsonBool } from '../../trmrk/core';
import { TrmrkHorizStrip } from 'trmrk-angular';

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

  constructor(private route: ActivatedRoute, private router: Router) {
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
          localStorage.clear();
          sessionStorage.clear();

          indexedDB.databases().then((databases) => {
            const onComplete = () =>
              (window.location.href = '/app/reset-app?reset=false');

            databases = databases.filter((db) => (db.name ?? null) !== null);

            if (databases.length) {
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
    this.router.navigate(['/app/reset-app']);
  }
}
