import {
  Component,
  ViewChildren,
  ViewChild,
  QueryList,
  ElementRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import { TrmrkPanelListItem, TrmrkTouchStartOrMouseDown } from 'trmrk-angular';

import { companies } from '../services/companies';
import { TrmrkPanelList } from '../trmrk-panel-list/trmrk-panel-list';
import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkAcceleratingScrollControl } from '../trmrk-accelerating-scroll-control/trmrk-accelerating-scroll-control';
import { TrmrkAcceleratingScrollPopover } from '../trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrk-panel-list-service';

@Component({
  selector: 'companies-app-panel',
  imports: [
    CommonModule,
    TrmrkPanelList,
    TrmrkPanelListItem,
    TrmrkTouchStartOrMouseDown,
    MatIconButton,
    MatCheckbox,
    TrmrkAcceleratingScrollControl,
    TrmrkAcceleratingScrollPopover,
  ],
  templateUrl: './companies-app-panel.html',
  styleUrl: './companies-app-panel.scss',
  providers: [TrmrkPanelListService],
})
export class CompaniesAppPanel {
  @ViewChild('panelList')
  panelList!: TrmrkPanelList;

  @ViewChild('topHorizStrip')
  topHorizStrip!: ElementRef<HTMLDivElement>;

  @ViewChild('upAcceleratingScrollPopover')
  upAcceleratingScrollPopover!: TrmrkAcceleratingScrollPopover;

  @ViewChild('downAcceleratingScrollPopover')
  downAcceleratingScrollPopover!: TrmrkAcceleratingScrollPopover;

  @ViewChildren('listItems')
  listItems!: QueryList<TrmrkPanelListItem>;

  @ViewChildren('currentlyMovingListItems')
  currentlyMovingListItems!: QueryList<TrmrkPanelListItem>;

  listItemsColl!: QueryList<TrmrkPanelListItem>;
  currentlyMovingListItemsColl!: QueryList<TrmrkPanelListItem>;

  getPanelList = () =>
    this.panelList.hostEl.nativeElement.querySelector(
      'trmrk-list-view'
    ) as HTMLElement;

  getTopHorizStrip = () => this.topHorizStrip.nativeElement;

  getListItems = () => this.listItems;
  getCurrentlyMovingListItems = () => this.currentlyMovingListItems;

  getUpAcceleratingScrollPopover = () => this.upAcceleratingScrollPopover;
  getDownAcceleratingScrollPopover = () => this.downAcceleratingScrollPopover;

  entities = companies.slice(0, 200).map((name, idx) => ({
    id: idx + 1,
    name,
  }));

  rows: TrmrkPanelListServiceRow<{
    id: number;
    name: string;
  }>[] = [];

  constructor(
    public panelListService: TrmrkPanelListService<any, TrmrkPanelListItem>
  ) {}

  rowsUpdated(rows: TrmrkPanelListServiceRow<any>[]) {
    this.rows = rows;
  }

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.panelListService.rowsMasterCheckBoxToggled(event);
  }

  rowIconShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}

  rowTextShortPressOrLeftClick(event: TouchOrMouseCoords, idx: number) {}
}
