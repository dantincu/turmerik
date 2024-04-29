import { IdxesFilter } from "../trmrk/TextParsing/IdxesFilter";

export interface RawFilter {
  Idxes?: string | null | undefined;
  Regex?: string | null | undefined;
  Regexes?: string[] | null | undefined;
}

export interface Filter {
  Raw: RawFilter;
  Idxes?: IdxesFilter[] | null | undefined;
}

export interface ContentSpecs {
  Args: string[][];
  ArgFilters: { [key: string]: RawFilter };
  ArgFiltersMap: { [key: string]: Filter };
}

export interface RelDirPaths {
  DirPath?: string | null | undefined;
  DirPathsArr?: string[] | null | undefined;
  NormDirPathsArr?: string[] | null | undefined;
  ArgFilters?: { [key: string]: RawFilter } | null | undefined;
  ArgFiltersMap?: { [key: string]: Filter } | null | undefined;
}

export interface File {
  RelDirPaths?: RelDirPaths | null | undefined;
  FileRelPath: string;
  FileRelPathsMap?: { [key: string]: string } | null | undefined;
  TextContent?: string | null | undefined;
  TextContentLines?: string[] | null | undefined;
  DefaultContentSpecs?: ContentSpecs | null | undefined;
  ContentSpecs?: ContentSpecs[] | null | undefined;
}

export interface FilesGroup {
  RelDirPaths?: RelDirPaths | null | undefined;
  DefaultContentSpecs?: ContentSpecs | null | undefined;
  Files: File[];
}

export interface ProfileSection {
  RelDirPaths?: RelDirPaths | null | undefined;
  SectionName: string;
  DefaultContentSpecs?: ContentSpecs | null | undefined;
  FileGroups: FilesGroup[];
}

export interface Profile {
  ProfileName: string;
  RelDirPaths?: RelDirPaths | null | undefined;
  DefaultContentSpecs?: ContentSpecs | null | undefined;
  Sections: ProfileSection[];
}
