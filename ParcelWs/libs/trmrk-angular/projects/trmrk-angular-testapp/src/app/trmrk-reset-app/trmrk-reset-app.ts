import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TrmrkLoading } from 'trmrk-angular';
import { TrmrkUserMessage } from 'trmrk-angular';

import { jsonBool } from '../../trmrk/core';

@Component({
  selector: 'app-trmrk-reset-app',
  imports: [
    TrmrkLoading,
    RouterLink,
    MatIconModule,
    CommonModule,
    MatButtonModule,
    TrmrkUserMessage,
  ],
  templateUrl: './trmrk-reset-app.html',
  styleUrl: './trmrk-reset-app.scss',
})
export class TrmrkResetApp implements OnDestroy {
  isResetting: boolean | null = null;
  showSuccessMessage = 0;
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
        setTimeout(() => {
          localStorage.clear();
          sessionStorage.clear();

          indexedDB.databases().then((databases) => {
            for (let db of databases) {
              if (db.name) {
                indexedDB.deleteDatabase(db.name);
              }
            }

            window.location.href = '/reset-app?reset=false';
          });
        }, 0);
      } else if (this.isResetting === false) {
        this.showSuccessMessage++;
      } else {
        this.showSuccessMessage = 0;
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
