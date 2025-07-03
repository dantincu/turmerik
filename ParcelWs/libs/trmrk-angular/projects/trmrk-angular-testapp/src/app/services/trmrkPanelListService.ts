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
  listItems: QueryList<TItem>;
  getVisuallyMovingListItems: () => QueryList<TItem>;
  listView: HTMLElement;
  getUpAcceleratingScrollPopover: () => TrmrkAcceleratingScrollPopover;
  getDownAcceleratingScrollPopover: () => TrmrkAcceleratingScrollPopover;
  entities: TEntity[];
  rows?: TrmrkPanelListServiceRow<TEntity>[] | null | undefined;
  idPropName?: string | null | undefined;
  hostElPropName?: string | null | undefined;
  rowsSelectionIsAllowed?: boolean | null | undefined;
  selectedRowsReorderIsAllowed?: boolean | null | undefined;
  selectedRowsReorderAggRowVertIsOriented?: boolean | null | undefined;
  selectedRowsReorderShowAggRowDiffYpxThreshold?: number | null | undefined;
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
  showAcceleratingScrollPopovers = false;
  isMovingSelectedRows = false;
  selectedRowsCount = 0;

  visuallyMovingRows: TrmrkPanelListServiceRowX<TEntity>[] | null = null;
  showVisuallyMovingRows = false;

  rowLeadingIconDragSubscriptions: Subscription[] | null = null;
  rowLeadingIconDragEndSubscriptions: Subscription[] | null = null;

  private leadingIconDragServices: DragService[] | null = null;

  ngOnDestroy(): void {
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
          const listItem = (listItemComponent as any)[this.hostElPropName]
            .nativeElement;

          dragService.init(listItem);

          if (this.selectedRowsReorderIsAllowed) {
            this.rowLeadingIconDragSubscriptions = this.listItems.map(() =>
              dragService.drag.subscribe((event) => {
                const diffY =
                  event.touchOrMouseMoveCoords.clientY -
                  event.touchStartOrMouseDownCoords.clientY;

                if (
                  diffY >= this.selectedRowsReorderShowAggRowDiffYpxThreshold
                ) {
                  this.showAcceleratingScrollPopovers = true;
                }

                if (this.showAcceleratingScrollPopovers) {
                } else {
                  const visuallyMovingListItems =
                    this.getVisuallyMovingListItems();

                  const visuallyMovingRows = this.visuallyMovingRows ?? [];

                  for (let i = 0; i < visuallyMovingRows.length; i++) {
                    const visuallyMovingItem = visuallyMovingListItems.get(i)!;

                    const visuallyMovingDomEl = (
                      (visuallyMovingItem as any)[
                        this.hostElPropName
                      ] as ElementRef
                    ).nativeElement as HTMLElement;

                    visuallyMovingDomEl.style.top = `${
                      visuallyMovingRows[i].offsetTop + diffY
                    }px`;
                  }
                }
              })
            );

            this.rowLeadingIconDragEndSubscriptions = this.listItems.map(() =>
              dragService.dragEnd.subscribe((_) => {
                for (let mvRow of this.visuallyMovingRows ?? []) {
                  const row = this.rows[mvRow.idx];
                  row.hideItem = null;
                  row.isBlankPlaceholder = null;
                }

                this.showAcceleratingScrollPopovers = false;
                this.isMovingSelectedRows = false;
                this.visuallyMovingRows = null;
                this.showVisuallyMovingRows = false;
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
          const visuallyMovingRows = this.getVisuallyMovingRows(coords, idx);
          this.visuallyMovingRows = visuallyMovingRows;
          this.isMovingSelectedRows = true;

          setTimeout(() => {
            const visuallyMovingListItems = this.getVisuallyMovingListItems();

            for (let i = 0; i < visuallyMovingListItems.length; i++) {
              const visuallyMovingItem = visuallyMovingListItems.get(i)!;

              const visuallyMovingDomEl = (
                (visuallyMovingItem as any)[this.hostElPropName] as ElementRef
              ).nativeElement as HTMLElement;

              visuallyMovingDomEl.style.top = `${visuallyMovingRows[i].offsetTop}px`;
            }

            for (let i = 0; i < visuallyMovingRows.length; i++) {
              const row = this.rows[visuallyMovingRows[i].idx];
              row.hideItem = true;
              row.isBlankPlaceholder = true;
            }

            this.showVisuallyMovingRows = true;
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
          offsetTop: (
            ((item as any)[this.hostElPropName] as ElementRef)
              .nativeElement as HTMLElement
          ).offsetTop,
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
}
