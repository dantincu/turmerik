import { NullOrUndef } from '../core';

export interface DriveEntriesSerializableFilter {
  IncludedRelPathRegexes?: string[] | NullOrUndef;
  ExcludedRelPathRegexes?: string[] | NullOrUndef;
}
