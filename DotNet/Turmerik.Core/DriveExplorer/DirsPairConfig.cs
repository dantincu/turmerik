using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.DriveExplorer
{
    public class DirsPairConfig
    {
        public string[]? NestedConfigFilePathsArr { get; set; }

        public int? FileNameMaxLength { get; set; }
        public bool? ThrowIfAnyItemAlreadyExists { get; set; }
        public string TrmrkGuidInputName { get; set; }
        public bool? CreatePdfFile { get; set; }

        public ArgOptionsT ArgOpts { get; set; }
        public DirNamesT DirNames { get; set; }
        public FileNamesT FileNames { get; set; }
        public FileContentsT FileContents { get; set; }
        public MacrosT Macros { get; set; }

        public class ArgOptionsT
        {
            public string PrintHelpMessage { get; set; }
            public string PrintConfigSection { get; set; }
            public string WorkDir { get; set; }
            public string InteractiveMode { get; set; }
            public string OpenMdFile { get; set; }
            public string OpenMdFileInteractively { get; set; }
            public string SkipMdFileCreation { get; set; }
            public string SkipPdfFileCreation { get; set; }
            public string SkipCurrentNode { get; set; }
            public string SkipUntilPath { get; set; }
            public string CreatePdfFile { get; set; }
            public string DirNameTpl { get; set; }
            public string CreateNote { get; set; }
            public string CreateNoteSection { get; set; }
            public string CreateNoteBook { get; set; }
            public string CreateNoteInternalsDir { get; set; }
            public string CreateNoteFilesDir { get; set; }
            public string ConvertToNoteSections { get; set; }
            public string ConvertToNoteItems { get; set; }
            public string Url { get; set; }
            public string Uri { get; set; }
            public string ShowLastCreatedFirst { get; set; }
            public string ShowOtherDirNames { get; set; }
            public string HcyChildNode { get; set; }
            public string HcyParentNode { get; set; }
            public string HcySibblingNode { get; set; }
            public string Macro { get; set; }
            public string Title { get; set; }
            public string RecursiveMatchingDirNames { get; set; }
        }

        public class DirNamesT
        {
            public string DefaultJoinStr { get; set; }
            public Dictionary<string, DirNameTplT> DirNamesTplMap { get; set; }
            public Dictionary<string, string> MacrosMap { get; set; }
            public string[]? MacrosMapFilePathsArr { get; set; }
        }

        public class DirNameTplT
        {
            public string DirNameTpl { get; set; }
            public string MdFileNameTemplate { get; set; }
        }

        public class FileNamesT
        {
            public string MdFileName { get; set; }
            public string MdFileNamePfx { get; set; }
            public bool? PrependTitleToNoteMdFileName { get; set; }
            public string KeepFileName { get; set; }
        }

        public class FileContentsT
        {
            public string KeepFileContentsTemplate { get; set; }
            public bool? KeepFileContainsNoteJson { get; set; }
            public string MdFileContentsTemplate { get; set; }
            public string MdFileContentSectionTemplate { get; set; }
        }

        public class MacrosT
        {
            public Dictionary<string, string[]> Map { get; set; }
            public string[]? MapFilePathsArr { get; set; }
        }
    }
}
