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
            string? refPrIdnf,
            string? trgPrIdnf,
            bool? treatAllAsDiff = null,
            bool deleteIfEmpty = true);

        DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffFilteredItems(
            FilteredDriveEntriesSynchronizerOpts opts);

        void SwitchItemsIfReq(
            ref DriveItem? refItem,
            ref DriveItem? trgItem,
            FileSyncType fileSyncType);

        void SwitchItemsIfReq(
            ref string? refItemIdnf,
            ref string? trgItemIdnf,
            FileSyncType fileSyncType);

        void SwitchItemsIfReq<TValue>(
            ref TValue refItem,
            ref TValue trgItem,
            FileSyncType fileSyncType);

        void PrintDiffResult(
            PrintDiffOpts opts,
            bool printHeader = true);

        bool PrintRowIfReq(
            PrintDiffOpts opts,
            RefTrgDriveItemsTuple tuple);

        void PrintTimeStampIfNotNull(
            DriveItem? driveItem,
            bool isTarget,
            bool hasRealDiff);

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
                        opts.DiffResult.Data.RefPrIdnf,
                        opts.DiffResult.Data.TrgPrIdnf,
                        opts.TreatAllAsDiff,
                        opts.DeleteEmptyFolders ?? true);
                }
            }

            return opts.DiffResult;
        }

        public async Task<bool> SyncFilteredItemsAsync(
            DataTreeNodeMtbl<RefTrgDriveFolderTuple> diffResult,
            FileSyncType fileSyncType,
            string? refPrIdnf,
            string? trgPrIdnf,
            bool? treatAllAsDiff = null,
            bool deleteIfEmpty = true)
        {
            bool hasFiles = false;

            SwitchItemsIfReq(
                ref refPrIdnf,
                ref trgPrIdnf,
                fileSyncType);

            foreach (var tuple in diffResult.Data.Files)
            {
                var refItem = tuple.RefItem;
                var trgItem = tuple.TrgItem;

                SwitchItemsIfReq(
                    ref refItem,
                    ref trgItem,
                    fileSyncType);

                if (tuple.HasDiff || treatAllAsDiff == true)
                {
                    if (trgItem != null)
                    {
                        await driveExplorerService.DeleteFileAsync(trgItem.Idnf);
                    }

                    if (refItem != null)
                    {
                        await driveExplorerService.CopyFileAsync(
                            refItem.Idnf,
                            trgPrIdnf,
                            refItem.Name);

                        hasFiles = true;
                    }
                }
                else
                {
                    if (trgItem != null)
                    {
                        hasFiles = true;
                    }
                }
            }

            bool hasSubFolders = false;

            foreach (var childNode in diffResult.ChildNodes)
            {
                string? refIdnf = childNode.Data.RefPrIdnf;
                string? trgIdnf = childNode.Data.TrgPrIdnf;

                SwitchItemsIfReq(
                    ref refIdnf,
                    ref trgIdnf,
                    fileSyncType);

                if (trgIdnf == null)
                {
                    var trgItem = await driveExplorerService.CreateFolderAsync(
                        trgPrIdnf, childNode.Data.Name, false);

                    trgIdnf = trgItem.Idnf;
                }

                SwitchItemsIfReq(
                    ref refIdnf,
                    ref trgIdnf,
                    fileSyncType);

                if (await SyncFilteredItemsAsync(
                    childNode, fileSyncType,
                    refIdnf, trgIdnf,
                    treatAllAsDiff,
                    deleteIfEmpty) == false)
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

                if (prIdnf != null)
                {
                    await driveExplorerService.DeleteFolderAsync(
                        prIdnf!, false);
                }
            }

            return deleteFolder;
        }

        public DataTreeNodeMtbl<RefTrgDriveFolderTuple> DiffFilteredItems(
            FilteredDriveEntriesSynchronizerOpts opts)
        {
            var diffResult = filteredDriveEntriesNodesRetriever.Diff(
                opts.SrcFilteredEntries,
                opts.DestnFilteredEntries,
                string.Empty);

            if (opts.SkipDiffPrinting != true)
            {
                PrintDiffResult(new PrintDiffOpts
                {
                    SyncOpts = opts,
                    RowsToPrint = opts.RowsToPrint,
                    DiffResult = diffResult,
                    TreatAllAsDiff = opts.TreatAllAsDiff,
                    Interactive = opts.Interactive
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
                    bool printRest = opts.Interactive == true ? PrintNextChunkQuestion(opts) : true;

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
                        DiffResult = folderNode,
                        TreatAllAsDiff = opts.TreatAllAsDiff,
                        RowsToPrint = opts.RowsToPrint,
                        LeftToPrintFromChunk = opts.LeftToPrintFromChunk,
                        Interactive = opts.Interactive
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
                Console.ForegroundColor = tuple.HasDiff switch
                {
                    true => ConsoleColor.Blue,
                    false => ConsoleColor.Gray,
                };

                Console.WriteLine(tuple.RelPath);

                SwitchItemsIfReq(ref refItem, ref trgItem,
                    opts.SyncOpts.FileSyncType);

                PrintTimeStampIfNotNull(trgItem, true, tuple.HasDiff);
                PrintTimeStampIfNotNull(refItem, false, tuple.HasDiff);

                Console.ResetColor();
                Console.WriteLine();
                Console.WriteLine();
            }

            return hasDiff;
        }

        public void SwitchItemsIfReq(
            ref DriveItem? refItem,
            ref DriveItem? trgItem,
            FileSyncType fileSyncType) => SwitchItemsIfReq<DriveItem?>(
                ref refItem, ref trgItem, fileSyncType);

        public void SwitchItemsIfReq(
            ref string? refItemIdnf,
            ref string? trgItemIdnf,
            FileSyncType fileSyncType) => SwitchItemsIfReq<string?>(
                ref refItemIdnf, ref trgItemIdnf, fileSyncType);

        public void SwitchItemsIfReq<TValue>(
            ref TValue refItem,
            ref TValue trgItem,
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
            bool isTarget,
            bool hasRealDiff)
        {
            if (driveItem != null)
            {
                var timeStampStr = GetDiffTimeStampStr(
                    driveItem);

                var sizeStr = string.Format(
                    "({0} KB)",
                    driveItem.FileSizeBytes!.Value / 1000F);

                Console.ForegroundColor = hasRealDiff switch
                {
                    true => isTarget switch
                    {
                        true => ConsoleColor.Red,
                        false => ConsoleColor.Green,
                    },
                    false => ConsoleColor.DarkGray,
                };

                Console.Write(string.Join(" ",
                    isTarget switch
                    {
                        true => "----",
                        false => "++++"
                    },
                    timeStampStr,
                    sizeStr));

                Console.Write("    ");
            }
        }

        public void PrintHeader(PrintDiffOpts opts)
        {
            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.Write("Printing diffs to ");
            Console.ForegroundColor = ConsoleColor.Cyan;

            string strToPrint = opts.SyncOpts.FileSyncType switch
            {
                FileSyncType.Push => opts.SyncOpts.SrcName,
                _ => opts.SyncOpts.DestnName
            };

            Console.Write(strToPrint);
            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.Write(" from ");
            Console.ForegroundColor = ConsoleColor.Cyan;

            strToPrint = opts.SyncOpts.FileSyncType switch
            {
                FileSyncType.Push => opts.SyncOpts.DestnName,
                _ => opts.SyncOpts.SrcName
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
                "more rows or any other key to print the rest for this location"));

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
            Console.WriteLine();

            if (@continue)
            {
                Console.WriteLine("Starting folders sync");
            }
            else
            {
                Console.WriteLine("No sync will be done");
            }

            Console.WriteLine();
            Console.WriteLine();

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
