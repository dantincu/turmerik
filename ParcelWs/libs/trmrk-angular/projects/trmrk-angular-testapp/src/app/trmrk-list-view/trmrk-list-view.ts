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
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCheckbox, MatCheckboxChange } from '@angular/material/checkbox';

import {
  TrmrkPanelListItem,
  TrmrkHorizStrip,
  materialIcons,
} from 'trmrk-angular';

import { whenChanged } from 'trmrk-angular';

import { TrmrkAcceleratingScrollControl } from '../trmrk-accelerating-scroll-control/trmrk-accelerating-scroll-control';
import { TrmrkAcceleratingScrollPopover } from '../trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';
import { TrmrkCancelContextMenu } from '../trmrk-cancel-context-menu/trmrk-cancel-context-menu';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrk-panel-list-service';

import { TrmrkCancelContextMenu as TrmrkCancelContextMenuDirective } from '../directives/trmrk-cancel-context-menu';

@Component({
  selector: 'trmrk-list-view',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatIconButton,
    MatCheckbox,
    MatMenuModule,
    CommonModule,
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
  @Input() trmrkRowMenuTemplate!: TemplateRef<any>;
  @Input() trmrkRowsSelectionIsAllowed = false;
  @Input() trmrkSelectedRowsReorderIsAllowed = false;
  @Input() trmrkSelectedRowsReorderAggRowVertIsOriented = false;
  @Input() trmrkRowTemplate!: TemplateRef<any>;
  @Input() trmrkVisuallyMovingRowTemplate!: TemplateRef<any>;
  @Input() trmrkListItems!: () => QueryList<TrmrkPanelListItem>;
  @Input() trmrkVisuallyMovingListItems!: () => QueryList<TrmrkPanelListItem>;

  @Output() trmrkRowsUpdated = new EventEmitter<
    TrmrkPanelListServiceRow<any>[]
  >();

  @Output() trmrkPanelListService = new EventEmitter<
    TrmrkPanelListService<any, TrmrkPanelListItem>
  >();

  @ViewChild('listView')
  listView!: ElementRef<HTMLDivElement>;

  @ViewChild('topHorizStrip')
  topHorizStrip!: ElementRef<HTMLDivElement>;

  @ViewChild('movingAggregateRowEl')
  movingAggregateRowEl!: TrmrkHorizStrip;

  @ViewChild('upAcceleratingScrollPopover')
  upAcceleratingScrollPopover!: TrmrkAcceleratingScrollPopover;

  @ViewChild('downAcceleratingScrollPopover')
  downAcceleratingScrollPopover!: TrmrkAcceleratingScrollPopover;

  @ViewChild('rowsMenuTrigger', { read: MatMenuTrigger })
  rowsMenuTrigger!: MatMenuTrigger;

  @ViewChild('rowsMenuTrigger')
  rowsMenuTriggerEl!: ElementRef<HTMLDivElement>;

  @ViewChild('rowsMenu')
  rowsMenu!: MatMenu;

  dragPanIcon: SafeHtml;

  private listItems!: () => QueryList<TrmrkPanelListItem>;
  private currentlyMovingListItems!: () => QueryList<TrmrkPanelListItem>;

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
      this.rowsMenuTrigger.menu = this.rowsMenu;
      this.trmrkPanelListService.emit(this.panelListService);
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      whenChanged(
        changes,
        () => this.trmrkListItems,
        (value) => (this.listItems = value)
      );

      whenChanged(
        changes,
        () => this.trmrkVisuallyMovingListItems,
        (value) => (this.currentlyMovingListItems = value)
      );

      whenChanged(
        changes,
        () => this.trmrkEntities,
        (entities) => {
          this.panelListService.reset();

          this.panelListService.setup({
            getListView: () => this.listView.nativeElement,
            getListItems: this.listItems,
            rowsMenuTriggerEl: () => this.rowsMenuTriggerEl.nativeElement,
            rowsMenu: () => this.rowsMenu,
            getVisuallyMovingListItems: this.currentlyMovingListItems,
            getTopHorizStrip: () => this.topHorizStrip.nativeElement,
            getUpAcceleratingScrollPopover: () =>
              this.upAcceleratingScrollPopover,
            getDownAcceleratingScrollPopover: () =>
              this.downAcceleratingScrollPopover,
            getMovingAggregateRowEl: () => this.movingAggregateRowEl,
            entities,
            idPropName: this.trmrkEntityKeyPropName,
            rowsSelectionIsAllowed: this.trmrkRowsSelectionIsAllowed,
            selectedRowsReorderIsAllowed:
              this.trmrkSelectedRowsReorderIsAllowed,
            selectedRowsReorderAggRowVertIsOriented:
              this.trmrkSelectedRowsReorderAggRowVertIsOriented,
          });

          this.trmrkRowsUpdated.emit(this.panelListService.rows);
        }
      );
    }, 0);
  }

  ngOnDestroy(): void {}

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.panelListService.rowsMasterCheckBoxToggled(event);
  }
}
