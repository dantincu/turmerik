using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.FileSystem;

namespace Turmerik.FilesCloner.ConsoleApp
{
    public class DirArgs
    {
        public FsEntryLocator InputDirLocator { get; set; }
        public FsEntryLocator CloneDirLocator { get; set; }

        public DriveEntriesSerializableFilter InputDirFilter { get; set; }
        public DriveEntriesSerializableFilter BeforeCloneDestnCleanupFilter { get; set; }
    }
}
