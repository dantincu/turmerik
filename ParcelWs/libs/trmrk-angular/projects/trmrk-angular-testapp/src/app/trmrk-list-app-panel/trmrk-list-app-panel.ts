import {
  Component,
  Input,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  TemplateRef,
  Output,
  EventEmitter,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import {
  TrmrkHorizStrip,
  TrmrkPanelListItem,
  TrmrkLoading,
} from 'trmrk-angular';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrk-panel-list-service';
import { TrmrkAcceleratingScrollControl } from '../trmrk-accelerating-scroll-control/trmrk-accelerating-scroll-control';
import { TrmrkAcceleratingScrollPopover } from '../trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';
import { TrmrkPanelList } from '../trmrk-panel-list/trmrk-panel-list';

@Component({
  selector: 'trmrk-list-app-panel',
  imports: [
    CommonModule,
    MatIconModule,
    MatIconButton,
    MatCheckbox,
    TrmrkAcceleratingScrollControl,
    TrmrkAcceleratingScrollPopover,
    TrmrkPanelList,
    TrmrkHorizStrip,
    TrmrkLoading,
  ],
  templateUrl: './trmrk-list-app-panel.html',
  styleUrl: './trmrk-list-app-panel.scss',
  providers: [],
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkListAppPanel {
  @Input() trmrkCssClass: string | null = null;
  @Input() trmrkEntities!: any[];
  @Input() trmrkEntityKeyPropName = 'id';
  @Input() trmrkRowMenuTemplate!: TemplateRef<any>;
  @Input() trmrkRowsSelectionIsAllowed = false;
  @Input() trmrkSelectedRowsReorderIsAllowed = false;
  @Input() trmrkSelectedRowsReorderAggRowVertIsOriented = false;
  @Input() trmrkRowTemplate!: TemplateRef<any>;
  @Input() trmrkVisuallyMovingRowTemplate!: TemplateRef<any>;
  @Input() trmrkLoadingTemplate!: TemplateRef<any>;
  @Input() trmrkNoItemsTemplate!: TemplateRef<any>;
  @Input() trmrkListItems!: () => QueryList<TrmrkPanelListItem>;
  @Input() trmrkVisuallyMovingListItems!: () => QueryList<TrmrkPanelListItem>;
  @Input() trmrkIsLoading = true;
  @Input() trmrkErrorTitle = '';
  @Input() trmrkErrorMsg: string | null = null;
  @Input() trmrkHasError = false;

  @Output() trmrkRowsUpdated = new EventEmitter<
    TrmrkPanelListServiceRow<any>[]
  >();

  @ViewChild('panelList')
  panelList!: TrmrkPanelList;

  @ViewChild('panelHeader')
  panelHeader!: ElementRef<HTMLDivElement>;

  @ViewChild('upAcceleratingScrollPopover')
  upAcceleratingScrollPopover!: TrmrkAcceleratingScrollPopover;

  @ViewChild('downAcceleratingScrollPopover')
  downAcceleratingScrollPopover!: TrmrkAcceleratingScrollPopover;

  @ViewChildren('listItems')
  listItems!: QueryList<any>;

  @ViewChildren('currentlyMovingListItems')
  currentlyMovingListItems!: QueryList<any>;

  listItemsColl!: QueryList<any>;
  currentlyMovingListItemsColl!: QueryList<any>;

  getPanelList = () => {
    const elem = this.panelList.hostEl.nativeElement as HTMLElement;

    return elem;
  };

  getPanelHeader = () => this.panelHeader.nativeElement;

  getListItems = () => this.listItems;
  getCurrentlyMovingListItems = () => this.currentlyMovingListItems;

  getUpAcceleratingScrollPopover = () => this.upAcceleratingScrollPopover;
  getDownAcceleratingScrollPopover = () => this.downAcceleratingScrollPopover;

  constructor(public panelListService: TrmrkPanelListService<any, any>) {}

  applyNewOrderClose() {
    this.panelListService.showPendingReorderStrip = false;
  }

  clearSelectedRows() {
    this.panelListService.toggleSelectedRows(false);
  }

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.panelListService.rowsMasterCheckBoxToggled(event);
  }
}
