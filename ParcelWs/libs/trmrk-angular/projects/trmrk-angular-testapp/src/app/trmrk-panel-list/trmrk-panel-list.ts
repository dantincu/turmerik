import {
  Component,
  ViewChild,
  HostBinding,
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
  ViewEncapsulation,
} from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import {
  TrmrkPanelListItem,
  TrmrkHorizStrip,
  materialIcons,
} from 'trmrk-angular';

import { whenChanged } from 'trmrk-angular';

import { TrmrkAcceleratingScrollPopover } from '../trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';
import { TrmrkCancelContextMenu } from '../trmrk-cancel-context-menu/trmrk-cancel-context-menu';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../services/trmrk-panel-list-service';

import { TrmrkCancelContextMenu as TrmrkCancelContextMenuDirective } from '../directives/trmrk-cancel-context-menu';

@Component({
  selector: 'trmrk-panel-list',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    TrmrkHorizStrip,
    TrmrkCancelContextMenu,
    TrmrkCancelContextMenuDirective,
  ],
  templateUrl: './trmrk-panel-list.html',
  styleUrl: './trmrk-panel-list.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TrmrkPanelList implements OnChanges, AfterViewInit, OnDestroy {
  @Input() trmrkCssClass: string | null = null;
  @Input() trmrkEntities!: any[];
  @Input() trmrkEntityKeyPropName = 'id';
  @Input() trmrkRowMenuTemplate!: TemplateRef<any>;
  @Input() trmrkRowsSelectionIsAllowed = false;
  @Input() trmrkSelectedRowsReorderIsAllowed = false;
  @Input() trmrkSelectedRowsReorderAggRowVertIsOriented = false;
  @Input() trmrkRowTemplate!: TemplateRef<any>;
  @Input() trmrkVisuallyMovingRowTemplate!: TemplateRef<any>;
  @Input() trmrkListItems!: () => QueryList<TrmrkPanelListItem>;
  @Input() topHorizStrip!: () => HTMLElement;
  @Input() trmrkVisuallyMovingListItems!: () => QueryList<TrmrkPanelListItem>;

  @Input()
  trmrkUpAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover;

  @Input()
  trmrkDownAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover;

  @Output() trmrkRowsUpdated = new EventEmitter<
    TrmrkPanelListServiceRow<any>[]
  >();

  @ViewChild('panelList')
  panelList!: ElementRef<HTMLDivElement>;

  @ViewChild('movingAggregateRowEl')
  movingAggregateRowEl!: TrmrkHorizStrip;

  @ViewChild('rowsMenuTrigger', { read: MatMenuTrigger })
  rowsMenuTrigger!: MatMenuTrigger;

  @ViewChild('rowsMenuTriggerEl')
  rowsMenuTriggerEl!: ElementRef<HTMLDivElement>;

  @ViewChild('rowsMenu')
  rowsMenu!: MatMenu;

  @HostBinding('class.trmrk-scrollable') scrollableCssClass = true;
  @HostBinding('class.trmrk-scrollable-y') scrollableYCssClass = true;

  dragPanIcon: SafeHtml;

  constructor(
    public hostEl: ElementRef<HTMLElement>,
    public panelListService: TrmrkPanelListService<any, any>,
    private sanitizer: DomSanitizer
  ) {
    this.dragPanIcon = this.sanitizer.bypassSecurityTrustHtml(
      materialIcons.drag_pan
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.rowsMenuTrigger.menu = this.rowsMenu;
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    setTimeout(() => {
      whenChanged(
        changes,
        () => this.trmrkEntities,
        (entities) => {
          this.panelListService.reset();

          this.panelListService.setup({
            getPanelList: () => this.panelList.nativeElement,
            getListItems: this.trmrkListItems,
            rowsMenuTriggerEl: () => this.rowsMenuTriggerEl.nativeElement,
            rowsMenuTrigger: () => this.rowsMenuTrigger,
            rowsMenu: () => this.rowsMenu,
            getVisuallyMovingListItems: this.trmrkVisuallyMovingListItems,
            getTopHorizStrip: this.topHorizStrip,
            getUpAcceleratingScrollPopover:
              this.trmrkUpAcceleratingScrollPopover,
            getDownAcceleratingScrollPopover:
              this.trmrkDownAcceleratingScrollPopover,
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
}
