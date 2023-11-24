using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer.DirsPair
{
    public class DirsPairConfig
    {
        public int? FileNameMaxLength { get; set; }
        public bool? ThrowIfAnyItemAlreadyExists { get; set; }
        public string TrmrkGuidInputName { get; set; }

        public ArgOptionsT ArgOpts { get; set; }
        public DirNamesT DirNames { get; set; }
        public FileNamesT FileNames { get; set; }
        public FileContentsT FileContents { get; set; }

        public class ArgOptionsT
        {
            public string WorkDir { get; set; }
            public string InteractiveMode { get; set; }
            public string OpenMdFile { get; set; }
            public string SkipMdFileCreation { get; set; }
            public string DirNameTpl { get; set; }
            public string CreateNote { get; set; }
            public string CreateNoteBook { get; set; }
            public string CreateNoteInternalsDir { get; set; }
            public string CreateNoteFilesDir { get; set; }
            public string Url { get; set; }
            public string Uri { get; set; }
        }

        public class DirNamesT
        {
            public string DefaultJoinStr { get; set; }
            public Dictionary<string, DirNameTplT> DirNamesTplMap { get; set; }
        }

        public class DirNameTplT
        {
            public string DirNameTpl { get; set; }
            public string MdFileNameTemplate { get; set; }
        }

        public class FileNamesT
        {
            public string MdFileName { get; set; }
            public bool? PrependTitleToNoteMdFileName { get; set; }
            public string KeepFileName { get; set; }
        }

        public class FileContentsT
        {
            public string KeepFileContentsTemplate { get; set; }
            public string MdFileContentsTemplate { get; set; }
            public string MdFileContentSectionTemplate { get; set; }
        }
    }
}
