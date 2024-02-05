using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;

namespace Turmerik.FilesCloner.ConsoleApp
{
    public class ProgramConfig
    {
        public List<Profile> Profiles { get; set; }

        public class FilesGroup
        {
            public string WorkDir { get; set; }

            public FsEntryLocator InputBaseDirLocator { get; set; }
            public FsEntryLocator CloneBaseDirLocator { get; set; }

            public FsEntryLocator CloneArchiveDirLocator { get; set; }
            public string CloneArchiveFileNameTpl { get; set; }
            public DriveEntriesSerializableFilter DfBeforeCloneArchiveDirCleanupFilter { get; set; }

            public DriveEntriesSerializableFilter DfInputDirFilter { get; set; }
            public DriveEntriesSerializableFilter DfBeforeCloneDestnCleanupFilter { get; set; }

            public List<FileArgs> Files { get; set; }
            public List<DirArgs> Dirs { get; set; }
        }

        public class Script
        {
            public string WorkDir { get; set; }
            public string Command { get; set; }
            public List<string> Arguments { get; set; }
        }

        public class ScriptsGroup
        {
            public string WorkDir { get; set; }

            public List<Script> OnBeforeScripts { get; set; }
            public List<Script> OnAfterScripts { get; set; }
        }

        public class Profile
        {
            public string ProfileName { get; set; }

            public List<ScriptsGroup> ScriptGroups { get; set; }
            public List<FilesGroup> FileGroups { get; set; }
        }
    }
}
