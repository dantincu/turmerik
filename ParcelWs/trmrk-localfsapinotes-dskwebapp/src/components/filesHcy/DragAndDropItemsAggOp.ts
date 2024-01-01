import { DriveItem } from "trmrk/src/drive-item";

export interface DragAndDropItemsOp {
  prFolder: DriveItem;
  selItems: { [idx: number]: DriveItem };
}

export interface DragAndDropItemsAggOp {
  opsArr: DragAndDropItemsOp[];
  trgPrFolder: DriveItem;
  trgIdx?: number | null | undefined;
}
