import {
  Injectable,
  ElementRef,
  QueryList,
  Injector,
  OnDestroy,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Subscription } from 'rxjs';

import { DragService } from 'trmrk-angular';

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

export interface TrmrkPanelListServiceInitArgs<TEntity, TItem> {
  listView: HTMLElement;
  listItems: QueryList<TItem>;
  getVisuallyMovingListItems: () => QueryList<TItem>;
  getUpAcceleratingScrollPopover: () => TrmrkAcceleratingScrollPopover;
  getDownAcceleratingScrollPopover: () => TrmrkAcceleratingScrollPopover;
  getSelectedRowsReorderAggRowEl: () => HTMLElement;
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
  listView!: HTMLElement;
  listItems!: QueryList<TItem>;
  getVisuallyMovingListItems!: () => QueryList<TItem>;
  getUpAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover;
  getDownAcceleratingScrollPopover!: () => TrmrkAcceleratingScrollPopover;
  getSelectedRowsReorderAggRowEl!: () => HTMLElement;
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

  rowLeadingIconDragSubscriptions: Subscription[] | null = null;
  rowLeadingIconDragEndSubscriptions: Subscription[] | null = null;

  private leadingIconDragServices: DragService[] | null = null;

  ngOnDestroy(): void {
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

  init(args: TrmrkPanelListServiceInitArgs<TEntity, TItem>) {
    setTimeout(() => {
      this.listItems = args.listItems;
      this.getVisuallyMovingListItems = args.getVisuallyMovingListItems;
      this.listView = args.listView;
      this.getUpAcceleratingScrollPopover = args.getUpAcceleratingScrollPopover;
      this.getDownAcceleratingScrollPopover =
        args.getDownAcceleratingScrollPopover;
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

          const listItemComponent = this.listItems.get(idx);
          const listItem = this.getItemHostEl(listItemComponent!);

          dragService.init(listItem);

          if (this.selectedRowsReorderIsAllowed) {
            this.rowLeadingIconDragSubscriptions = this.listItems.map(() =>
              dragService.drag.subscribe((event) => {
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
                          now -
                          this.selectedRowsReorderAggRowAnimationStartTime!;

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
                }
              })
            );

            this.rowLeadingIconDragEndSubscriptions = this.listItems.map(() =>
              dragService.dragEnd.subscribe((_) => {
                this.clearSelectedRowsReorderAggRowAnimationIntervalId();

                for (let mvRow of this.visuallyMovingRows ?? []) {
                  const row = this.rows[mvRow.idx];
                  row.hideItem = null;
                  row.isBlankPlaceholder = null;
                  row.isMultipleSelectedPlaceholder = null;
                  row.multipleSelectedCount = null;
                }

                this.showAcceleratingScrollPopovers = false;
                this.isMovingSelectedRows = false;
                this.visuallyMovingRows = null;
                this.showVisuallyMovingRows = false;
                this.visuallyMovingMainRowIdx = null;
              })
            );
          }

          return dragService;
        });
      }, 0);
    }, 0);
  }

  rowCheckBoxToggled(event: MatCheckboxChange, id: number) {
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

  rowIconLongPressOrRightClick(event: TouchOrMouseCoords, id: number) {
    if (this.rowsSelectionIsAllowed && !this.rowsAreSelectable) {
      this.rowsAreSelectable = true;

      const row = this.rows.find(
        (row) => row.item && (row.item.data as any)[this.idPropName] === id
      )!;

      row.item!.isSelected = true;
      this.selectedRowsCount = 1;
    }
  }

  rowIconMouseDownOrTouchStart(event: MouseEvent | TouchEvent, id: number) {
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

          const maxIdx = this.rows.length - 1;
          let sliceStIdx = 0;
          let secondPrevRow: TrmrkPanelListServiceRow<TEntity> | null = null;
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

          setTimeout(() => {
            this.iterateVisuallyMovingItems(
              (item, itemHostEl, visuallyMovingRow, i) => {
                this.updateItemTopPx(itemHostEl, visuallyMovingRow);
                const row = this.rows[visuallyMovingRow.idx];
                this.beforeMovingSelectedRowsListViewScrollTop =
                  this.listView.scrollTop;
              }
            );

            this.showVisuallyMovingRows = true;
          }, 0);

          setTimeout(() => {
            this.iterateVisuallyMovingItems(
              (item, itemHostEl, visuallyMovingRow, i) => {
                this.updateItemTopPx(itemHostEl, visuallyMovingRow);
              }
            );
          }, 0);
        }
      }
    }
  }

  private getVisuallyMovingRows(coords: TouchOrMouseCoords, idx: number) {
    const scrollTop = this.listView.scrollTop;
    const height = this.listView.offsetHeight;
    const startY = scrollTop - height;
    const endY = scrollTop + height * 2;

    const sliceArrFactory = (incIdx: boolean) =>
      filterKvp<QueryList<TItem>, TItem, TrmrkMovingPanelListItem<TItem>>({
        collection: this.listItems,
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
    itemHostEl.style.top = `${
      visuallyMovingRow.offsetTop +
      Math.round(diffY) +
      this.listView.scrollTop -
      this.beforeMovingSelectedRowsListViewScrollTop!
    }px`;
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
