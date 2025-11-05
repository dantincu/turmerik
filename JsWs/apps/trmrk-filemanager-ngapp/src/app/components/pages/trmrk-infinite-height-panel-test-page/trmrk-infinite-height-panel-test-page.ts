import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkInfiniteHeightPanelScrollControl } from '../../../../trmrk-angular/components/common/trmrk-infinite-height-panel-scroll-control/trmrk-infinite-height-panel-scroll-control';
import { TrmrkInfiniteHeightPanelScrollBar } from '../../../../trmrk-angular/components/common/trmrk-infinite-height-panel-scroll-bar/trmrk-infinite-height-panel-scroll-bar';
import { TrmrkHorizStrip } from '../../../../trmrk-angular/components/common/trmrk-horiz-strip/trmrk-horiz-strip';

import {
  openDialog,
  DialogPanelSize,
} from '../../../../trmrk-angular/services/common/trmrk-dialog';

import { companies } from '../../../services/common/companies';

import {
  TrmrkParamsSetupModal,
  TrmrkParamsSetupModalComponentData,
  TrmrkInfiniteHeightPanelTestPageParams,
} from './trmrk-params-setup-modal/trmrk-params-setup-modal';

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
    MatIconModule,
    MatButtonModule,
    TrmrkAppPage,
    TrmrkInfiniteHeightPanelScrollControl,
    TrmrkInfiniteHeightPanelScrollBar,
    TrmrkHorizStrip,
  ],
  templateUrl: './trmrk-infinite-height-panel-test-page.html',
  styleUrl: './trmrk-infinite-height-panel-test-page.scss',
})
export class TrmrkInfiniteHeightPanelTestPage implements OnDestroy {
  items: Item[] = [];
  params: TrmrkInfiniteHeightPanelTestPageParams | null = null;

  editParamsModalId: number | null = null;

  private routeSub!: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private appSetupDialog: MatDialog
  ) {
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const startParam = params.get(queryParamKeys.start);
      const countParam = params.get(queryParamKeys.count);
      const totalParam = params.get(queryParamKeys.total);

      this.params = {
        startIdx: (startParam ?? null) !== null ? parseInt(startParam!, 10) : 1,
        itemCount: (countParam ?? null) !== null ? parseInt(countParam!, 10) : 1000,
        totalItemCount: (totalParam ?? null) !== null ? parseInt(totalParam!, 10) : 10000,
      };

      if (!startParam || !countParam || !totalParam) {
        this.navToParams();
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  navToParams() {
    this.router.navigate([], {
      queryParams: {
        [queryParamKeys.start]: this.params!.startIdx,
        [queryParamKeys.count]: this.params!.itemCount,
        [queryParamKeys.total]: this.params!.totalItemCount,
      },
      queryParamsHandling: 'merge',
    });
  }

  editParamsClicked() {
    openDialog<TrmrkParamsSetupModalComponentData>({
      matDialog: this.appSetupDialog,
      dialogComponent: TrmrkParamsSetupModal,
      data: {
        data: {
          modalIdAvailable: (modalId) => (this.editParamsModalId = modalId),
          newParams: (params: TrmrkInfiniteHeightPanelTestPageParams) => {
            this.params = params;
            this.navToParams();
          },
        },
      },
      dialogPanelSize: DialogPanelSize.Default,
    });
  }
}
