using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;

namespace Turmerik.Core.ConsoleApps.MkFsBackup
{
    public class DirsBackupConfig
    {
        public ArgOptsT ArgOpts { get; set; }

        public List<BckpDirsSection> Sections { get; set; }

        public class BckpDirsSection
        {
            public string SectionKey { get; set; }
            public int SectionIdx { get; set; }

            public string SrcBasePath { get; set; }
            public string DestnBasePath { get; set; }

            public string DestnArchiveDirPath { get; set; }
            public string DestnArchiveFileName { get; set; }
            public string DestnArchiveFileNameTpl { get; set; }
            public string DestnArchiveFileNameTestRegex { get; set; }
            public int RetainedDestnArchiveFilesCount { get; set; }

            public List<BckpDirsGroup> Groups { get; set; }
        }

        public class BckpDirsGroup
        {
            public string GroupKey { get; set; }
            public int GroupIdx { get; set; }

            public string SrcDirRelPath { get; set; }
            public string DestnDirRelPath { get; set; }

            public BckpDir DfBckpDir { get; set; }

            public List<BckpDir> BckpDirs { get; set; }

            public bool? DestnOnly { get; set; }
            public bool? AddToArchive { get; set; }
        }

        public class ArgOptsT
        {
            public ArgOption PrintAllEntries { get; set; }
        }

        public class ArgOption
        {
            public string FullArg { get; set; }
            public string ShortArg { get; set; }
        }

        public class BckpDir
        {
            public string DirKey { get; set; }
            public int DirIdx { get; set; }

            public BckpRelDir SrcDirRelPath { get; set; }
            public BckpRelDir DestnDirRelPath { get; set; }

            public PathFiltersMtbl SrcDirPathFilters { get; set; }
            public PathFiltersMtbl DestnDirPathFilters { get; set; }

            public bool? DestnOnly { get; set; }
            public bool? AddToArchive { get; set; }
        }

        public class BckpRelDir
        {
            public string DirPrependRelPath { get; set; }
            public string DirRelPathName { get; set; }
            public string DirAppendRelPath { get; set; }
        }
    }
}
