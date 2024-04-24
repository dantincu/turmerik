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
        Task<DataTreeNodeMtbl<RefTrgDriveFolderTuple>> SyncFilteredItemsAsync(
            FilteredDriveEntriesSynchronizerOpts opts);

        Task<bool> SyncFilteredItemsAsync(
            DataTreeNodeMtbl<RefTrgDriveFolderTuple> diffResult,
            FileSyncType fileSyncType,
            bool? treatAllAsDiff = null,
            bool deleteIfEmpty = true);

        DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffFilteredItems(
            FilteredDriveEntriesSynchronizerOpts opts);

        void SwitchItemsIfReq(
            ref DriveItem refItem,
            ref DriveItem trgItem,
            FileSyncType fileSyncType);

        void PrintDiffResult(
            PrintDiffOpts opts,
            bool printHeader = true);

        bool PrintRowIfReq(
            PrintDiffOpts opts,
            RefTrgDriveItemsTuple tuple);

        void PrintTimeStampIfNotNull(
            DriveItem? driveItem,
            bool isTarget);

        void PrintHeader(PrintDiffOpts opts);

        bool PrintNextChunkQuestion(
            PrintDiffOpts opts);

        bool AskConfirmationQuestion();

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

        public async Task<DataTreeNodeMtbl<RefTrgDriveFolderTuple>> SyncFilteredItemsAsync(
            FilteredDriveEntriesSynchronizerOpts opts)
        {
            opts.DiffResult ??= DiffFilteredItems(opts);

            if (opts.FileSyncType != FileSyncType.Diff)
            {
                bool @continue = opts.Interactive != true;
                @continue = @continue || AskConfirmationQuestion();

                if (@continue)
                {
                    await SyncFilteredItemsAsync(
                        opts.DiffResult,
                        opts.FileSyncType,
                        opts.TreatAllAsDiff,
                        false);
                }
            }

            return opts.DiffResult;
        }

        public async Task<bool> SyncFilteredItemsAsync(
            DataTreeNodeMtbl<RefTrgDriveFolderTuple> diffResult,
            FileSyncType fileSyncType,
            bool? treatAllAsDiff = null,
            bool deleteIfEmpty = true)
        {
            bool hasFiles = false;

            foreach (var tuple in diffResult.Data.Files)
            {
                if (tuple.HasDiff || treatAllAsDiff == true)
                {
                    var refItem = tuple.RefItem;
                    var trgItem = tuple.TrgItem;

                    SwitchItemsIfReq(
                        ref refItem,
                        ref trgItem,
                        fileSyncType);

                    if (trgItem != null)
                    {
                        await driveExplorerService.DeleteFileAsync(trgItem.Idnf);
                    }

                    if (refItem != null)
                    {
                        await driveExplorerService.CopyFileAsync(
                            refItem.Idnf,
                            diffResult.Data.TrgPrIdnf,
                            refItem.Name);

                        hasFiles = true;
                    }
                }
                else
                {
                    hasFiles = true;
                }
            }

            bool hasSubFolders = false;

            foreach (var childNode in diffResult.ChildNodes)
            {
                if (await SyncFilteredItemsAsync(
                    childNode, fileSyncType, treatAllAsDiff))
                {
                    hasSubFolders = true;
                }
            }

            bool deleteFolder = deleteIfEmpty && !hasSubFolders && !hasFiles;

            if (deleteFolder)
            {
                var prIdnf = fileSyncType switch
                {
                    FileSyncType.Push => diffResult.Data.RefPrIdnf,
                    _ => diffResult.Data.TrgPrIdnf
                };

                await driveExplorerService.DeleteFolderAsync(
                    prIdnf!, false);
            }

            return deleteFolder;
        }

        public DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffFilteredItems(
            FilteredDriveEntriesSynchronizerOpts opts)
        {
            var diffResult = opts.FileSyncType switch
            {
                FileSyncType.Push => filteredDriveEntriesNodesRetriever.Diff(
                    opts.DestnFilteredEntries,
                    opts.SrcFilteredEntries,
                    opts.SrcFilteredEntries.Data.PrFolderIdnf,
                    string.Empty),
                _ => filteredDriveEntriesNodesRetriever.Diff(
                    opts.SrcFilteredEntries,
                    opts.DestnFilteredEntries,
                    opts.DestnFilteredEntries.Data.PrFolderIdnf,
                    string.Empty)
            };

            if (opts.SkipDiffPrinting != true)
            {
                PrintDiffResult(new PrintDiffOpts
                {
                    SyncOpts = opts,
                    RowsToPrint = opts.RowsToPrint,
                    DiffResult = diffResult,
                    TreatAllAsDiff = opts.TreatAllAsDiff
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
                if (opts.SyncOpts.Interactive == true)
                {
                    opts.RowsToPrint ??= DEFAULT_ROWS_TO_PRINT_COUNT;
                }
                else
                {
                    opts.RowsToPrint = int.MaxValue;
                }

                PrintHeader(opts);
            }

            int count = 0;
            int offset = 0;

            foreach (var tuple in opts.DiffResult.Data.Files)
            {
                if (count - offset >= opts.LeftToPrintFromChunk)
                {
                    offset = count;
                    bool printRest = PrintNextChunkQuestion(opts);

                    opts.LeftToPrintFromChunk = printRest switch
                    {
                        true => int.MaxValue,
                        _ => opts.RowsToPrint!.Value
                    };
                }

                if (PrintRowIfReq(opts, tuple))
                {
                    count++;
                }
            }

            opts.LeftToPrintFromChunk = count - offset;

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

        public bool PrintRowIfReq(
            PrintDiffOpts opts,
            RefTrgDriveItemsTuple tuple)
        {
            var refItem = tuple.RefItem;
            var trgItem = tuple.TrgItem;

            bool hasDiff = tuple.HasDiff || opts.TreatAllAsDiff == true;

            if (hasDiff)
            {
                Console.ForegroundColor = ConsoleColor.Blue;
                Console.WriteLine(tuple.RelPath);

                SwitchItemsIfReq(ref refItem, ref trgItem,
                    opts.SyncOpts.FileSyncType);

                PrintTimeStampIfNotNull(trgItem, true);
                PrintTimeStampIfNotNull(refItem, false);

                Console.ResetColor();
                Console.WriteLine();
                Console.WriteLine();
            }

            return hasDiff;
        }

        public void SwitchItemsIfReq(
            ref DriveItem refItem,
            ref DriveItem trgItem,
            FileSyncType fileSyncType)
        {
            if (fileSyncType == FileSyncType.Push)
            {
                var aux = refItem;
                refItem = trgItem;
                trgItem = aux;
            }
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

            Console.ResetColor();
            return printRest;
        }

        public bool AskConfirmationQuestion()
        {
            Console.WriteLine(string.Join(" ",
                "Press the ENTER key to continue with the execution",
                "or any other key to cancel the exection"));

            var consoleKey = Console.ReadKey();
            bool @continue = consoleKey.Key == ConsoleKey.Enter;

            return @continue;
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
