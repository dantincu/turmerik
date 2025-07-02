import {
  Component,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  Injector,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

import { TrmrkPanelListItem, trmrkTreeEventHandlers } from 'trmrk-angular';
import { DragService } from 'trmrk-angular';

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
  companiesListView!: ElementRef<HTMLDivElement>;

  @ViewChildren('companyListItems')
  companyListItems!: QueryList<TrmrkPanelListItem>;

  companies = [...Array(1).keys()]
    .map(() => companies.slice(0, 200))
    .reduce((acc, arr) => [...acc, ...arr]);

  get companyRows() {
    return this.panelListService.rows;
  }

  get companiesAreSelectable() {
    return this.panelListService.rowsAreSelectable;
  }

  get companiesMasterCheckBoxIsChecked() {
    return this.panelListService.rowsMasterCheckBoxIsChecked;
  }

  get isMovingSelectedCompanies() {
    return this.panelListService.isMovingSelectedRows;
  }

  private companyIconDragServices: DragService[] | null = null;

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
      listView: this.companiesListView,
      listItems: this.companyListItems,
      entities: this.companies.map((compName, idx) => ({
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
