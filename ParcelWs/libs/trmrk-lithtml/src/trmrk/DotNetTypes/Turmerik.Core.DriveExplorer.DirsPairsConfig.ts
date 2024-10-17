export interface DirsPairConfig {
  NestedConfigFilePathsArr: string[] | null;
  FileNameMaxLength: number | null;
  ThrowIfAnyItemAlreadyExists: boolean | null;
  TrmrkGuidInputName: string;
  CreatePdfFile: boolean | null;
  ArgOpts: ArgOptionsT;
  DirNames: DirNamesT;
  FileNames: FileNamesT;
  FileContents: FileContentsT;
  Macros: MacrosT;
}

export interface ArgOptionsT {
  PrintHelpMessage: string;
  PrintConfigSection: string;
  WorkDir: string;
  InteractiveMode: string;
  OpenMdFile: string;
  SkipMdFileCreation: string;
  SkipPdfFileCreation: string;
  SkipCurrentNode: string;
  SkipUntilPath: string;
  CreatePdfFile: string;
  DirNameTpl: string;
  CreateNote: string;
  CreateNoteSection: string;
  CreateNoteBook: string;
  CreateNoteInternalsDir: string;
  CreateNoteFilesDir: string;
  ConvertToNoteSections: string;
  ConvertToNoteItems: string;
  Url: string;
  Uri: string;
  ShowLastCreatedFirst: string;
  ShowOtherDirNames: string;
  HcyChildNode: string;
  HcyParentNode: string;
  HcySibblingNode: string;
  Macro: string;
  Title: string;
  RecursiveMatchingDirNames: string;
}

export interface DirNamesT {
  DefaultJoinStr: string;
  DirNamesTplMap: { [key: string]: DirNameTplT };
  MacrosMap: { [key: string]: string };
  MacrosMapFilePathsArr: string[] | null;
}

export interface DirNameTplT {
  DirNameTpl: string;
  MdFileNameTemplate: string;
}

export interface FileNamesT {
  MdFileName: string;
  MdFileNamePfx: string;
  PrependTitleToNoteMdFileName: boolean | null;
  KeepFileName: string;
}

export interface FileContentsT {
  KeepFileContentsTemplate: string;
  KeepFileContainsNoteJson: boolean | null;
  MdFileContentsTemplate: string;
  MdFileContentSectionTemplate: string;
}

export interface MacrosT {
  Map: { [key: string]: string[] };
  MapFilePathsArr: string[] | null;
}
