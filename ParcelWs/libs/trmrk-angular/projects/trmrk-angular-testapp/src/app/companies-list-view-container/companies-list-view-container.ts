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
import { TrmrkCancelContextMenu } from '../trmrk-cancel-context-menu/trmrk-cancel-context-menu';

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
    TrmrkCancelContextMenu,
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

  @ViewChildren('currentlyMovingRowElems')
  currentlyMovingRowElems!: QueryList<TrmrkPanelListItem>;

  @ViewChild('upAcceleratingScrollPopover')
  upAcceleratingScrollPopover!: ElementRef;

  @ViewChild('downAcceleratingScrollPopover')
  downAcceleratingScrollPopover!: ElementRef;

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

  get showAcceleratingScrollPopovers() {
    return this.panelListService.showAcceleratingScrollPopovers;
  }

  get isMovingSelectedRows() {
    return this.panelListService.isMovingSelectedRows;
  }

  get visuallyMovingRows() {
    return this.panelListService.visuallyMovingRows;
  }

  get showVisuallyMovingRows() {
    return this.panelListService.showVisuallyMovingRows;
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
      listItems: this.listItems,
      getVisuallyMovingListItems: () => this.currentlyMovingRowElems,
      listView: this.listView.nativeElement,
      getUpAcceleratingScrollPopover: () =>
        this.upAcceleratingScrollPopover.nativeElement,
      getDownAcceleratingScrollPopover: () =>
        this.downAcceleratingScrollPopover.nativeElement,
      entities: this.entities.map((compName, idx) => ({
        id: idx + 1,
        name: compName,
      })),
      rowsSelectionIsAllowed: true,
      selectedRowsReorderIsAllowed: true,
      selectedRowsReorderAggRowVertIsOriented: true,
    });
  }

  rowCheckBoxToggled(event: MatCheckboxChange, id: number) {
    this.panelListService.rowCheckBoxToggled(event, id);
  }

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.panelListService.rowsMasterCheckBoxToggled(event);
  }

  rowIconLongPressOrRightClick(event: TouchOrMouseCoords, id: number) {
    this.panelListService.rowIconLongPressOrRightClick(event, id);
  }

  rowIconMouseDownOrTouchStart(event: MouseEvent | TouchEvent, id: number) {
    this.panelListService.rowIconMouseDownOrTouchStart(event, id);
  }
}
