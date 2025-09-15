import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { jsonBool } from '../../../trmrk/core';
import { replaceQueryParams } from '../../../trmrk/url';

import { AppStateServiceBase } from '../../services/app-state-service-base';

export interface TrmrkResetAppServiceInitArgs {
  route: ActivatedRoute;
}

@Injectable({
  providedIn: 'root',
})
export class TrmrkResetAppService implements OnDestroy {
  private routeSub!: Subscription;
  private route!: ActivatedRoute;

  isResetting: boolean | null = null;
  showSuccessMessage = 0;
  showTopHorizStrip = true;

  constructor(public router: Router, private appStateService: AppStateServiceBase) {}

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  init(args: TrmrkResetAppServiceInitArgs) {
    this.route = args.route;

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
              // window.location.replace(`${url}?reset=false`);
              this.router.navigate([url], { queryParams: { reset: 'false' }, replaceUrl: true });
            };

            databases = databases.filter((db) =>
              db.name?.startsWith(this.appStateService.dbObjNamePrefix)
            );

            if (!databases.length) {
              onComplete();
            } else {
              const promises = databases.map((db) => indexedDB.deleteDatabase(db.name!));

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

  successMessageClose() {
    const url = replaceQueryParams('', null, false);
    this.router.navigate([url], {
      replaceUrl: true,
    });
  }
}
