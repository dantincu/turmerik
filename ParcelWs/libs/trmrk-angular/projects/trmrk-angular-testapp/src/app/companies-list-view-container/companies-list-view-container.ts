import {
  Component,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  AfterViewInit,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import { TrmrkPanelListItem } from 'trmrk-angular';

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkAcceleratingScrollControl } from '../trmrk-accelerating-scroll-control/trmrk-accelerating-scroll-control';
import { TrmrkAcceleratingScrollPopover } from '../trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';

import { companies } from '../services/companies';
import { TrmrkPanelListService } from '../services/trmrkPanelListService';

@Component({
  selector: 'trmrk-companies-list-view-container',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    MatCheckbox,
    CommonModule,
    TrmrkPanelListItem,
    TrmrkAcceleratingScrollControl,
    TrmrkAcceleratingScrollPopover,
  ],
  templateUrl: './companies-list-view-container.html',
  styleUrl: './companies-list-view-container.scss',
  providers: [TrmrkPanelListService],
})
export class CompaniesListViewContainer implements AfterViewInit {
  @ViewChild('companiesListView')
  listView!: ElementRef<HTMLDivElement>;

  @ViewChildren('companyListItems')
  listItems!: QueryList<TrmrkPanelListItem>;

  entities = [...Array(1).keys()]
    .map(() => companies.slice(0, 200))
    .reduce((acc, arr) => [...acc, ...arr]);

  get rows() {
    return this.panelListService.rows;
  }

  get rowsAreSelectable() {
    return this.panelListService.rowsAreSelectable;
  }

  get rowsMasterCheckBoxIsChecked() {
    return this.panelListService.rowsMasterCheckBoxIsChecked;
  }

  get isMovingSelectedRows() {
    return this.panelListService.isMovingSelectedRows;
  }

  constructor(
    private panelListService: TrmrkPanelListService<
      {
        id: number;
        name: string;
      },
      TrmrkPanelListItem
    >
  ) {}

  ngAfterViewInit(): void {
    this.panelListService.init({
      listView: this.listView,
      listItems: this.listItems,
      entities: this.entities.map((compName, idx) => ({
        id: idx + 1,
        name: compName,
      })),
    });
  }

  companyCheckBoxToggled(event: MatCheckboxChange, id: number) {
    this.panelListService.companyCheckBoxToggled(event, id);
  }

  companiesMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.panelListService.companiesMasterCheckBoxToggled(event);
  }

  companyIconLongPressOrRightClick(event: TouchOrMouseCoords, id: number) {
    this.panelListService.companyIconLongPressOrRightClick(event, id);
  }

  companyIconMouseDownOrTouchStart(event: MouseEvent | TouchEvent, id: number) {
    this.panelListService.companyIconMouseDownOrTouchStart(event, id);
  }
}
