import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkInfiniteHeightPanelScrollControl } from '../../../../trmrk-angular/components/common/trmrk-infinite-height-panel-scroll-control/trmrk-infinite-height-panel-scroll-control';
import { TrmrkInfiniteHeightPanelScrollBar } from '../../../../trmrk-angular/components/common/trmrk-infinite-height-panel-scroll-bar/trmrk-infinite-height-panel-scroll-bar';

import { companies } from '../../../services/common/companies';

const queryParamKeys = {
  start: 'start',
  count: 'count',
  total: 'total',
};

interface Item {
  id: number;
  text: string;
  backColor: string;
}

@Component({
  selector: 'trmrk-infinite-height-panel-test-page',
  imports: [
    CommonModule,
    TrmrkAppPage,
    TrmrkInfiniteHeightPanelScrollControl,
    TrmrkInfiniteHeightPanelScrollBar,
  ],
  templateUrl: './trmrk-infinite-height-panel-test-page.html',
  styleUrl: './trmrk-infinite-height-panel-test-page.scss',
})
export class TrmrkInfiniteHeightPanelTestPage implements OnDestroy {
  items: Item[] = [];
  startIdx = 0;
  itemCount = 0;
  totalItemCount = 0;

  private routeSub!: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const startParam = params.get(queryParamKeys.start);
      const countParam = params.get(queryParamKeys.count);
      const totalParam = params.get(queryParamKeys.total);

      this.startIdx = startParam ? parseInt(startParam, 10) : 1;
      this.itemCount = countParam ? parseInt(countParam, 10) : 1000;
      this.totalItemCount = totalParam ? parseInt(totalParam, 10) : 10000;

      if (!startParam || !countParam || !totalParam) {
        this.router.navigate([], {
          queryParams: {
            [queryParamKeys.start]: this.startIdx,
            [queryParamKeys.count]: this.itemCount,
            [queryParamKeys.total]: this.totalItemCount,
          },
          queryParamsHandling: 'merge',
        });
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
