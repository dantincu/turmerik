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
}

@Injectable()
export class TrmrkPanelListService<TEntity, TItem> implements OnDestroy {
  listView!: ElementRef;
  listItems!: QueryList<TItem>;
  entities!: TEntity[];
  rows!: TrmrkPanelListServiceRow<TEntity>[];
  idPropName!: string;
  hostElPropName!: string;

  rowsAreSelectable = false;
  rowsMasterCheckBoxIsChecked = false;
  isMovingSelectedRows = false;

  rowLeadingIconDragSubscriptions: Subscription[] = [];
  rowLeadingIconDragEndSubscriptions: Subscription[] = [];

  private leadingIconDragServices: DragService[] | null = null;

  ngOnDestroy(): void {
    for (let dragService of this.leadingIconDragServices ?? []) {
      dragService.Dispose();
    }

    for (let subscription of this.rowLeadingIconDragSubscriptions) {
      subscription.unsubscribe();
    }

    for (let subscription of this.rowLeadingIconDragEndSubscriptions) {
      subscription.unsubscribe();
    }
  }

  init(args: TrmrkPanelListServiceInitArgs<TEntity, TItem>) {
    this.listView = args.listView;
    this.listItems = args.listItems;
    this.entities = args.entities;
    this.idPropName = args.idPropName ?? 'id';
    this.hostElPropName = args.hostElPropName ?? 'hostEl';

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

        this.rowLeadingIconDragEndSubscriptions[idx] =
          dragService.drag.subscribe((value) => {
            this.isMovingSelectedRows = true;
          });

        this.rowLeadingIconDragSubscriptions[idx] =
          dragService.dragEnd.subscribe((value) => {
            // this.isMovingSelectedRows = false;
          });

        return dragService;
      });
    }, 0);
  }

  companyCheckBoxToggled(event: MatCheckboxChange, id: number) {
    const row = this.rows.find(
      (row) => (row.item!.data as any)[this.idPropName] === id
    )!;

    row.item!.isSelected = event.checked;

    if (!event.checked && !this.rows.find((row) => row.item!.isSelected)) {
      this.rowsAreSelectable = false;
    }
  }

  companiesMasterCheckBoxToggled(event: MatCheckboxChange) {
    for (let row of this.rows) {
      row.item!.isSelected = event.checked;
    }

    if (!event.checked) {
      this.rowsAreSelectable = false;
    }
  }

  companyIconLongPressOrRightClick(event: TouchOrMouseCoords, id: number) {
    if (!this.rowsAreSelectable) {
      this.rowsAreSelectable = true;

      const row = this.rows.find(
        (row) => (row.item!.data as any)[this.idPropName] === id
      )!;

      row.item!.isSelected = true;
    }
  }

  companyIconMouseDownOrTouchStart(event: MouseEvent | TouchEvent, id: number) {
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
