using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.DriveExplorer
{
    public class DirsPairConfig
    {
        public int? FileNameMaxLength { get; set; }
        public bool? ThrowIfAnyItemAlreadyExists { get; set; }

        public ArgOptionsT ArgOpts { get; set; }
        public FileNamesT FileNames { get; set; }
        public FileContentsT FileContents { get; set; }

        public class ArgOptionsT
        {
            public string WorkDir { get; set; }
            public string OpenMdFile { get; set; }
            public string SkipMdFileCreation { get; set; }
        }

        public class FileNamesT
        {
            public string MdFileNameTemplate { get; set; }
            public string KeepFileName { get; set; }
        }

        public class FileContentsT
        {
            public string KeepFileContentsTemplate { get; set; }
            public string MdFileContentsTemplate { get; set; }
        }
    }
}
