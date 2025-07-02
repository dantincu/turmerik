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

import { TouchOrMouseCoords } from '../../trmrk-browser/domUtils/touchAndMouseEvents';

export interface TrmrkPanelListServiceRow<TEntity> {
  item: TrmrkPanelListServiceItemData<TEntity> | null;
  hideItem?: boolean | null | undefined;
  id: any;
  isBlankPlaceholder?: boolean | null | undefined;
  isMultipleSelectedPlaceholder?: boolean | null | undefined;
  multipleSelectedPlaceholderText?: string | null | undefined;
}

export interface TrmrkPanelListServiceItemData<TEntity> {
  data: TEntity;
  isSelected: boolean;
}

export interface TrmrkPanelListServiceInitArgs<TEntity, TItem> {
  listItems: QueryList<TItem>;
  currentlyMovingRowEl: HTMLElement;
  entities: TEntity[];
  rows?: TrmrkPanelListServiceRow<TEntity>[] | null | undefined;
  idPropName?: string | null | undefined;
  hostElPropName?: string | null | undefined;
  rowsSelectionIsEnabled?: boolean | null | undefined;
  selectedRowsReorderIsEnabled?: boolean | null | undefined;
}

@Injectable()
export class TrmrkPanelListService<TEntity, TItem> implements OnDestroy {
  listItems!: QueryList<TItem>;
  currentlyMovingRowEl!: HTMLElement;
  entities!: TEntity[];
  rows!: TrmrkPanelListServiceRow<TEntity>[];
  idPropName!: string;
  hostElPropName!: string;

  rowsAreSelectable!: boolean;
  rowsMasterCheckBoxIsChecked!: boolean;
  rowsSelectionIsEnabled!: boolean;
  selectedRowsReorderIsEnabled!: boolean;
  showAcceleratingScrollPopovers = false;
  isMovingSelectedRows = false;

  currentlyMovingRow: TrmrkPanelListServiceRow<TEntity> | null = null;

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
      this.currentlyMovingRowEl = args.currentlyMovingRowEl;
      this.entities = args.entities;
      this.idPropName = args.idPropName ?? 'id';
      this.hostElPropName = args.hostElPropName ?? 'hostEl';
      this.rowsSelectionIsEnabled = args.rowsSelectionIsEnabled ?? false;

      this.selectedRowsReorderIsEnabled =
        args.selectedRowsReorderIsEnabled ?? false;

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

          if (this.selectedRowsReorderIsEnabled) {
            this.rowLeadingIconDragSubscriptions = this.listItems.map(() =>
              dragService.drag.subscribe((_) => {
                this.showAcceleratingScrollPopovers = true;
              })
            );

            this.rowLeadingIconDragEndSubscriptions = this.listItems.map(() =>
              dragService.dragEnd.subscribe((_) => {
                const row = this.rows[idx];
                row.hideItem = null;
                row.isBlankPlaceholder = null;
                this.showAcceleratingScrollPopovers = false;
                this.isMovingSelectedRows = false;
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

    if (!event.checked && !this.rows.find((row) => row.item?.isSelected)) {
      this.rowsAreSelectable = false;
    }
  }

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    for (let row of this.rows) {
      if (row.item) {
        row.item!.isSelected = event.checked;
      }
    }

    if (!event.checked) {
      this.rowsAreSelectable = false;
    }
  }

  rowIconLongPressOrRightClick(event: TouchOrMouseCoords, id: number) {
    if (this.rowsSelectionIsEnabled && !this.rowsAreSelectable) {
      this.rowsAreSelectable = true;

      const row = this.rows.find(
        (row) => row.item && (row.item.data as any)[this.idPropName] === id
      )!;

      row.item!.isSelected = true;
    }
  }

  rowIconMouseDownOrTouchStart(event: MouseEvent | TouchEvent, id: number) {
    if (this.rowsAreSelectable) {
      const idx = this.rows.findIndex(
        (row) => row.item && (row.item.data as any)[this.idPropName] === id
      );

      const row = this.rows[idx];

      if (row.item!.isSelected) {
        const coords =
          this.leadingIconDragServices![idx].onTouchStartOrMouseDown(event);

        if (coords) {
          row.hideItem = true;
          row.isBlankPlaceholder = true;
          this.isMovingSelectedRows = true;
          this.currentlyMovingRow = row;
          const item = this.listItems.get(idx)!;

          const itemEl = ((item as any)[this.hostElPropName] as ElementRef)
            .nativeElement as HTMLElement;

          const offsetTop = itemEl.offsetTop;
          this.currentlyMovingRowEl.style.top = `${offsetTop}px`;
        }
      }
    }
  }
}
