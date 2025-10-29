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
import { MatMenuModule, MatMenu, MatMenuTrigger } from '@angular/material/menu';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { TrmrkPanelListItem } from '../trmrk-panel-list-item/trmrk-panel-list-item';
import { TrmrkHorizStrip } from '../trmrk-horiz-strip/trmrk-horiz-strip';

import { whenChanged } from '../../../services/common/simpleChanges';

import { NullOrUndef, VoidOrAny } from '../../../../trmrk/core';

import { TrmrkAcceleratingScrollPopover } from '../trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';
import { TrmrkCancelContextMenu } from '../trmrk-cancel-context-menu/trmrk-cancel-context-menu';

import {
  TrmrkPanelListService,
  TrmrkPanelListServiceRow,
} from '../../../services/common/trmrk-panel-list-service';

@Component({
  selector: 'trmrk-panel-list',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    CommonModule,
    TrmrkCancelContextMenu,
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
  @Input() trmrkPanelHeader!: () => HTMLElement;
  @Input() trmrkVisuallyMovingListItems!: () => QueryList<TrmrkPanelListItem>;

  @Input()
  trmrkUpAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover;

  @Input()
  trmrkDownAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover;

  @Input()
  trmrkToggleAppBar?:
    | ((svc: TrmrkPanelListService<any, any>, show: boolean) => VoidOrAny)
    | NullOrUndef;

  @Input()
  trmrkGetAppBarHeight?:
    | ((svc: TrmrkPanelListService<any, any>) => number)
    | NullOrUndef;

  @Output() trmrkRowsUpdated = new EventEmitter<
    TrmrkPanelListServiceRow<any>[]
  >();

  @ViewChild('panelList')
  panelList!: ElementRef<HTMLDivElement>;

  @ViewChild('rowsMenuTrigger', { read: MatMenuTrigger })
  rowsMenuTrigger!: MatMenuTrigger;

  @ViewChild('rowsMenuTriggerEl')
  rowsMenuTriggerEl!: ElementRef<HTMLDivElement>;

  @ViewChild('rowsMenu')
  rowsMenu!: MatMenu;

  @HostBinding('class.trmrk-scrollable') scrollableCssClass = true;
  @HostBinding('class.trmrk-scrollable-y') scrollableYCssClass = true;

  constructor(
    public hostEl: ElementRef<HTMLElement>,
    public panelListService: TrmrkPanelListService<any, any>
  ) {}

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
        () => {
          this.panelListService.reset();

          this.panelListService.setup({
            getPanelList: () => this.panelList.nativeElement,
            getListItems: this.trmrkListItems,
            rowsMenuTriggerEl: () => this.rowsMenuTriggerEl.nativeElement,
            rowsMenuTrigger: () => this.rowsMenuTrigger,
            rowsMenu: () => this.rowsMenu,
            getVisuallyMovingListItems: this.trmrkVisuallyMovingListItems,
            getPanelHeader: this.trmrkPanelHeader,
            getUpAcceleratingScrollPopover:
              this.trmrkUpAcceleratingScrollPopover,
            getDownAcceleratingScrollPopover:
              this.trmrkDownAcceleratingScrollPopover,
            toggleAppBar: this.trmrkToggleAppBar,
            getAppBarHeight: this.trmrkGetAppBarHeight,
            entities: this.trmrkEntities,
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

  ngOnDestroy(): void {
    this.trmrkRowMenuTemplate = null!;
    this.trmrkRowTemplate = null!;
    this.trmrkVisuallyMovingRowTemplate = null!;
    this.trmrkListItems = null!;
    this.trmrkPanelHeader = null!;
    this.trmrkVisuallyMovingListItems = null!;
    this.trmrkUpAcceleratingScrollPopover = null!;
    this.trmrkDownAcceleratingScrollPopover = null!;
    this.trmrkToggleAppBar = null!;
    this.trmrkVisuallyMovingListItems = null!;
  }
}
