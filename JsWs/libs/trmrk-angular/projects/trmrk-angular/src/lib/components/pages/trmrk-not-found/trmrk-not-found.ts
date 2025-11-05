import { Component, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Subscription } from 'rxjs';

import { TrmrkAppPage } from '../../common/trmrk-app-page/trmrk-app-page';
import { HomePageUrlService } from '../../../services/common/home-page-url-service';
import { TrmrkUrl } from '../../../services/common/types';

@Component({
  selector: 'trmrk-not-found',
  imports: [TrmrkAppPage, MatIconModule, MatButtonModule],
  templateUrl: './trmrk-not-found.html',
  styleUrl: './trmrk-not-found.scss',
})
export class NotFound implements OnDestroy {
  homePageUrl: TrmrkUrl;

  private homePageUrlSubscription: Subscription;

  constructor(private homePageUrlService: HomePageUrlService) {
    this.homePageUrl = homePageUrlService.svc.obs.value.url;

    this.homePageUrlSubscription = homePageUrlService.svc.obs.subscribe((obj) => {
      this.homePageUrl = obj.url;
    });
  }

  ngOnDestroy(): void {
    this.homePageUrlSubscription.unsubscribe();
  }
}
