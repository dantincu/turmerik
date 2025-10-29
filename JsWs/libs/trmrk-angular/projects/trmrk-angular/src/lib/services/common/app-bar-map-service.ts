import { Injectable, OnDestroy } from '@angular/core';

import { ComponentDataMap } from './componentDataMap';

@Injectable({
  providedIn: 'root',
})
export class AppBarMapService implements OnDestroy {
  public map = new ComponentDataMap<() => HTMLElement | null>();
  public currentPageId: number = 0;

  public getCurrent() {
    const appBarFactory = this.map.get(this.currentPageId);
    let appBar: HTMLElement | null = null;

    if (appBarFactory) {
      appBar = appBarFactory();
    }

    return appBar;
  }

  public setCurrent(
    currentPageId: number,
    appBarFactory: () => HTMLElement | null
  ) {
    this.currentPageId = currentPageId;
    this.map.set(currentPageId, appBarFactory);
  }

  public clear(pageId: number) {
    this.map.clear(pageId);
  }

  ngOnDestroy(): void {
    this.map.clearAll();
  }
}
