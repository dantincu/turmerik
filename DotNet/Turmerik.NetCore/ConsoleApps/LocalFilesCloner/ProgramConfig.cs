using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Utility;
using Turmerik.NetCore.Utility;

namespace Turmerik.NetCore.ConsoleApps.LocalFilesCloner
{
    public class ProgramConfig : ProgramConfigCoreBase<ProgramConfig.Profile>
    {
        public class File
        {
            public string InputFilePath { get; set; }
            public string CloneDirPath { get; set; }

            public string CloneFileNameTpl { get; set; }
            public bool? UseChecksum { get; set; }
            public bool? ForceOverwrite { get; set; }
            public List<string> CloneTplLines { get; set; }
        }

        public class Folder
        {
            public string InputDirPath { get; set; }
            public string CloneDirPath { get; set; }

            public DriveEntriesSerializableFilter InputDirFilter { get; set; }
            public DriveEntriesSerializableFilter BeforeCloneDestnCleanupFilter { get; set; }
        }

        public class FilesGroup
        {
            public string InputDirPath { get; set; }
            public string CloneDirPath { get; set; }

            public string CloneArchiveDirPath { get; set; }
            public string CloneArchiveFileNameTpl { get; set; }
            public DriveEntriesSerializableFilter BeforeArchiveCleanupFilter { get; set; }

            public DriveEntriesSerializableFilter DfInputDirFilter { get; set; }
            public DriveEntriesSerializableFilter DfBeforeCloneDestnCleanupFilter { get; set; }

            public List<File> Files { get; set; }
            public List<Folder> Folders { get; set; }
        }

        public class Script
        {
            public string WorkDir { get; set; }

            public ProcessLauncherOpts WinShellCmd { get; set; }
            public PowerShellAdapterOpts PowerShellCmd { get; set; }
        }

        public class ScriptsGroup
        {
            public string WorkDir { get; set; }

            public List<Script> OnBeforeScripts { get; set; }
            public List<Script> OnAfterScripts { get; set; }
        }

        public class Profile : ProgramConfigProfileCoreBase
        {
            public List<ScriptsGroup> ScriptGroups { get; set; }
            public List<FilesGroup> FileGroups { get; set; }
        }
    }
}
