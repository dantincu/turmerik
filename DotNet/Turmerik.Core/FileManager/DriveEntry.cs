using System;
using System.Collections.Generic;
using System.Text;

namespace Turmerik.Core.FileManager
{
    public class DriveEntryCore
    {
        public string? Idnf { get; set; }
        public string? PrIdnf { get; set; }
        public string? Name { get; set; }
        public long? FileSizeBytes { get; set; }

        public long? CreationTimeUtcTicks { get; set; }
        public long? LastWriteTimeUtcTicks { get; set; }
        public long? LastAccessTimeUtcTicks { get; set; }

        public long? CreationTimeUtcMillis { get; set; }
        public long? LastWriteTimeUtcMillis { get; set; }
        public long? LastAccessTimeUtcMillis { get; set; }
    }

    public class DriveEntry<TContent> : DriveEntryCore
    {
        public TContent Content { get; set; }
    }

    public class DriveEntryX<TDriveEntry> : DriveEntryCore
        where TDriveEntry : DriveEntryX<TDriveEntry>
    {
        public List<TDriveEntry> SubFolders { get; set; }
        public List<TDriveEntry> FolderFiles { get; set; }
    }

    public class FilesAndFoldersTuple<TDriveEntry>
    {
        public List<TDriveEntry> Folders { get; set; }
        public List<TDriveEntry> Files { get; set; }
    }
}
