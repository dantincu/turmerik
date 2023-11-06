export enum DirType {
  shortName,
  fullName,
}

export enum DirCategory {
  item,
  internals,
}

export enum InternalDir {
  root = 1,
  internals,
  files,
}

export interface NoteItemCore {
  title?: string | null | undefined;
  itemIdx?: number | null | undefined;
  internalDirs?: { [key: number | string]: number } | null | undefined;
  childItems?: { [key: number]: string } | null | undefined;
  pinnedChildItemsSortOrder?: number[] | null | undefined;
  childItemsSortOrder?: number[] | null | undefined;
}
