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
  id: any;
}

export interface TrmrkPanelListServiceItemData<TEntity> {
  data: TEntity;
  isSelected: boolean;
}

export interface TrmrkPanelListServiceInitArgs<TEntity, TItem> {
  listView: ElementRef;
  listItems: QueryList<TItem>;
  entities: TEntity[];
  rows?: TrmrkPanelListServiceRow<TEntity>[] | null | undefined;
  idPropName?: string | null | undefined;
  hostElPropName?: string | null | undefined;
  rowsSelectionIsEnabled?: boolean | null | undefined;
  selectedRowsReorderIsEnabled?: boolean | null | undefined;
}

@Injectable()
export class TrmrkPanelListService<TEntity, TItem> implements OnDestroy {
  listView!: ElementRef;
  listItems!: QueryList<TItem>;
  entities!: TEntity[];
  rows!: TrmrkPanelListServiceRow<TEntity>[];
  idPropName!: string;
  hostElPropName!: string;

  rowsAreSelectable!: boolean;
  rowsMasterCheckBoxIsChecked!: boolean;
  isMovingSelectedRows!: boolean;
  rowsSelectionIsEnabled!: boolean;
  selectedRowsReorderIsEnabled!: boolean;

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
      this.listView = args.listView;
      this.listItems = args.listItems;
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

      setTimeout(() => {
        this.leadingIconDragServices = this.rows.map((row, idx) => {
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
                this.isMovingSelectedRows = true;
              })
            );

            this.rowLeadingIconDragEndSubscriptions = this.listItems.map(() =>
              dragService.dragEnd.subscribe((_) => {
                // this.isMovingSelectedRows = false;
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
      (row) => (row.item!.data as any)[this.idPropName] === id
    )!;

    row.item!.isSelected = event.checked;

    if (!event.checked && !this.rows.find((row) => row.item!.isSelected)) {
      this.rowsAreSelectable = false;
    }
  }

  rowsMasterCheckBoxToggled(event: MatCheckboxChange) {
    for (let row of this.rows) {
      row.item!.isSelected = event.checked;
    }

    if (!event.checked) {
      this.rowsAreSelectable = false;
    }
  }

  rowIconLongPressOrRightClick(event: TouchOrMouseCoords, id: number) {
    if (this.rowsSelectionIsEnabled && !this.rowsAreSelectable) {
      this.rowsAreSelectable = true;

      const row = this.rows.find(
        (row) => (row.item!.data as any)[this.idPropName] === id
      )!;

      row.item!.isSelected = true;
    }
  }

  rowIconMouseDownOrTouchStart(event: MouseEvent | TouchEvent, id: number) {
    if (this.rowsAreSelectable) {
      const idx = this.rows.findIndex(
        (row) => (row.item!.data as any)[this.idPropName] === id
      );

      const row = this.rows[idx];

      if (row.item!.isSelected) {
        this.leadingIconDragServices![idx].onTouchStartOrMouseDown(event);
      }
    }
  }
}
