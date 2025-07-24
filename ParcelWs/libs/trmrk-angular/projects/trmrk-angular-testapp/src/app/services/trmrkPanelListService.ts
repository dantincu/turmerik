import {
  Injectable,
  ElementRef,
  QueryList,
  Injector,
  OnDestroy,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

import { DragService, TrmrkHorizStrip } from 'trmrk-angular';

import { filterKvp } from '../../trmrk/arr';
import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

import { TrmrkAcceleratingScrollPopover } from '../trmrk-accelerating-scroll-popover/trmrk-accelerating-scroll-popover';

export interface TrmrkPanelListServiceRow<TEntity> {
  item: TrmrkPanelListServiceItemData<TEntity> | null;
  hideItem?: boolean | null | undefined;
  id: any;
  isBlankPlaceholder?: boolean | null | undefined;
  isMultipleSelectedPlaceholder?: boolean | null | undefined;
  multipleSelectedCount?: number | null | undefined;
}

export interface TrmrkPanelListServiceItemData<TEntity> {
  data: TEntity;
  isSelected: boolean;
}

export interface TrmrkPanelListServiceSetupArgs<TEntity, TItem> {
  getListView: () => HTMLElement;
  getListItems: () => QueryList<TItem>;
  getVisuallyMovingListItems: () => QueryList<TItem>;
  getUpAcceleratingScrollPopover: () => TrmrkAcceleratingScrollPopover | null;
  getDownAcceleratingScrollPopover: () => TrmrkAcceleratingScrollPopover | null;
  getMovingAggregateRowEl: () => TrmrkHorizStrip | null;
  entities: TEntity[];
  rows?: TrmrkPanelListServiceRow<TEntity>[] | null | undefined;
  idPropName?: string | null | undefined;
  hostElPropName?: string | null | undefined;
  rowsSelectionIsAllowed?: boolean | null | undefined;
  selectedRowsReorderIsAllowed?: boolean | null | undefined;
  selectedRowsReorderAggRowVertIsOriented?: boolean | null | undefined;
  selectedRowsReorderShowAggRowDiffYpxThreshold?: number | null | undefined;
  selectedRowsReorderAggRowAnimationStepMillis?: number | null | undefined;
  selectedRowsReorderAggRowAnimationDurationMillis?: number | null | undefined;
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
  getListView!: () => HTMLElement;
  getListItems!: () => QueryList<TItem>;
  getVisuallyMovingListItems!: () => QueryList<TItem>;
  getUpAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover | null;
  getDownAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover | null;
  getMovingAggregateRowEl!: () => TrmrkHorizStrip | null;
  entities!: TEntity[];
  rows!: TrmrkPanelListServiceRow<TEntity>[];
  idPropName!: string;
  hostElPropName!: string;

  rowsAreSelectable!: boolean;
  rowsMasterCheckBoxIsChecked!: boolean;
  rowsSelectionIsAllowed!: boolean;
  selectedRowsReorderIsAllowed!: boolean;
  selectedRowsReorderAggRowVertIsOriented!: boolean;
  selectedRowsReorderShowAggRowDiffYpxThreshold!: number;
  selectedRowsReorderAggRowAnimationStepMillis!: number;
  selectedRowsReorderAggRowAnimationDurationMillis!: number;
  isMovingSelectedRows = false;
  selectedRowsCount = 0;
  showAcceleratingScrollPopovers = false;
  selectedRowsReorderAggRowAnimationStartTime: number | null = null;
  selectedRowsReorderAggRowAnimationIntervalId: NodeJS.Timeout | null = null;
  beforeMovingSelectedRowsListViewScrollTop: number | null = null;

  visuallyMovingRows: TrmrkPanelListServiceRowX<TEntity>[] | null = null;
  visuallyMovingMainRowIdx: number | null = null;
  showVisuallyMovingRows = false;
  showMovingAggregateRow = false;
  slideOutVisuallyMovingRowPlaceholders = false;

  rowLeadingIconDragSubscriptions: Subscription[] | null = null;
  rowLeadingIconDragEndSubscriptions: Subscription[] | null = null;

  private leadingIconDragServices: DragService[] | null = null;

  ngOnDestroy(): void {
    this.reset();
  }

  setup(args: TrmrkPanelListServiceSetupArgs<TEntity, TItem>) {
    this.getListItems = args.getListItems;
    this.getVisuallyMovingListItems = args.getVisuallyMovingListItems;
    this.getListView = args.getListView;
    this.getUpAcceleratingScrollPopover = args.getUpAcceleratingScrollPopover;
    this.getDownAcceleratingScrollPopover =
      args.getDownAcceleratingScrollPopover;
    this.getMovingAggregateRowEl = args.getMovingAggregateRowEl;
    this.entities = args.entities;
    this.idPropName = args.idPropName ?? 'id';
    this.hostElPropName = args.hostElPropName ?? 'hostEl';
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
      args.selectedRowsReorderAggRowAnimationDurationMillis ?? 100;

    this.rows =
      args.rows ??
      args.entities.map((ent) => ({
        item: {
          data: ent,
          isSelected: false,
        },
        id: (ent as any)[this.idPropName],
      }));

    this.rows = this.rows.map((row) => ({ ...row }));

    setTimeout(() => {
      this.leadingIconDragServices = this.rows.map((_, idx) => {
        const dragService = Injector.create({
          providers: [{ provide: DragService, useClass: DragService }],
        }).get(DragService);

        const listItems = this.getListItems();
        const listItemComponent = listItems.get(idx);
        const listItem = this.getItemHostEl(listItemComponent!);

        dragService.init(listItem);

        if (this.selectedRowsReorderIsAllowed) {
          this.rowLeadingIconDragSubscriptions = listItems.map(() =>
            dragService.drag.subscribe((event) => {
              event.touchOrMouseMoveCoords.evt!.preventDefault();

              const diffY =
                event.touchOrMouseMoveCoords.clientY -
                event.touchStartOrMouseDownCoords.clientY;

              if (
                !this.selectedRowsReorderAggRowAnimationStartTime &&
                !this.showAcceleratingScrollPopovers
              ) {
                if (
                  Math.abs(diffY) >=
                  this.selectedRowsReorderShowAggRowDiffYpxThreshold
                ) {
                  this.selectedRowsReorderAggRowAnimationStartTime =
                    new Date().getTime();

                  this.selectedRowsReorderAggRowAnimationIntervalId =
                    setInterval(() => {
                      const now = new Date().getTime();

                      const diffMillis =
                        now - this.selectedRowsReorderAggRowAnimationStartTime!;

                      const diffFraction =
                        diffMillis /
                        this.selectedRowsReorderAggRowAnimationDurationMillis;

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
                      }
                    }, this.selectedRowsReorderAggRowAnimationStepMillis);
                } else {
                  this.iterateVisuallyMovingItems(
                    (item, itemHostEl, visuallyMovingRow, i) => {
                      this.updateItemTopPx(
                        itemHostEl,
                        visuallyMovingRow,
                        diffY
                      );
                    }
                  );
                }
              } else if (this.showAcceleratingScrollPopovers) {
                const movingAggregateRowEl = this.getMovingAggregateRowEl();

                if (movingAggregateRowEl && this.visuallyMovingRows) {
                  this.updateItemTopPx(
                    movingAggregateRowEl.hostEl.nativeElement,
                    this.visuallyMovingRows.find(
                      (row) => row.idx === this.visuallyMovingMainRowIdx
                    )!,
                    diffY - 10
                  );
                }
              }
            })
          );

          this.rowLeadingIconDragEndSubscriptions = listItems.map(() =>
            dragService.dragEnd.subscribe((_) => {
              this.resetVisuallyMovingRows();
            })
          );
        }

        return dragService;
      });
    }, 0);
  }

  reset() {
    this.clearSelectedRowsReorderAggRowAnimationIntervalId();

    for (let dragService of this.leadingIconDragServices ?? []) {
      dragService.Dispose();
    }

    for (let subscription of this.rowLeadingIconDragSubscriptions ?? []) {
      subscription.unsubscribe();
    }

    for (let subscription of this.rowLeadingIconDragEndSubscriptions ?? []) {
      subscription.unsubscribe();
    }
  }

  rowCheckBoxToggled(event: MatCheckboxChange, id: any) {
    const row = this.rows.find(
      (row) => row.item && (row.item.data as any)[this.idPropName] === id
    )!;

    row.item!.isSelected = event.checked;

    if (event.checked) {
      this.selectedRowsCount++;
    } else {
      this.selectedRowsCount--;
    }

    if (this.selectedRowsCount === 0) {
      this.rowsAreSelectable = false;
    } else if (this.selectedRowsCount === this.rows.length) {
      this.rowsMasterCheckBoxIsChecked = true;
    } else {
      this.rowsMasterCheckBoxIsChecked = false;
    }
  }

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    this.rowsMasterCheckBoxIsChecked = event.checked;

    for (let row of this.rows) {
      if (row.item) {
        row.item!.isSelected = event.checked;
      }
    }

    if (!event.checked) {
      this.rowsAreSelectable = false;
      this.selectedRowsCount = 0;
    } else {
      this.selectedRowsCount = this.rows.length;
    }
  }

  rowIconLongPressOrRightClick(event: TouchOrMouseCoords, id: any) {
    if (this.rowsSelectionIsAllowed && !this.rowsAreSelectable) {
      this.rowsAreSelectable = true;

      const row = this.rows.find(
        (row) => row.item && (row.item.data as any)[this.idPropName] === id
      )!;

      row.item!.isSelected = true;
      this.selectedRowsCount = 1;
    }
  }

  rowIconMouseDownOrTouchStart(event: MouseEvent | TouchEvent, id: any) {
    if (this.rowsAreSelectable && this.selectedRowsReorderIsAllowed) {
      const idx = this.rows.findIndex(
        (row) => row.item && (row.item.data as any)[this.idPropName] === id
      );

      const row = this.rows[idx];

      if (row.item!.isSelected) {
        const coords =
          this.leadingIconDragServices![idx].onTouchStartOrMouseDown(event);

        if (coords) {
          this.visuallyMovingRows = this.getVisuallyMovingRows(coords, idx);
          this.isMovingSelectedRows = true;
          this.visuallyMovingMainRowIdx = idx;
          const listView = this.getListView();
          listView.classList.add('trmrk-no-touch-scroll');

          setTimeout(() => {
            if (this.isMovingSelectedRows) {
              this.beforeMovingSelectedRowsListViewScrollTop =
                listView.scrollTop;

              this.iterateVisuallyMovingItems(
                (item, itemHostEl, visuallyMovingRow, i) => {
                  this.updateItemTopPx(itemHostEl, visuallyMovingRow);
                }
              );

              this.showVisuallyMovingRows = true;

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

  private getVisuallyMovingRows(coords: TouchOrMouseCoords, idx: any) {
    const listView = this.getListView();
    const scrollTop = listView.scrollTop;
    const height = listView.offsetHeight;

    const startY = scrollTop;
    const endY = scrollTop + height;

    const sliceArrFactory = (incIdx: boolean) =>
      filterKvp<QueryList<TItem>, TItem, TrmrkMovingPanelListItem<TItem>>({
        collection: this.getListItems(),
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
        collectionItemRetriever: (coll, i) => coll.get(i)!,
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

  private clearSelectedRowsReorderAggRowAnimationIntervalId() {
    if (this.selectedRowsReorderAggRowAnimationIntervalId) {
      clearInterval(this.selectedRowsReorderAggRowAnimationIntervalId);
      this.selectedRowsReorderAggRowAnimationIntervalId = null;
      this.selectedRowsReorderAggRowAnimationStartTime = null;
    }
  }

  private resetVisuallyMovingRows() {
    this.clearSelectedRowsReorderAggRowAnimationIntervalId();

    for (let row of this.rows) {
      row.hideItem = null;
      row.isBlankPlaceholder = null;
      row.isMultipleSelectedPlaceholder = null;
      row.multipleSelectedCount = null;
    }

    this.showAcceleratingScrollPopovers = false;
    this.isMovingSelectedRows = false;
    this.visuallyMovingRows = null;
    this.showVisuallyMovingRows = false;
    this.showMovingAggregateRow = false;
    this.slideOutVisuallyMovingRowPlaceholders = false;
    this.visuallyMovingMainRowIdx = null;

    const listView = this.getListView();
    listView.classList.remove('trmrk-no-touch-scroll');
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
    const listView = this.getListView();

    const topPx =
      visuallyMovingRow.offsetTop +
      Math.round(diffY) +
      listView.scrollTop -
      this.beforeMovingSelectedRowsListViewScrollTop!;

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
      | null
      | undefined = null,
    onNotAvailable:
      | ((
          visuallyMovingListItems: QueryList<TItem>,
          visuallyMovingRows: TrmrkPanelListServiceRowX<TEntity>[] | null
        ) => void)
      | null
      | undefined = null
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
