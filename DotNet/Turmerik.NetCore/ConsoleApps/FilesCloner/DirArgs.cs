using Turmerik.Core.FileSystem;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public class DirArgs
    {
        public FsEntryLocator InputDirLocator { get; set; }
        public FsEntryLocator CloneDirLocator { get; set; }

        public DriveEntriesSerializableFilter InputDirFilter { get; set; }
        public DriveEntriesSerializableFilter BeforeCloneDestnCleanupFilter { get; set; }
    }
}
