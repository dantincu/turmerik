import { NullOrUndef } from '../../core';

export interface TrmrkItemUrlPath {
  segments: string[];
  startsFromRoot?: boolean | NullOrUndef;
}

export interface TrmrkUrlPath {
  note?: TrmrkItemUrlPath | NullOrUndef;
  item?: TrmrkItemUrlPath | NullOrUndef;
}
