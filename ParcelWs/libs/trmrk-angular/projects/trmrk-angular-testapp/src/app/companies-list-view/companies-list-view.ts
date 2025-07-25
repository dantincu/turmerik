import {
  Component,
  ViewChildren,
  QueryList,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { companies } from '../services/companies';

import { TrmrkPanelListItem } from 'trmrk-angular';

import { TrmrkListView } from '../trmrk-list-view/trmrk-list-view';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrkPanelListService';

@Component({
  selector: 'app-companies-list-view',
  imports: [CommonModule, TrmrkListView, TrmrkPanelListItem],
  templateUrl: './companies-list-view.html',
  styleUrl: './companies-list-view.scss',
})
export class CompaniesListView implements AfterViewInit, OnDestroy {
  @ViewChildren('listItems')
  listItems!: QueryList<TrmrkPanelListItem>;

  @ViewChildren('currentlyMovingListItems')
  currentlyMovingListItems!: QueryList<TrmrkPanelListItem>;

  listItemsColl!: QueryList<TrmrkPanelListItem>;
  currentlyMovingListItemsColl!: QueryList<TrmrkPanelListItem>;

  getListItems = () => this.listItemsColl;
  getCurrentlyMovingListItems = () => this.currentlyMovingListItemsColl;

  entities = companies.slice(0, 200).map((name, idx) => ({
    id: idx + 1,
    name,
  }));

  rows: TrmrkPanelListServiceRow<{
    id: number;
    name: string;
  }>[] = [];

  panelListService!: TrmrkPanelListService<any, TrmrkPanelListItem>;

  private listItemsSubscription: Subscription | null = null;
  private currentlyMovingListItemsSubscription: Subscription | null = null;

  ngAfterViewInit() {
    this.listItemsSubscription = this.listItems.changes.subscribe(
      (collection) => {
        this.listItemsColl = collection;

        /* console.log(
          'listItemsColl.get(0)',
          collection.get(0).hostEl.nativeElement,
          collection.length
        );

        console.log(
          'listItemsColl.last',
          collection.last.hostEl.nativeElement,
          collection.length
        ); */
      }
    );

    this.currentlyMovingListItemsSubscription =
      this.currentlyMovingListItems.changes.subscribe((collection) => {
        this.currentlyMovingListItemsColl = collection;

        /* console.log(
          'currentlyMovingListItemsColl.get(0)',
          collection.get(0)?.hostEl.nativeElement,
          collection.length
        );

        console.log(
          'currentlyMovingListItemsColl.last',
          collection.last?.hostEl.nativeElement,
          collection.length
        ); */
      });
  }

  ngOnDestroy() {
    this.listItemsSubscription?.unsubscribe();
    this.currentlyMovingListItemsSubscription?.unsubscribe();
  }

  rowsUpdated(rows: TrmrkPanelListServiceRow<any>[]) {
    this.rows = rows;
  }

  onPanelListService(
    panelListService: TrmrkPanelListService<any, TrmrkPanelListItem>
  ) {
    this.panelListService = panelListService;
  }
}
