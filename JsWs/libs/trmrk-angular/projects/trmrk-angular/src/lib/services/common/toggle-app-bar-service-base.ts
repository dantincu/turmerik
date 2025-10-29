import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AppStateServiceBase } from './app-state-service-base';
import { AppBarMapService } from './app-bar-map-service';

export interface ToggleAppBarServiceInitArgsCore {
  getAppPanelElem: () => HTMLElement;
}

@Injectable()
export class ToggleAppBarServiceBase<
  TAppStateService extends AppStateServiceBase,
  TToggleAppBarServiceInitArgs extends ToggleAppBarServiceInitArgsCore = ToggleAppBarServiceInitArgsCore
> implements OnDestroy
{
  protected getAppPanelElem!: () => HTMLElement;

  private showAppBarSubscription: Subscription | null = null;

  constructor(
    @Inject(AppStateServiceBase) public appStateService: TAppStateService,
    public appBarMapService: AppBarMapService
  ) {
    this.appStateService.showAppBar.subscribe((showAppBar) => {
      const appBarElem = this.appBarMapService
        .getCurrent()
        ?.querySelector('.trmrk-app-bar');

      const appPanelElem = this.getAppPanelElem();

      if (appBarElem) {
        appBarElem.classList.remove('trmrk-show', 'trmrk-hide');

        if (showAppBar) {
          appBarElem.classList.add('trmrk-show');
        } else {
          appBarElem.classList.add('trmrk-hide');
        }
      }

      if (appPanelElem) {
        appPanelElem.classList.remove(
          'trmrk-has-app-bar',
          'trmrk-has-app-bar-not'
        );

        if (showAppBar) {
          appPanelElem.classList.add('trmrk-has-app-bar');
        } else {
          appPanelElem.classList.add('trmrk-has-app-bar-not');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.getAppPanelElem = null!;
    this.showAppBarSubscription?.unsubscribe();
  }

  init(args: TToggleAppBarServiceInitArgs) {
    this.getAppPanelElem = args.getAppPanelElem;
  }
}
