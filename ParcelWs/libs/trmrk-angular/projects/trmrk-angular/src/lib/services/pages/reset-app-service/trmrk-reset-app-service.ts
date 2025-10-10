import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { jsonBool, NullOrUndef } from '../../../../trmrk/core';
import { replaceQueryParams } from '../../../../trmrk/url';

import { getIDbRequestOpenErrorMsg } from '../../../../trmrk-browser/indexedDB/core';

import { AppStateServiceBase } from '../../common/app-state-service-base';
import { AppServiceBase } from '../../common/app-service-base';

import { DeleteAppStorageService } from '../../common/delete-app-storage-service';

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
  showErrorMessage = 0;
  errorMessage: string | NullOrUndef;
  showTopHorizStrip = true;

  constructor(
    public router: Router,
    private appStateService: AppStateServiceBase,
    private appService: AppServiceBase,
    private resetAppService: DeleteAppStorageService
  ) {}

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
        this.errorMessage = null;
        this.showErrorMessage = 0;
        this.showTopHorizStrip = true;

        setTimeout(async () => {
          try {
            await this.resetAppService.deleteStorage(this.appService.getAppObjectKey([]));
            this.appService.onAppReset.emit();

            if (this.appStateService.defaults.appResetTriggersSetup) {
              this.appStateService.performAppSetup.next(false);
            }

            const url = replaceQueryParams('', null, false);

            this.router.navigate([url], {
              queryParams: { reset: 'false' },
              replaceUrl: true,
            });
          } catch (err) {
            this.isResetting = null;
            this.errorMessage = getIDbRequestOpenErrorMsg(err as DOMException);
            this.showErrorMessage++;
            this.showTopHorizStrip = true;
          }
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

  closeError() {
    this.errorMessage = null;
    this.showErrorMessage = 0;
    this.showTopHorizStrip = false;
    this.navToBaseRoute();
  }

  navToBaseRoute() {
    const url = replaceQueryParams('', null, false);
    this.router.navigate([url], {
      replaceUrl: true,
    });
  }
}
