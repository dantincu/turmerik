import { Component, OnDestroy, Inject, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { getVarName } from '../../../../trmrk/Reflection/core';
import { mapPropNamesToThemselves } from '../../../../trmrk/propNames';
import { TrmrkAppPage } from '../../../../trmrk-angular/components/common/trmrk-app-page/trmrk-app-page';
import { TrmrkHorizStrip } from '../../../../trmrk-angular/components/common/trmrk-horiz-strip/trmrk-horiz-strip';
import { TrmrkListSliceSelector } from '../../../../trmrk-angular/components/common/trmrk-list-slice-selector/trmrk-list-slice-selector';

import {
  openDialog,
  DialogPanelSize,
} from '../../../../trmrk-angular/services/common/trmrk-dialog';

import { AppServiceBase } from '../../../../trmrk-angular/services/common/app-service-base';
import { runOnceWhenValueIs } from '../../../../trmrk-angular/services/common/TrmrkObservable';

import { commonAppSettingsChoiceCatKeys } from '../../../../trmrk-browser/indexedDB/databases/BasicAppSettings';

import { companies } from '../../../services/common/companies';
import { AppService } from '../../../services/common/app-service';

import {
  TrmrkPagParamsSetupModal,
  TrmrkPagParamsSetupModalComponentData,
  TrmrkPaginatedListTestPageParams,
} from './trmrk-pag-params-setup-modal/trmrk-pag-params-setup-modal';

const queryParamKeys = mapPropNamesToThemselves({
  total: '',
  skip: '',
  show: '',
  next: '',
});

interface Item {
  idx: number;
  text: string;
  backColor: string;
}

@Component({
  selector: 'trmrk-paginated-list-test-page',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    TrmrkAppPage,
    TrmrkHorizStrip,
    TrmrkListSliceSelector,
  ],
  templateUrl: './trmrk-paginated-list-test-page.html',
  styleUrl: './trmrk-paginated-list-test-page.scss',
})
export class TrmrkPaginatedListTestPage {
  items: Item[] = [];
  params: TrmrkPaginatedListTestPageParams | null = null;

  editParamsModalId: number | null = null;

  private routeSub!: Subscription;

  constructor(
    @Inject(AppServiceBase) private appService: AppService,
    private router: Router,
    private route: ActivatedRoute,
    private editParamsDialog: MatDialog,
    private hostElRef: ElementRef
  ) {
    this.routeSub = this.route.queryParamMap.subscribe((params) => {
      const totalParam = params.get(queryParamKeys.total);
      const skipParam = params.get(queryParamKeys.skip);
      const showParam = params.get(queryParamKeys.show);
      const nextParam = params.get(queryParamKeys.next);

      this.params = {
        total: (totalParam ?? null) !== null ? parseInt(totalParam!) : 1000,
        show: (skipParam ?? null) !== null ? parseInt(skipParam!) : 0,
        skip: (showParam ?? null) !== null ? parseInt(showParam!) : 150,
        next: (nextParam ?? null) !== null ? parseInt(nextParam!) : 50,
      };

      if (!totalParam || !skipParam || !showParam || !nextParam) {
        this.navToParams();
      } else {
        this.refreshItems();
      }
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }

  navToParams() {
    this.router.navigate([], {
      queryParams: {
        [queryParamKeys.total]: this.params!.total,
        [queryParamKeys.skip]: this.params!.show,
        [queryParamKeys.show]: this.params!.skip,
        [queryParamKeys.next]: this.params!.next,
      },
      queryParamsHandling: 'merge',
    });
  }

  editParamsClicked() {
    openDialog<TrmrkPagParamsSetupModalComponentData>({
      matDialog: this.editParamsDialog,
      dialogComponent: TrmrkPagParamsSetupModal,
      data: {
        data: {
          modalIdAvailable: (modalId) => (this.editParamsModalId = modalId),
          params: this.params!,
          newParams: (params: TrmrkPaginatedListTestPageParams) => {
            this.params = params;
            this.navToParams();
          },
        },
      },
    });
  }

  closeSetupModal() {
    if (this.editParamsModalId) {
      this.appService.closeModal(this.editParamsModalId);
    }
  }

  refreshItems() {
    const stIdx = (this.params!.skip - 1) * this.params!.show;
    const pageSize = Math.min(this.params!.show, this.params!.total - stIdx);

    this.items = Array.from({ length: pageSize }, (_, i) => {
      const idx = stIdx + i + 1;
      return {
        idx,
        text: `${idx}: ${companies[(idx - 1) % companies.length]}`,
        backColor: this.getBackColor(idx),
      };
    });
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
