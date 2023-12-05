using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.MkFsDirsBackup.ConsoleApp
{
    public class DirsBackupConfig
    {
        public string SrcRepoDirPath { get; set; }
        public string SrcProjectsBaseDirRelPath { get; set; }

        public string DestnDirBasePath { get; set; }
        public string DestnBinDirRelPath { get; set; }
        public string DestnConfigDirRelPath { get; set; }
        public string DestnDataDirRelPath { get; set; }

        public string DestnArchivesDirPath { get; set; }
        public string DestnArchiveFileName { get; set; }

        public List<string> IncludedConfigDirRelPaths { get; set; }
        public List<string> IncludedDataDirRelPaths { get; set; }

        public List<SrcBinDir> SrcBinDirs { get; set; }

        public class SrcBinDir
        {
            public string ProjectDirName { get; set; }
            public string ProjectBinsDirRelPath { get; set; }

            public List<string> IgnoredSrcBinRelFilePaths { get; set; }
            public List<string> IgnoredDestnBinRelFilePaths { get; set; }

            public bool? AddToArchive { get; set; }
        }
    }
}
