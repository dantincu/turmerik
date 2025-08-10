import { NullOrUndef } from '../../core';

export interface ActionResponse<TResult> {
  result?: TResult | `NullOrUndef`;
  hasError?: boolean | NullOrUndef;
  errorTitle?: string | NullOrUndef;
  errorMessage?: string | NullOrUndef;
  errorCode?: number | NullOrUndef;
}

export interface TrmrkUrlSegments {
  segments: string[];
  startsFromRoot?: boolean | NullOrUndef;
}

export interface TrmrNoteOrItemUrlSegments {
  note?: TrmrkUrlSegments | NullOrUndef;
  item?: TrmrkUrlSegments | NullOrUndef;
}
