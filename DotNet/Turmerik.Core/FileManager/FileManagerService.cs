using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;

namespace Turmerik.Core.FileManager
{
    public interface IFileManagerService
    {
        Task<DriveEntryCore[]> ReadPrIdnfsAsync(
            string[] idnfsArr);

        Task<DriveEntryCore[]> ReadNamesAsync(
            string[] idnfsArr);

        Task<DriveEntryCore[]> ReadFileSizesAsync(
            string[] idnfsArr);

        Task<DriveEntryCore[]> ReadTimeStampsAsync(
            string[] idnfsArr,
            bool returnMillis = false);

        Task<DriveEntry<string>[]> ReadFileTextContentsAsync(
            string[] idnfsArr);

        Task ReadFileRawContentsAsync(
            DriveEntry<Func<Stream, Task>>[] entriesArr);

        Task<FilesAndFoldersTuple<string>> CopyEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr,
            DateTime clientFetchTimeStamp,
            bool overWrite = false);

        Task RenameOrMoveEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr,
            DateTime clientFetchTimeStamp,
            bool overWrite = false);

        Task DeleteEntriesAsync(
            DriveEntryCore[] foldersArr,
            DriveEntryCore[] filesArr,
            DateTime clientFetchTimeStamp);

        Task<DriveEntryCore[]> WriteFileTextContentsAsync(
            DriveEntry<string>[] entriesArr,
            DateTime clientFetchTimeStamp,
            bool overWrite = false);

        Task<DriveEntryCore[]> WriteFileRawContentsAsync(
            DriveEntry<Func<Stream, Task>>[] entriesArr,
            DateTime clientFetchTimeStamp,
            bool overWrite = false);
    }

    public interface IFsManagerService : IFileManagerService
    {
    }

    public class FileManagerCoreBase
    {
        protected DriveEntryCore GetTimeStampsCore(
            DateTime? creationTime,
            DateTime? lastWriteTime,
            DateTime? lastAccessTime,
            bool returnMillis) => returnMillis ? new DriveEntryCore
            {
                CreationTimeUtcTicks = NllblDateTimeToMillis(creationTime),
                LastWriteTimeUtcTicks = NllblDateTimeToMillis(lastWriteTime),
                LastAccessTimeUtcTicks = NllblDateTimeToMillis(lastAccessTime),
            } : new DriveEntryCore
            {
                CreationTimeUtcTicks = NllblDateTimeToTicks(creationTime),
                LastWriteTimeUtcTicks = NllblDateTimeToTicks(lastWriteTime),
                LastAccessTimeUtcTicks = NllblDateTimeToTicks(lastAccessTime),
            };

        private long? NllblDateTimeToTicks(
            DateTime? dateTime) => dateTime.HasValue.If(
                () => (long?)dateTime.Value.Ticks,
                () => null);

        private long? NllblDateTimeToMillis(
            DateTime? dateTime) => NllblTicksToMillis(
                NllblDateTimeToTicks(dateTime));

        private long? NllblTicksToMillis(
            long? ticks) => ticks.HasValue.If(
                () => (long?)ticks.Value / TimeSpan.TicksPerMillisecond,
                () => null);
    }
}
