import {
  Injectable,
  ElementRef,
  QueryList,
  Injector,
  OnDestroy,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';

import {
  DragService,
  TrmrkHorizStrip,
  AppBarMapService,
  TrmrkDragEvent,
  AppStateServiceBase,
} from 'trmrk-angular';

import { withVal, actWithVal, NullOrUndef, VoidOrAny } from '../../trmrk/core';
import { filterKvp } from '../../trmrk/arr';

import {
  TouchOrMouseCoords,
  getSingleTouchOrClick,
} from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { clearIntvIfReq } from '../../trmrk-browser/domUtils/core';

import {
  defaultLongPressTimeoutMills,
  defaultFastAnimationDurationMillis,
} from '../../trmrk-browser/core';

import { TrmrkAcceleratingScrollPopover } from '../components/common/trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';

export interface TrmrkPanelListServiceRow<TEntity> {
  item: TrmrkPanelListServiceItemData<TEntity> | null;
  hideItem?: boolean | NullOrUndef;
  id: any;
  isBlankPlaceholder?: boolean | NullOrUndef;
  isMultipleSelectedPlaceholder?: boolean | NullOrUndef;
  multipleSelectedCount?: number | NullOrUndef;
}

export interface TrmrkPanelListServiceItemData<TEntity> {
  data: TEntity;
  isSelected: boolean;
  isFocused: boolean;
}

export interface TrmrkPanelListServiceSetupArgs<TEntity, TItem> {
  getPanelList: () => HTMLElement;
  getListItems: () => QueryList<TItem>;
  rowsMenuTriggerEl: () => HTMLElement;
  rowsMenuTrigger: () => MatMenuTrigger;
  rowsMenu: () => MatMenu;
  getVisuallyMovingListItems: () => QueryList<TItem>;
  getPanelHeader: () => HTMLElement;
  getUpAcceleratingScrollPopover: () => TrmrkAcceleratingScrollPopover | null;
  getDownAcceleratingScrollPopover: () => TrmrkAcceleratingScrollPopover | null;
  getMovingAggregateRowEl: () => TrmrkHorizStrip | null;
  toggleAppBar?:
    | ((svc: TrmrkPanelListService<TEntity, TItem>, show: boolean) => VoidOrAny)
    | NullOrUndef;
  getAppBarHeight?:
    | ((svc: TrmrkPanelListService<TEntity, TItem>) => number)
    | NullOrUndef;
  entities: TEntity[];
  rows?: TrmrkPanelListServiceRow<TEntity>[] | NullOrUndef;
  idPropName?: string | NullOrUndef;
  componentInputDataPropName?: string | NullOrUndef;
  componentIdPropName?: string | NullOrUndef;
  hostElPropName?: string | NullOrUndef;
  rowsSelectionIsAllowed?: boolean | NullOrUndef;
  selectedRowsReorderIsAllowed?: boolean | NullOrUndef;
  selectedRowsReorderAggRowVertIsOriented?: boolean | NullOrUndef;
  selectedRowsReorderShowAggRowDiffYpxThreshold?: number | NullOrUndef;
  selectedRowsReorderAggRowAnimationStepMillis?: number | NullOrUndef;
  selectedRowsReorderAggRowAnimationDurationMillis?: number | NullOrUndef;
}

interface TrmrkMovingPanelListItem<TItem> {
  item: TItem;
  offsetTop: number;
}

interface TrmrkPanelListServiceRowX<TEntity>
  extends TrmrkPanelListServiceRow<TEntity> {
  idx: number;
  offsetTop: number;
}

@Injectable()
export class TrmrkPanelListService<TEntity, TItem> implements OnDestroy {
  getPanelList!: () => HTMLElement;
  getListItems!: () => QueryList<TItem>;
  rowsMenuTriggerEl!: () => HTMLElement;
  rowsMenuTrigger!: () => MatMenuTrigger;
  rowsMenu!: () => MatMenu;
  getVisuallyMovingListItems!: () => QueryList<TItem>;
  getPanelHeader!: () => HTMLElement;
  getUpAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover | null;
  getDownAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover | null;
  getMovingAggregateRowEl!: () => TrmrkHorizStrip | null;
  entities!: TEntity[];
  rows!: TrmrkPanelListServiceRow<TEntity>[];
  idPropName!: string;
  componentInputDataPropName!: string;
  componentIdPropName!: string;
  hostElPropName!: string;
  appBarHeight!: number;
  panelHeaderHeight!: number;

  toggleAppBar!: (
    svc: TrmrkPanelListService<TEntity, TItem>,
    show: boolean
  ) => VoidOrAny;

  getAppBarHeight!: (svc: TrmrkPanelListService<TEntity, TItem>) => number;

  hasPendingReorder = false;
  showPendingReorderStrip = false;
  rowsAreSelectable!: boolean;
  rowsMasterCheckBoxIsChecked!: boolean;
  selectedRowsCount = 0;
  focusedRowIdx: number | null = null;
  rowsSelectionIsAllowed!: boolean;
  selectedRowsReorderIsAllowed!: boolean;
  selectedRowsReorderAggRowVertIsOriented!: boolean;
  selectedRowsReorderShowAggRowDiffYpxThreshold!: number;
  selectedRowsReorderAggRowAnimationStepMillis!: number;
  selectedRowsReorderAggRowAnimationDurationMillis!: number;

  isMovingSelectedRows = false;
  showAcceleratingScrollPopovers = false;
  selectedRowsReorderAggRowAnimationStartTime: number | null = null;
  selectedRowsReorderAggRowAnimationIntervalId: NodeJS.Timeout | null = null;
  beforeMovingSelectedRowsListViewScrollTop: number | null = null;

  visuallyMovingRows: TrmrkPanelListServiceRowX<TEntity>[] | null = null;
  visuallyMovingListItems: TItem[] | null = null;
  visuallyMovingMainRowIdx: number | null = null;
  showVisuallyMovingRows = false;
  showMovingAggregateRow = false;
  slideOutVisuallyMovingRowPlaceholders = false;

  acceleratingPopoverPads: HTMLElement[] | null = null;
  downAcceleratingPopoverCancelBtn: HTMLElement | null = null;
  acceleratingScrollPopoverIdx = -1;
  acceleratingScrollPadIdx = -1;
  downAcceleratingPopoverCancelBtnIsFocused = false;
  rowContentMouseDownOrTouchStartCoords: TouchOrMouseCoords | null = null;
  rowsMenuIsOpen = false;

  private rowLeadingIconDragSubscriptions: Subscription[] | null = null;
  private rowLeadingIconDragEndSubscriptions: Subscription[] | null = null;

  private leadingIconDragServices: DragService[] | null = null;

  private rowsMenuOpenedSubscription: Subscription | null = null;
  private rowsMenuClosedSubscription: Subscription | null = null;

  // _temp = 0;

  constructor(
    public appStateService: AppStateServiceBase,
    public appBarMapService: AppBarMapService
  ) {}

  ngOnDestroy(): void {
    this.reset();
  }

  setup(args: TrmrkPanelListServiceSetupArgs<TEntity, TItem>) {
    this.getPanelList = args.getPanelList;
    this.getListItems = args.getListItems;
    this.rowsMenuTriggerEl = args.rowsMenuTriggerEl;
    this.rowsMenuTrigger = args.rowsMenuTrigger;
    this.rowsMenu = args.rowsMenu;
    this.getVisuallyMovingListItems = args.getVisuallyMovingListItems;
    this.getPanelHeader = args.getPanelHeader;
    this.getUpAcceleratingScrollPopover = args.getUpAcceleratingScrollPopover;
    this.getDownAcceleratingScrollPopover =
      args.getDownAcceleratingScrollPopover;
    this.getMovingAggregateRowEl = args.getMovingAggregateRowEl;
    this.toggleAppBar =
      args.toggleAppBar ??
      ((svc, show) => svc.appStateService.showAppBar.next(show));
    this.getAppBarHeight =
      args.getAppBarHeight ??
      ((svc) => svc.appBarMapService.getCurrent()?.offsetHeight ?? 0);
    this.entities = args.entities;
    this.idPropName = args.idPropName ?? 'id';
    this.componentInputDataPropName =
      args.componentInputDataPropName ?? 'trmrkInputData';
    this.componentIdPropName = args.componentIdPropName ?? this.idPropName;
    this.hostElPropName = args.hostElPropName ?? 'hostEl';
    this.panelHeaderHeight = this.getPanelHeader().offsetHeight;
    this.rowsSelectionIsAllowed = args.rowsSelectionIsAllowed ?? false;

    this.selectedRowsReorderIsAllowed =
      args.selectedRowsReorderIsAllowed ?? false;

    this.selectedRowsReorderAggRowVertIsOriented =
      args.selectedRowsReorderAggRowVertIsOriented ?? false;

    this.selectedRowsReorderShowAggRowDiffYpxThreshold =
      args.selectedRowsReorderShowAggRowDiffYpxThreshold ?? 20;

    this.selectedRowsReorderAggRowAnimationStepMillis =
      args.selectedRowsReorderAggRowAnimationStepMillis ?? 1;

    this.selectedRowsReorderAggRowAnimationDurationMillis =
      args.selectedRowsReorderAggRowAnimationDurationMillis ??
      defaultFastAnimationDurationMillis;

    this.rows =
      args.rows ??
      args.entities.map((ent, i) => ({
        item: {
          data: ent,
          isSelected: false,
          isFocused: false,
        },
        id: (ent as any)[this.idPropName],
      }));

    this.rows = this.rows.map((row) => ({ ...row }));

    this.rowsMenuOpenedSubscription =
      this.rowsMenuTrigger().menuOpened.subscribe(() => {
        setTimeout(() => {
          this.rowsMenuIsOpen = true;
        });
      });

    this.rowsMenuClosedSubscription =
      this.rowsMenuTrigger().menuClosed.subscribe(() => {
        this.rowsMenuIsOpen = false;
      });

    setTimeout(() => {
      const listItems = this.getListItems();

      this.leadingIconDragServices = this.rows.map((_, idx) => {
        const dragService = Injector.create({
          providers: [{ provide: DragService, useClass: DragService }],
        }).get(DragService);

        const listItemComponent = listItems.get(idx);
        const listItem = this.getItemHostEl(listItemComponent!);

        dragService.init(listItem);
        return dragService;
      });

      if (this.selectedRowsReorderIsAllowed) {
        this.rowLeadingIconDragSubscriptions = listItems.map((_, idx) =>
          this.leadingIconDragServices![idx].drag.subscribe((event) => {
            this.onDrag(event);
          })
        );

        this.rowLeadingIconDragEndSubscriptions = listItems.map((_, idx) =>
          this.leadingIconDragServices![idx].dragEnd.subscribe((_) => {
            if (!this.downAcceleratingPopoverCancelBtnIsFocused) {
              this.hasPendingReorder = true;
              this.showPendingReorderStrip = true;
            } else if (this.hasPendingReorder) {
              this.showPendingReorderStrip = true;
            }
            // if (!this._temp++) {
            this.resetVisuallyMovingRows();
            // }
          })
        );
      }
    }, 0);
  }

  reset() {
    this.resetVisuallyMovingRows();

    for (let dragService of this.leadingIconDragServices ?? []) {
      dragService.Dispose();
    }

    for (let subscription of this.rowLeadingIconDragSubscriptions ?? []) {
      subscription.unsubscribe();
    }

    for (let subscription of this.rowLeadingIconDragEndSubscriptions ?? []) {
      subscription.unsubscribe();
    }

    if (this.rowsMenuOpenedSubscription) {
      this.rowsMenuOpenedSubscription.unsubscribe();
    }

    if (this.rowsMenuClosedSubscription) {
      this.rowsMenuClosedSubscription.unsubscribe();
    }
  }

  onDrag(event: TrmrkDragEvent) {
    const { touchOrMouseMoveCoords, touchStartOrMouseDownCoords } = event;
    touchOrMouseMoveCoords.evt!.preventDefault();

    const diffY =
      touchOrMouseMoveCoords.clientY - touchStartOrMouseDownCoords.clientY;

    if (
      !this.selectedRowsReorderAggRowAnimationStartTime &&
      !this.showAcceleratingScrollPopovers
    ) {
      this.onDragStart(diffY);
    } else if (this.showAcceleratingScrollPopovers) {
      this.onDragCore(touchOrMouseMoveCoords, diffY);
    }
  }

  onDragStart(diffY: number) {
    if (Math.abs(diffY) >= this.selectedRowsReorderShowAggRowDiffYpxThreshold) {
      this.selectedRowsReorderAggRowAnimationStartTime = new Date().getTime();

      this.selectedRowsReorderAggRowAnimationIntervalId = setInterval(() => {
        const now = new Date().getTime();

        const diffMillis =
          now - this.selectedRowsReorderAggRowAnimationStartTime!;

        const diffFraction =
          diffMillis / this.selectedRowsReorderAggRowAnimationDurationMillis;

        let visuallyMovingMainRow: TrmrkPanelListServiceRowX<TEntity>;

        this.iterateVisuallyMovingItems(
          (item, itemHostEl, visuallyMovingRow, i) => {
            this.updateItemTopPx(
              itemHostEl,
              visuallyMovingRow,
              diffY -
                Math.min(1, diffFraction) *
                  (visuallyMovingRow.offsetTop -
                    visuallyMovingMainRow.offsetTop)
            );
          },
          (visuallyMovingListItems, visuallyMovingRows) => {
            visuallyMovingMainRow = visuallyMovingRows.find(
              (row) => row.idx === this.visuallyMovingMainRowIdx
            )!;
          }
        );

        if (diffFraction >= 1) {
          this.clearSelectedRowsReorderAggRowAnimationIntervalId();
          this.showAcceleratingScrollPopovers = true;
          this.slideOutVisuallyMovingRowPlaceholders = true;
          this.showVisuallyMovingRows = false;
          this.showMovingAggregateRow = true;
          this.toggleAppBar(this, false);
        }
      }, this.selectedRowsReorderAggRowAnimationStepMillis);
    } else {
      this.iterateVisuallyMovingItems(
        (item, itemHostEl, visuallyMovingRow, i) => {
          this.updateItemTopPx(itemHostEl, visuallyMovingRow, diffY);
        }
      );
    }
  }

  onDragCore(touchOrMouseMoveCoords: TouchOrMouseCoords, diffY: number) {
    const movingAggregateRowEl = this.getMovingAggregateRowEl();

    const upAcceleratingScrollPopover = this.getUpAcceleratingScrollPopover()
      ?.hostEl.nativeElement as HTMLElement | undefined;

    const downAcceleratingScrollPopover =
      this.getDownAcceleratingScrollPopover()?.hostEl.nativeElement as
        | HTMLElement
        | undefined;

    if (
      movingAggregateRowEl &&
      this.visuallyMovingRows &&
      upAcceleratingScrollPopover &&
      downAcceleratingScrollPopover
    ) {
      this.updateItemTopPx(
        movingAggregateRowEl.hostEl.nativeElement,
        this.visuallyMovingRows.find(
          (row) => row.idx === this.visuallyMovingMainRowIdx
        )!,
        diffY -
          upAcceleratingScrollPopover.offsetHeight +
          this.panelHeaderHeight
      );

      const acceleratingScrollPopovers = [
        upAcceleratingScrollPopover,
        downAcceleratingScrollPopover,
      ];

      this.acceleratingPopoverPads ??= acceleratingScrollPopovers
        .map((popover) =>
          ['left', 'middle', 'right'].map(
            (pfx) =>
              popover.querySelector(`.trmrk-${pfx}-scroll-pad`) as HTMLElement
          )
        )
        .reduce((map1, map2) => [...map1, ...map2]);

      this.downAcceleratingPopoverCancelBtn ??=
        acceleratingScrollPopovers[1].querySelector('.trmrk-cancel-icon-btn');

      let acceleratingScrollPadIdx = -1;
      const coordsClientX = touchOrMouseMoveCoords.clientX;
      const coordsClientY = touchOrMouseMoveCoords.clientY;

      this.acceleratingScrollPopoverIdx = acceleratingScrollPopovers.findIndex(
        (_, idx) =>
          withVal(
            this.acceleratingPopoverPads![idx * 3].getBoundingClientRect(),
            (rect) => coordsClientY >= rect.top && coordsClientY <= rect.bottom
          )
      );

      if (this.acceleratingScrollPopoverIdx >= 0) {
        const aceleratingPadIdx = this.acceleratingPopoverPads
          .slice(
            this.acceleratingScrollPopoverIdx * 3,
            (this.acceleratingScrollPopoverIdx + 1) * 3
          )
          .findIndex((pad) =>
            withVal(
              pad.getBoundingClientRect(),
              (rect) =>
                coordsClientX >= rect.left && coordsClientX <= rect.right
            )
          );

        if (aceleratingPadIdx >= 0) {
          acceleratingScrollPadIdx =
            this.acceleratingScrollPopoverIdx * 3 + aceleratingPadIdx;
        }
      }

      this.acceleratingScrollPadIdx = acceleratingScrollPadIdx;

      this.downAcceleratingPopoverCancelBtnIsFocused =
        acceleratingScrollPadIdx === 4 &&
        withVal(
          this.downAcceleratingPopoverCancelBtn!.getBoundingClientRect(),
          (rect) =>
            coordsClientX >= rect.left &&
            coordsClientX <= rect.right &&
            coordsClientY >= rect.top &&
            coordsClientY <= rect.bottom
        );
    }
  }

  rowCheckBoxToggled(event: MatCheckboxChange, idx: number) {
    const row = this.rows[idx];
    row.item!.isSelected = event.checked;

    if (event.checked) {
      this.selectedRowsCount++;
    } else {
      this.selectedRowsCount--;
    }

    if (this.selectedRowsCount === 0) {
      this.rowsAreSelectable = false;
      this.hasPendingReorder = false;
      this.showPendingReorderStrip = false;
    } else if (this.selectedRowsCount === this.rows.length) {
      this.rowsMasterCheckBoxIsChecked = true;
    } else {
      this.rowsMasterCheckBoxIsChecked = false;
    }
  }

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.toggleSelectedRows(event.checked);
  }

  rowIconLongPressOrRightClick(event: TouchOrMouseCoords, idx: number) {
    if (this.rowsSelectionIsAllowed && !this.rowsAreSelectable) {
      this.rowsAreSelectable = true;
      const row = this.rows[idx];
      row.item!.isSelected = true;
      this.selectedRowsCount = 1;
    }
  }

  rowMouseDownOrTouchStart(event: MouseEvent | TouchEvent, idx: number) {
    for (let row of this.rows) {
      if (row.item) {
        row.item!.isFocused = false;
      }
    }

    this.focusedRowIdx = idx;
    const row = this.rows[idx];

    if (row.item) {
      row.item!.isFocused = true;
    }
  }

  rowTextLongPresOrRightClick(event: TouchOrMouseCoords, idx: number) {
    setTimeout(() => {
      this.openRowContextMenu(event);
    });
  }

  rowLeadingIconMouseDownOrTouchStart(
    event: MouseEvent | TouchEvent,
    idx: number
  ) {
    if (this.rowsAreSelectable && this.selectedRowsReorderIsAllowed) {
      const row = this.rows[idx];

      if (row.item!.isSelected) {
        this.rowContentMouseDownOrTouchStartCoords =
          this.leadingIconDragServices![idx].onTouchStartOrMouseDown(event);

        if (this.rowContentMouseDownOrTouchStartCoords) {
          this.appBarHeight = this.getAppBarHeight(this);

          this.visuallyMovingRows = this.getVisuallyMovingRows(
            this.rowContentMouseDownOrTouchStartCoords,
            idx
          );

          this.isMovingSelectedRows = true;
          this.visuallyMovingMainRowIdx = idx;
          const panelList = this.getPanelList();
          panelList.classList.add('trmrk-no-touch-scroll');

          setTimeout(() => {
            if (this.isMovingSelectedRows) {
              this.beforeMovingSelectedRowsListViewScrollTop =
                panelList.scrollTop;

              this.iterateVisuallyMovingItems(
                (item, itemHostEl, visuallyMovingRow, i) => {
                  this.updateItemTopPx(itemHostEl, visuallyMovingRow);
                }
              );

              this.showVisuallyMovingRows = true;

              this.visuallyMovingListItems = actWithVal(
                this.getVisuallyMovingListItems().toArray(),
                (visuallyMovingListItems) =>
                  visuallyMovingListItems.sort(
                    (a, b) =>
                      this.visuallyMovingRows!.findIndex(
                        (row) =>
                          row.id ===
                          (a as any)[this.componentInputDataPropName][
                            this.componentIdPropName
                          ]
                      ) -
                      this.visuallyMovingRows!.findIndex(
                        (row) =>
                          row.id ===
                          (b as any)[this.componentInputDataPropName][
                            this.componentIdPropName
                          ]
                      )
                  )
              );

              setTimeout(() => {
                if (this.isMovingSelectedRows) {
                  const maxIdx = this.rows.length - 1;
                  let sliceStIdx = 0;
                  let secondPrevRow: TrmrkPanelListServiceRow<TEntity> | null =
                    null;
                  let prevRow: TrmrkPanelListServiceRow<TEntity> | null = null;
                  let row: TrmrkPanelListServiceRow<TEntity> | null = null;

                  for (let i = 0; i <= maxIdx; i++) {
                    secondPrevRow = prevRow;
                    prevRow = row;
                    row = this.rows[i];

                    if (row.item!.isSelected) {
                      row.hideItem = true;

                      if (prevRow && !prevRow.item!.isSelected) {
                        sliceStIdx = i;
                      }
                    } else {
                      if (prevRow && prevRow.item!.isSelected) {
                        prevRow.isMultipleSelectedPlaceholder = true;
                        prevRow.multipleSelectedCount = i - sliceStIdx;
                      }
                    }

                    if (
                      secondPrevRow &&
                      !secondPrevRow.isMultipleSelectedPlaceholder &&
                      secondPrevRow.item!.isSelected
                    ) {
                      secondPrevRow.isBlankPlaceholder = true;
                    }
                  }
                }
              }, 0);
            }
          }, 0);
        }
      }
    }
  }

  toggleSelectedRows(selected: boolean) {
    this.rowsMasterCheckBoxIsChecked = selected;

    for (let row of this.rows) {
      if (row.item) {
        row.item!.isSelected = selected;
      }
    }

    if (!selected) {
      this.rowsAreSelectable = false;
      this.selectedRowsCount = 0;
      this.hasPendingReorder = false;
      this.showPendingReorderStrip = false;
    } else {
      this.selectedRowsCount = this.rows.length;
    }
  }

  private getVisuallyMovingRows(coords: TouchOrMouseCoords, idx: any) {
    const panelList = this.getPanelList();
    const scrollTop = panelList.scrollTop;
    const height = panelList.offsetHeight;

    const startY = scrollTop;
    const endY = scrollTop + height;

    const listItems = this.getListItems().toArray();

    listItems.sort(
      (a, b) =>
        this.rows.findIndex(
          (row) =>
            row.id ===
            (a as any)[this.componentInputDataPropName][
              this.componentIdPropName
            ]
        ) -
        this.rows.findIndex(
          (row) =>
            row.id ===
            (b as any)[this.componentInputDataPropName][
              this.componentIdPropName
            ]
        )
    );

    const sliceArrFactory = (incIdx: boolean) =>
      filterKvp<TItem[], TItem, TrmrkMovingPanelListItem<TItem>>({
        collection: listItems,
        predicate: (args) => {
          let retVal = this.rows[args.idx].item?.isSelected ?? false;

          if (retVal) {
            const offsetTop = args.value.offsetTop;
            retVal = incIdx ? offsetTop <= endY : offsetTop >= startY;

            if (!retVal) {
              args.loopHandler.break = true;
            }
          }

          return retVal;
        },
        selector: (item, i) => ({
          item,
          offsetTop: this.getItemHostEl(item).offsetTop,
        }),
        collectionItemRetriever: (coll, i) => coll[i],
        collectionLengthRetriever: (coll) => coll.length,
        endIdx: incIdx ? -1 : 0,
        startIdx: incIdx ? idx + 1 : idx,
        incrementIdx: incIdx ? 1 : -1,
      });

    const sliceArr = sliceArrFactory(false).reverse();
    const secondSliceArr = sliceArrFactory(true);
    sliceArr.splice(-1, 0, ...secondSliceArr);

    const visuallyMovingRows = sliceArr.map((kvp) => {
      const row = this.rows[kvp.key];

      const retRow: TrmrkPanelListServiceRowX<TEntity> = {
        ...row,
        idx: kvp.key,
        offsetTop: kvp.value.offsetTop,
      };

      return retRow;
    });

    return visuallyMovingRows;
  }

  private openRowContextMenu(coords: TouchOrMouseCoords) {
    const menuTriggerEl = this.rowsMenuTriggerEl();

    const elementsFromPoint = document.elementsFromPoint(
      coords.clientX,
      coords.clientY
    );

    const targetEl = elementsFromPoint.find((el) =>
      el.parentElement!.classList.contains('trmrk-panel-list')
    ) as HTMLElement;

    menuTriggerEl.style.top = `${targetEl.offsetTop}px`;
    menuTriggerEl.style.left = `${targetEl.offsetLeft}px`;
    this.rowsMenuTrigger().openMenu();
  }

  private clearSelectedRowsReorderAggRowAnimationIntervalId() {
    clearIntvIfReq(this.selectedRowsReorderAggRowAnimationIntervalId);
    this.selectedRowsReorderAggRowAnimationIntervalId = null;
    this.selectedRowsReorderAggRowAnimationStartTime = null;
  }

  private resetVisuallyMovingRows() {
    this.clearSelectedRowsReorderAggRowAnimationIntervalId();

    for (let row of this.rows ?? []) {
      row.hideItem = null;
      row.isBlankPlaceholder = null;
      row.isMultipleSelectedPlaceholder = null;
      row.multipleSelectedCount = null;
    }

    this.showAcceleratingScrollPopovers = false;
    this.isMovingSelectedRows = false;
    this.visuallyMovingRows = null;
    this.visuallyMovingListItems = null;
    this.showVisuallyMovingRows = false;
    this.showMovingAggregateRow = false;
    this.slideOutVisuallyMovingRowPlaceholders = false;
    this.visuallyMovingMainRowIdx = null;
    this.toggleAppBar?.call(this, this, true);

    const panelList = this.getPanelList?.call(this);
    panelList?.classList.remove('trmrk-no-touch-scroll');

    this.acceleratingPopoverPads = null;
    this.acceleratingScrollPadIdx = -1;
    this.downAcceleratingPopoverCancelBtn = null;
    this.downAcceleratingPopoverCancelBtnIsFocused = false;
    this.rowContentMouseDownOrTouchStartCoords = null;
  }

  private getItemHostEl(item: TItem) {
    const hostEl = ((item as any)[this.hostElPropName] as ElementRef)
      .nativeElement as HTMLElement;

    return hostEl;
  }

  private updateItemTopPx(
    itemHostEl: HTMLElement,
    visuallyMovingRow: TrmrkPanelListServiceRowX<TEntity>,
    diffY: number = 0
  ) {
    const panelList = this.getPanelList();

    const topPx =
      visuallyMovingRow.offsetTop +
      Math.round(diffY) +
      panelList.scrollTop -
      this.beforeMovingSelectedRowsListViewScrollTop! +
      this.appBarHeight -
      this.getAppBarHeight(this);

    itemHostEl.style.top = `${topPx}px`;
  }

  private iterateVisuallyMovingItems(
    callback: (
      item: TItem,
      itemHostEl: HTMLElement,
      visuallyMovingRow: TrmrkPanelListServiceRowX<TEntity>,
      idx: number
    ) => void,
    onBeforeLoop:
      | ((
          visuallyMovingListItems: QueryList<TItem>,
          visuallyMovingRows: TrmrkPanelListServiceRowX<TEntity>[]
        ) => void)
      | NullOrUndef = null,
    onNotAvailable:
      | ((
          visuallyMovingListItems: QueryList<TItem>,
          visuallyMovingRows: TrmrkPanelListServiceRowX<TEntity>[] | null
        ) => void)
      | NullOrUndef = null
  ) {
    const visuallyMovingListItems = this.getVisuallyMovingListItems();
    const visuallyMovingRows = this.visuallyMovingRows;

    if (visuallyMovingRows?.length && visuallyMovingListItems.get(0)) {
      if (onBeforeLoop) {
        onBeforeLoop(visuallyMovingListItems, visuallyMovingRows);
      }

      for (let i = 0; i < visuallyMovingRows.length; i++) {
        const item = visuallyMovingListItems.get(i)!;
        const row = visuallyMovingRows[i];
        const itemHostEl = this.getItemHostEl(item);

        callback(item, itemHostEl, row, i);
      }
    } else {
      if (onNotAvailable) {
        onNotAvailable(visuallyMovingListItems, visuallyMovingRows);
      }
    }
  }
}
