import { NoteInternalDir } from "./Turmerik.Notes.Core.NoteDirType";

export interface NoteItemCoreBase {
  Title: string;
  InternalDirs: { [key: number | NoteInternalDir]: number };
  ChildItems: { [key: number]: string };
  ChildSectionsSortOrder: number[];
  ChildItemsSortOrder: number[];
}

export interface NoteItemCore extends NoteItemCoreBase {
  ItemIdx: number | null;
  MdFileName: string;
}

export interface NoteItem extends NoteItemCore {
  ChildNotes: { [key: number]: NoteItem };
  Created: boolean | null;
  Removed: boolean | null;
}
