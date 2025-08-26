import { Component, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';

import {
  TrmrkAppPage,
  ComponentIdService,
  AppBarMapService,
} from 'trmrk-angular';

import { ToggleAppBarService } from '../services/toggle-app-bar-service';
import { TrmrkCompaniesAppPanel } from '../trmrk-companies-app-panel/trmrk-companies-app-panel';

@Component({
  selector: 'trmrk-companies-panel-page',
  imports: [TrmrkAppPage, TrmrkCompaniesAppPanel],
  templateUrl: './trmrk-companies-panel-page.html',
  styleUrl: './trmrk-companies-panel-page.scss',
  providers: [ToggleAppBarService],
})
export class TrmrkCompaniesPanelPage implements OnDestroy, AfterViewInit {
  appBarEl!: HTMLElement;
  appPageContentEl!: HTMLElement;

  private id: number;

  constructor(
    private hostEl: ElementRef<HTMLElement>,
    private appBarMapService: AppBarMapService,
    private toggleAppBarService: ToggleAppBarService,
    componentIdService: ComponentIdService
  ) {
    this.id = componentIdService.getNextId();

    appBarMapService.setCurrent(this.id, () => this.appBarEl);

    this.toggleAppBarService.init({
      getAppPanelElem: () => this.appPageContentEl,
    });
  }

  ngAfterViewInit(): void {
    this.appBarEl = this.hostEl.nativeElement.querySelector(
      'trmrk-app-bar'
    ) as HTMLElement;

    this.appPageContentEl = this.hostEl.nativeElement.querySelector(
      '.trmrk-app-page-body'
    ) as HTMLElement;
  }

  ngOnDestroy(): void {
    this.appBarMapService.clear(this.id);
  }
}
