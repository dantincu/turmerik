import { Component, Inject, OnDestroy } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkAppIcon } from '../../common/trmrk-app-icon/trmrk-app-icon';
import { AppService } from '../../../services/common/app-service';
import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';
import { commonQueryKeys } from '../../../../trmrk-angular/services/common/url';
import { defaultMainCommonRouteKeys } from '../../../../trmrk-angular/components/pages/routes';

@Component({
  selector: 'trmrk-app-setup-page',
  imports: [MatIconButton, TrmrkAppPage, TrmrkAppIcon],
  templateUrl: './trmrk-app-setup-page.html',
  styleUrl: './trmrk-app-setup-page.scss',
})
export class TrmrkAppSetup implements OnDestroy {
  static readonly defaultReturnToUrl = defaultMainCommonRouteKeys.App;

  private hasBeenSetupSubscription: Subscription;
  private activatedRouteSubscription: Subscription;
  private returnToUrl = TrmrkAppSetup.defaultReturnToUrl;

  constructor(
    @Inject(AppServiceBase) private appService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRouteSubscription = this.activatedRoute.queryParamMap.subscribe((params) => {
      this.returnToUrl = params.get(commonQueryKeys.returnTo) ?? TrmrkAppSetup.defaultReturnToUrl;

      if (this.appService.appStateService.hasBeenSetUp.value) {
        this.router.navigateByUrl(this.returnToUrl);
      }
    });

    this.hasBeenSetupSubscription = this.appService.appStateService.hasBeenSetUp.subscribe(() => {
      this.router.navigateByUrl(this.returnToUrl);
    });
  }

  ngOnDestroy(): void {
    this.hasBeenSetupSubscription.unsubscribe();
    this.activatedRouteSubscription.unsubscribe();
  }

  openAppSetupModal() {
    this.appService.appStateService.performAppSetup.next(true);
  }
}
