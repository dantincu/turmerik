import {
  NoteItem,
  InternalDir,
  DirType,
  DirCategory,
} from "trmrk/src/notes-item";

export interface DragAndDropNotesOp {
  prNote: NoteItem;
  selNotes: { [idx: number]: NoteItem };
}

export interface DragAndDropNotesAggOp {
  opsArr: DragAndDropNotesOp[];
  trgPrNote: NoteItem;
  trgIdx?: number | null | undefined;
}
