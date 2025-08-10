export interface ActionResponse<TResult> {
  result?: TResult | null | undefined;
  hasError?: boolean | null | undefined;
  errorTitle?: string | null | undefined;
  errorMessage?: string | null | undefined;
  errorCode?: number | null | undefined;
}

export interface TrmrkUrlSegments {
  segments: string[];
  startsFromRoot?: boolean | null | undefined;
}

export interface TrmrNoteOrItemUrlSegments {
  note?: TrmrkUrlSegments | null | undefined;
  item?: TrmrkUrlSegments | null | undefined;
}
