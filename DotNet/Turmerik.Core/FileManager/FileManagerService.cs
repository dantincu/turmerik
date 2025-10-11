using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;

namespace Turmerik.Core.FileManager
{
    public interface IFsManagerService : IFileManagerService
    {
    }

    public class FileManagerCoreBase
    {
        protected void AssignClientFetchTmStmpMillis<TDriveEntry>(
            IEnumerable<TDriveEntry> driveEntriesNmrbl,
            long clientFetchTmStmpMillis)
            where TDriveEntry : DriveEntryCore
        {
            foreach (var driveEntry in driveEntriesNmrbl)
            {
                driveEntry.ClientFetchTimeUtcMillis = clientFetchTmStmpMillis;
            }
        }

        protected long GetClientFetchTmStmpMillis() => DateTime.UtcNow.Ticks.TicksToMillis();

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
