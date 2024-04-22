using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.Helpers;
using Turmerik.Core.Utility;
using static Turmerik.Core.DriveExplorer.FilteredDriveEntriesSynchronizerH;

namespace Turmerik.Core.DriveExplorer
{
    public interface IFilteredDriveEntriesSynchronizer
    {
        Task<DriveItem> SyncFilteredItemsAsync(
            FilteredDriveEntriesSynchronizerOpts opts);

        DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffFilteredItems(
            FilteredDriveEntriesSynchronizerOpts opts);

        void PrintDiffResult(
            PrintDiffOpts opts,
            bool printHeader = true);

        void PrintRow(
            PrintDiffOpts opts,
            RefTrgDriveItemsTuple tuple);

        void PrintTimeStampIfNotNull(
            DriveItem? driveItem,
            bool isTarget);

        void PrintHeader(PrintDiffOpts opts);

        bool PrintNextChunkQuestion(
            PrintDiffOpts opts);

        string GetDiffTimeStampStr(DriveItem driveItem);
        DateTime GetDiffTimeStamp(DriveItem driveItem);
    }

    public class FilteredDriveEntriesSynchronizer : IFilteredDriveEntriesSynchronizer
    {
        public const int DEFAULT_ROWS_TO_PRINT_COUNT = 10;

        private readonly IDriveExplorerService driveExplorerService;
        private readonly IFilteredDriveEntriesNodesRetriever filteredDriveEntriesNodesRetriever;
        private readonly ITimeStampHelper timeStampHelper;

        public FilteredDriveEntriesSynchronizer(
            IDriveExplorerService driveExplorerService,
            IFilteredDriveEntriesNodesRetriever filteredDriveEntriesNodesRetriever,
            ITimeStampHelper timeStampHelper)
        {
            this.driveExplorerService = driveExplorerService ?? throw new ArgumentNullException(
                nameof(driveExplorerService));

            this.filteredDriveEntriesNodesRetriever = filteredDriveEntriesNodesRetriever ?? throw new ArgumentNullException(
                nameof(filteredDriveEntriesNodesRetriever));

            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(
                nameof(timeStampHelper));
        }

        public Task<DriveItem> SyncFilteredItemsAsync(
            FilteredDriveEntriesSynchronizerOpts opts)
        {
            opts.DiffResult ??= DiffFilteredItems(opts);
            throw new NotImplementedException();
        }

        public DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffFilteredItems(
            FilteredDriveEntriesSynchronizerOpts opts)
        {
            var diffResult = opts.FileSyncType switch
            {
                FileSyncType.Push => filteredDriveEntriesNodesRetriever.Diff(
                    opts.DestnFilteredEntries,
                    opts.SrcFilteredEntries,
                    string.Empty),
                _ => filteredDriveEntriesNodesRetriever.Diff(
                    opts.SrcFilteredEntries,
                    opts.DestnFilteredEntries,
                    string.Empty)
            };

            if (opts.SkipDiffPrinting != true)
            {
                PrintDiffResult(new PrintDiffOpts
                {
                    SyncOpts = opts,
                    RowsToPrint = opts.RowsToPrint,
                    DiffResult = diffResult
                });
            }

            return diffResult;
        }

        public void PrintDiffResult(
            PrintDiffOpts opts,
            bool printHeader = true)
        {
            if (printHeader)
            {
                opts.RowsToPrint ??= DEFAULT_ROWS_TO_PRINT_COUNT;
                PrintHeader(opts);
            }

            int i = 0;
            int offset = 0;

            foreach (var tuple in opts.DiffResult.Data.Files)
            {
                if (i - offset >= opts.LeftToPrintFromChunk)
                {
                    offset = i;
                    bool printRest = PrintNextChunkQuestion(opts);

                    opts.LeftToPrintFromChunk = printRest switch
                    {
                        true => int.MaxValue,
                        _ => opts.RowsToPrint!.Value
                    };
                }

                PrintRow(opts, tuple);
                i++;
            }

            opts.LeftToPrintFromChunk = i - offset;

            foreach (var folderNode in opts.DiffResult.ChildNodes)
            {
                PrintDiffResult(
                    new PrintDiffOpts
                    {
                        SyncOpts = opts.SyncOpts,
                        RowsToPrint = opts.RowsToPrint,
                        LeftToPrintFromChunk = opts.LeftToPrintFromChunk,
                        DiffResult = folderNode
                    }, false);
            }
        }

        public void PrintRow(
            PrintDiffOpts opts,
            RefTrgDriveItemsTuple tuple)
        {
            Console.ForegroundColor = ConsoleColor.Blue;
            Console.WriteLine(tuple.RelPath);

            var refItem = opts.SyncOpts.FileSyncType switch
            {
                FileSyncType.Push => tuple.TrgItem,
                _ => tuple.RefItem
            };

            var trgItem = opts.SyncOpts.FileSyncType switch
            {
                FileSyncType.Push => tuple.RefItem,
                _ => tuple.TrgItem
            };

            PrintTimeStampIfNotNull(trgItem, true);
            PrintTimeStampIfNotNull(refItem, false);

            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine();
        }

        public void PrintTimeStampIfNotNull(
            DriveItem? driveItem,
            bool isTarget)
        {
            if (driveItem != null)
            {
                var timeStampStr = GetDiffTimeStampStr(
                    driveItem);

                Console.ForegroundColor = isTarget switch
                {
                    true => ConsoleColor.Red,
                    false => ConsoleColor.Green,
                };

                Console.Write(string.Join(" ",
                    isTarget switch
                    {
                        true => "----",
                        false => "++++"
                    },
                    timeStampStr));

                Console.Write("    ");
            }
        }

        public void PrintHeader(PrintDiffOpts opts)
        {
            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.Write("Printing diffs from ");
            Console.ForegroundColor = ConsoleColor.Cyan;

            string strToPrint = opts.SyncOpts.FileSyncType switch
            {
                FileSyncType.Push => opts.SyncOpts.DestnName,
                _ => opts.SyncOpts.SrcName
            };

            Console.Write(strToPrint);
            Console.ForegroundColor = ConsoleColor.DarkCyan;

            strToPrint = opts.SyncOpts.FileSyncType switch
            {
                FileSyncType.Push => opts.SyncOpts.SrcName,
                _ => opts.SyncOpts.DestnName
            };

            Console.Write(strToPrint);
            Console.ResetColor();
            Console.WriteLine();
        }

        public bool PrintNextChunkQuestion(
            PrintDiffOpts opts)
        {
            Console.ForegroundColor = ConsoleColor.White;
            Console.WriteLine();

            Console.WriteLine(string.Join(" ",
                $"Press the SPACE BAR to print {opts.RowsToPrint}",
                "more rows or any other key to print the rest for this locatin"));

            var consoleKey = Console.ReadKey();
            bool printRest = consoleKey.Key != ConsoleKey.Spacebar;
            return printRest;
        }

        public string GetDiffTimeStampStr(
            DriveItem driveItem)
        {
            var timeStamp = GetDiffTimeStamp(
                driveItem);

            var timeStampStr = timeStampHelper.TmStmp(
                timeStamp, true, TimeStamp.Seconds, true);

            return timeStampStr;
        }

        public DateTime GetDiffTimeStamp(
            DriveItem driveItem) => driveItem.LastWriteTime?.ToUniversalTime() ?? new DateTime(
                driveItem.LastWriteTimeUtcTicks!.Value, DateTimeKind.Utc);
    }
}
