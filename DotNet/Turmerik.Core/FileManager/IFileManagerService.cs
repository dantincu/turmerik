using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace Turmerik.Core.FileManager
{
    public interface IFileManagerService : IFileManagerServiceCore
    {
        Task ReadFileRawContentsAsync(
            DriveEntry<Func<Stream, Task>>[] entriesArr);

        Task<DriveEntryCore[]> WriteFileRawContentsAsync(
            DriveEntry<Func<Stream, Task>>[] entriesArr,
            bool overWrite = false);
    }
}
