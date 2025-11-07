import { Component, OnDestroy, Inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { getVarName } from '../../../../trmrk/Reflection/core';
import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkInfiniteHeightPanelScrollControl } from '../../../../trmrk-angular/components/common/trmrk-infinite-height-panel-scroll-control/trmrk-infinite-height-panel-scroll-control';
import { TrmrkInfiniteHeightPanelScrollBar } from '../../../../trmrk-angular/components/common/trmrk-infinite-height-panel-scroll-bar/trmrk-infinite-height-panel-scroll-bar';
import { TrmrkHorizStrip } from '../../../../trmrk-angular/components/common/trmrk-horiz-strip/trmrk-horiz-strip';

import {
  openDialog,
  DialogPanelSize,
} from '../../../../trmrk-angular/services/common/trmrk-dialog';

import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';
import { runOnceWhenValueIs } from '../../../../trmrk-angular/services/common/TrmrkObservable';

import {
  TrmrkInfiniteHeightPanelScrollService,
  TrmrkInfiniteHeightPanelScrollEvent,
} from '../../../../trmrk-angular/services/common/trmrk-infinite-height-panel-scroll-service';

import { commonAppSettingsChoiceCatKeys } from '../../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { companies } from '../../../services/common/companies';
import { AppService } from '../../../services/common/app-service';

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
  idx: number;
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
  providers: [TrmrkInfiniteHeightPanelScrollService],
})
export class TrmrkInfiniteHeightPanelTestPage implements OnDestroy {
  appSettingsChoicesCatKey = [
    commonAppSettingsChoiceCatKeys.infiniteHeightPanelScrollControl,
    getVarName(() => TrmrkInfiniteHeightPanelTestPage),
  ];

  items: Item[] = [];
  params: TrmrkInfiniteHeightPanelTestPageParams | null = null;

  editParamsModalId: number | null = null;

  private routeSub!: Subscription;

  constructor(
    public service: TrmrkInfiniteHeightPanelScrollService,
    @Inject(AppServiceBase) private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private appSetupDialog: MatDialog,
    private hostElRef: ElementRef
  ) {
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const startParam = params.get(queryParamKeys.start);
      const countParam = params.get(queryParamKeys.count);
      const totalParam = params.get(queryParamKeys.total);

      this.params = {
        startIdx: (startParam ?? null) !== null ? parseInt(startParam!, 10) : 1,
        itemsCount: (countParam ?? null) !== null ? parseInt(countParam!, 10) : 1000,
        totalItemsCount: (totalParam ?? null) !== null ? parseInt(totalParam!, 10) : 10000,
      };

      if (!startParam || !countParam || !totalParam) {
        this.navToParams();
      } else {
        this.refreshItems();
      }
    });

    setTimeout(() => {
      service.setupScrollPanel({
        hostEl: () => (hostElRef.nativeElement as HTMLElement).querySelector('.trmrk-page-body')!,
        totalHeight: () => (this.params?.totalItemsCount ?? 0) * 424,
      });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  navToParams() {
    this.router.navigate([], {
      queryParams: {
        [queryParamKeys.start]: this.params!.startIdx,
        [queryParamKeys.count]: this.params!.itemsCount,
        [queryParamKeys.total]: this.params!.totalItemsCount,
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
          params: this.params!,
          newParams: (params: TrmrkInfiniteHeightPanelTestPageParams) => {
            this.params = params;
            this.navToParams();
          },
        },
      },
    });
  }

  scrolled(event: TrmrkInfiniteHeightPanelScrollEvent) {}

  closeSetupModal() {
    if (this.editParamsModalId) {
      this.appService.closeModal(this.editParamsModalId);
    }
  }

  refreshItems() {
    this.items = Array.from({ length: this.params!.itemsCount }, (_, i) => {
      const idx = i + 1;
      return {
        idx,
        text: `${idx}: ${companies[i % companies.length]}`,
        backColor: this.getBackColor(idx),
      };
    });

    setTimeout(() =>
      runOnceWhenValueIs(this.service.setupComplete, true, () => {
        this.service.contentChanged({
          topPx: 0,
        });
      })
    );
  }

  getBackColor(idx: number): string {
    const colorIdx = idx % 1024;
    const div = Math.floor(colorIdx / 256);
    const mod = colorIdx % 256;
    const revMod = 255 - mod;

    const transform = (px: number) => Math.round(px);

    switch (div) {
      case 0:
      case 2:
        return `rgb(${transform(revMod / 2)}, ${transform(revMod / 4)}, ${transform(mod / 2)})`;
      default:
        return `rgb(${transform(mod / 2)}, ${transform(mod / 4)}, ${transform(revMod / 2)})`;
    }
  }
}
