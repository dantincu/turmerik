import {
  Component,
  ViewChild,
  ViewChildren,
  ElementRef,
  QueryList,
  EventEmitter,
  Input,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
  Output,
  TemplateRef,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import {
  TrmrkPanelListItem,
  TrmrkHorizStrip,
  materialIcons,
} from 'trmrk-angular';

import { TrmrkAcceleratingScrollControl } from '../trmrk-accelerating-scroll-control/trmrk-accelerating-scroll-control';
import { TrmrkAcceleratingScrollPopover } from '../trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';
import { TrmrkCancelContextMenu } from '../trmrk-cancel-context-menu/trmrk-cancel-context-menu';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrkPanelListService';

import { TrmrkCancelContextMenu as TrmrkCancelContextMenuDirective } from '../directives/trmrk-cancel-context-menu';

@Component({
  selector: 'trmrk-list-view',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    MatCheckbox,
    CommonModule,
    TrmrkPanelListItem,
    TrmrkHorizStrip,
    TrmrkAcceleratingScrollControl,
    TrmrkAcceleratingScrollPopover,
    TrmrkCancelContextMenu,
    TrmrkCancelContextMenuDirective,
  ],
  templateUrl: './trmrk-list-view.html',
  styleUrl: './trmrk-list-view.scss',
  providers: [TrmrkPanelListService],
})
export class TrmrkListView implements OnChanges, AfterViewInit, OnDestroy {
  @Input() trmrkEntities!: any[];
  @Input() trmrkEntityKeyPropName = 'id';
  @Input() trmrkRowsSelectionIsAllowed = false;
  @Input() trmrkSelectedRowsReorderIsAllowed = false;
  @Input() trmrkSelectedRowsReorderAggRowVertIsOriented = false;
  @Input() trmrkRowTemplate?: TemplateRef<any> | null | undefined;
  @Input() trmrkListItems!: () => QueryList<TrmrkPanelListItem>;

  @Output() trmrkRowsUpdated = new EventEmitter<
    TrmrkPanelListServiceRow<any>[]
  >();

  @Output() trmrkPanelListService = new EventEmitter<
    TrmrkPanelListService<any, TrmrkPanelListItem>
  >();

  @ViewChild('listView')
  listView!: ElementRef<HTMLDivElement>;

  @ViewChildren('currentlyMovingRowElems')
  currentlyMovingRowElems!: QueryList<TrmrkPanelListItem>;

  @ViewChild('movingAggregateRowEl')
  movingAggregateRowEl!: TrmrkHorizStrip;

  @ViewChild('upAcceleratingScrollPopover')
  upAcceleratingScrollPopover!: TrmrkAcceleratingScrollPopover;

  @ViewChild('downAcceleratingScrollPopover')
  downAcceleratingScrollPopover!: TrmrkAcceleratingScrollPopover;

  dragPanIcon: SafeHtml;

  private listItems!: () => QueryList<TrmrkPanelListItem>;

  constructor(
    public panelListService: TrmrkPanelListService<any, TrmrkPanelListItem>,
    private sanitizer: DomSanitizer
  ) {
    this.dragPanIcon = this.sanitizer.bypassSecurityTrustHtml(
      materialIcons.drag_pan
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.trmrkPanelListService.emit(this.panelListService);
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const entitiesChange = changes['trmrkEntities'];
    const listItemsChange = changes['trmrkListItems'];

    setTimeout(() => {
      if (listItemsChange && listItemsChange.currentValue) {
        this.listItems = listItemsChange.currentValue;
      }

      if (entitiesChange && entitiesChange.currentValue) {
        this.panelListService.reset();

        this.panelListService.setup({
          getListView: () => this.listView.nativeElement,
          getListItems: this.listItems,
          getVisuallyMovingListItems: () => this.currentlyMovingRowElems,
          getUpAcceleratingScrollPopover: () =>
            this.upAcceleratingScrollPopover,
          getDownAcceleratingScrollPopover: () =>
            this.downAcceleratingScrollPopover,
          getMovingAggregateRowEl: () => this.movingAggregateRowEl,
          entities: entitiesChange.currentValue,
          idPropName: this.trmrkEntityKeyPropName,
          rowsSelectionIsAllowed: this.trmrkRowsSelectionIsAllowed,
          selectedRowsReorderIsAllowed: this.trmrkSelectedRowsReorderIsAllowed,
          selectedRowsReorderAggRowVertIsOriented:
            this.trmrkSelectedRowsReorderAggRowVertIsOriented,
        });

        this.trmrkRowsUpdated.emit(this.panelListService.rows);
      }
    }, 0);
  }

  ngOnDestroy(): void {}

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.panelListService.rowsMasterCheckBoxToggled(event);
  }
}
