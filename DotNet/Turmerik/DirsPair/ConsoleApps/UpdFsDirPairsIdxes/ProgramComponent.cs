using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.DriveExplorer;
using Turmerik.Notes.Core;
using static Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes.ProgramComponent;

namespace Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
        void Run(WorkArgs wka);
    }

    public class ProgramComponent : IProgramComponent
    {
        private const char ITEMS_LIST_SEP_CHR = ',';
        private const string ITEMS_SPREAD_STR = "..";

        private readonly IJsonConversion jsonConversion;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly IdxesUpdater idxesUpdater;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly NoteDirsPairConfigMtbl noteDirsPairCfg;
        private readonly NoteDirsPairConfigMtbl.FileNamesT noteFileNamesCfg;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IConsoleArgsParser consoleArgsParser,
            IdxesUpdater idxesUpdater,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.idxesUpdater = idxesUpdater ?? throw new ArgumentNullException(
                nameof(idxesUpdater));

            config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME)));

            notesConfig = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    TrmrkNotesH.NOTES_CFG_FILE_NAME)));

            noteDirsPairCfg = notesConfig.NoteDirPairs;
            noteFileNamesCfg = noteDirsPairCfg.FileNames;

            existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                notesConfig.GetNoteDirPairs());

            NoteDirNameJoinStr = noteDirsPairCfg.DirNames.NoteItemsPfxes.JoinStr;
            NoteDirNameMainPfx = noteDirsPairCfg.DirNames.NoteItemsPfxes.MainPfx;
            NoteDirNameAltPfx = noteDirsPairCfg.DirNames.NoteItemsPfxes.AltPfx;

            var opts = new IdxesUpdaterOpts
            {
                IncIdx = noteDirsPairCfg.NoteDirNameIdxes.IncIdx ?? true,
                MinIdx = noteDirsPairCfg.NoteDirNameIdxes.MinIdx ?? NextNoteIdxRetriever.DF_MIN_VALUE,
                MaxIdx = noteDirsPairCfg.NoteDirNameIdxes.MaxIdx ?? NextNoteIdxRetriever.DF_MAX_VALUE,
            };

            idxesUpdater.NormalizeOpts(opts);

            NoteDirNameIncIdx = opts.IncIdx;
            NoteDirNameMinIdx = opts.MinIdx;
            NoteDirNameMaxIdx = opts.MaxIdx;
            NoteDirNameDfStIdx = opts.DfStIdx;
            NoteDirNameDfEndIdx = opts.DfEndIdx;
            NoteIdxIncVal = opts.IdxIncVal;
            IdxComparison = opts.IdxComparison;
        }

        private string NoteDirNameJoinStr { get; }
        private string NoteDirNameMainPfx { get; }
        private string NoteDirNameAltPfx { get; }
        private bool NoteDirNameIncIdx { get; }
        private int NoteDirNameMinIdx { get; }
        private int NoteDirNameMaxIdx { get; }
        private int NoteDirNameDfStIdx { get; set; }
        private int NoteDirNameDfEndIdx { get; set; }
        private int NoteIdxIncVal { get; }
        private Comparison<int> IdxComparison { get; }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetProgArgs(rawArgs);
            var wka = await GetWorkArgsAsync(args);

            GetResultMap(wka);
            GetLoopWorkArgsItemsList(wka);

            Console.ResetColor();
            bool userCancelledExecution = false;

            if (wka.Args.InteractiveMode == true)
            {
                Console.WriteLine();
                Console.WriteLine("Do you want to go on with the renaming of dir pairs? Type Y for yes, or anything else for no.");
                string answer = Console.ReadLine();

                if (answer.ToUpper() != "Y")
                {
                    userCancelledExecution = true;
                    Console.WriteLine("No renaming will be performed. Exiting the program");
                }
                else
                {
                    Console.WriteLine("Proceeding with the renaming of dir pairs");
                }

                Console.WriteLine();
            }

            if (!userCancelledExecution)
            {
                Run(wka);
            }
        }

        public void Run(WorkArgs wka)
        {
            Console.ForegroundColor = ConsoleColor.Black;

            RunCore(wka, "Renaming dir pairs to temp names",
                ConsoleColor.Blue, loopWka => new Dictionary<string, string>
                    {
                        { loopWka.ShortDirName, loopWka.TempShortDirName },
                        { loopWka.FullDirName, loopWka.TempFullDirName }
                    });

            RunCore(wka, "Renaming dir pairs to final names",
                ConsoleColor.Cyan, loopWka => new Dictionary<string, string>
                    {
                        { loopWka.TempShortDirName, loopWka.NewShortDirName },
                        { loopWka.TempFullDirName, loopWka.NewFullDirName }
                    });

            PrintActionName(
                "Successfully renamed dir pairs to final names",
                ConsoleColor.Green);
        }

        private void RunCore(
            WorkArgs wka,
            string actionName,
            ConsoleColor backgroundColor,
            Func<LoopWorkArgsItem, Dictionary<string, string>> dirNamesMapFactory) => RunCore(wka, actionName, backgroundColor, loopWka =>
                {
                    foreach (var kvp in dirNamesMapFactory(loopWka))
                    {
                        var srcDirPath = Path.Combine(wka.Args.WorkDir, kvp.Key);
                        var trgDirPath = Path.Combine(wka.Args.WorkDir, kvp.Value);

                        FsH.MoveDirectory(srcDirPath, trgDirPath);
                    }
                });

        private void RunCore(
            WorkArgs wka,
            string actionName,
            ConsoleColor backgroundColor,
            Action<LoopWorkArgsItem> loopWkaAction)
        {
            PrintActionName(actionName, backgroundColor);

            foreach (var loopWka in wka.LoopWorkArgsItemsList)
            {
                loopWkaAction(loopWka);
            }
        }

        private void PrintActionName(
            string actionName,
            ConsoleColor backgroundColor)
        {
            Console.BackgroundColor = backgroundColor;
            Console.WriteLine();
            Console.WriteLine(actionName);
        }

        private async Task<WorkArgs> GetWorkArgsAsync(ProgramArgs args)
        {
            var wka = new WorkArgs
            {
                Args = args,
            };

            wka.NoteItemsTuple = await existingDirPairsRetriever.GetNoteDirPairsAsync(args.WorkDir);

            wka.NoteDirsPairTuplesList = wka.NoteItemsTuple.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat == NoteDirCategory.Item).ToList();

            if (wka.NoteItemsTuple.FileDirsPairTuples.Any())
            {
                throw new InvalidOperationException(
                    "Detected file dir pairs in this folder and this would make things too ambigous");
            }

            if (wka.NoteDirsPairTuplesList.None())
            {
                throw new InvalidOperationException(
                    "Detected no note dir pairs in this folder");
            }

            if (wka.NoteItemsTuple.DirsPairTuples.Any(
                tuple => tuple.FullDirName == null))
            {
                throw new InvalidOperationException(
                    "Detected invalid dir pairs in this folder");
            }

            return wka;
        }

        private ProgramArgs GetProgArgs(string[] rawArgs)
        {
            ConsoleArgsParseHandlerOpts<ProgramArgs> argsParseHandlerOpts = null;

            var args = consoleArgsParser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data =>
                    {
                        if (data.ArgFlagName == null)
                        {
                            data.Args.IdxesUpdateMappings.Add(
                                ParseIdxesUpdateMapping(data.ArgItem));
                        }
                        else
                        {
                            consoleArgsParser.HandleArgs(
                                argsParseHandlerOpts ??= new ConsoleArgsParseHandlerOpts<ProgramArgs>
                                {
                                    Data = data,
                                    ThrowOnTooManyArgs = false,
                                    ThrowOnUnknownFlag = true,
                                    ItemHandlersArr = [],
                                    FlagHandlersArr = [
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.InteractiveMode.Arr(),
                                            data => data.Args.InteractiveMode = true),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.WorkDir.Arr(),
                                            data => data.Args.WorkDir = data.ArgFlagValue.Single().Nullify(
                                                true)?.With(path => NormPathH.NormPath(
                                                    path, (path, isRooted) => isRooted.If(
                                                        () => path, () => Path.GetFullPath(
                                                            path))))!)
                                    ],
                                });
                        }
                    },
                    ArgsFactory = () => new ProgramArgs
                    {
                        IdxesUpdateMappings = new List<IdxesUpdateMapping>()
                    }
                }).Args;

            NormalizeArgs(args);
            return args;
        }

        private IdxesUpdateMapping ParseIdxesUpdateMapping(
            string rawArg)
        {
            (var srcFilter, var trgFilter) = rawArg.SplitStr(
                (str, count) => str.IndexOf(
                    ConsoleArgsParser.OPTS_ARG_DELIM_CHAR));

            if (trgFilter == null)
            {
                throw new ArgumentNullException(
                    $"Invalid idxes filter: {rawArg}");
            }
            else
            {
                trgFilter = trgFilter.Substring(1);
            }

            var mapping = new IdxesUpdateMapping
            {
                SrcIdxes = srcFilter.Split(
                    ITEMS_LIST_SEP_CHR).Select(
                        ParseIdxesFilter).ToList(),
                TrgIdxes = trgFilter.Split(
                    ITEMS_LIST_SEP_CHR).Select(
                        ParseIdxesFilter).ToList()
            };

            return mapping;
        }

        private IdxesFilter ParseIdxesFilter(
            string rawArg)
        {
            var idxesFilter = new IdxesFilter();

            (var stIdxStr, var endIdxStr) = rawArg.SplitStr(
                (str, count) => str.IndexOf(ITEMS_SPREAD_STR));

            if (endIdxStr == null)
            {
                idxesFilter.SingleIdx = int.Parse(stIdxStr);
            }
            else
            {
                endIdxStr = endIdxStr.Substring(
                    ITEMS_SPREAD_STR.Length);

                if (!string.IsNullOrEmpty(stIdxStr))
                {
                    idxesFilter.StartIdx = int.Parse(stIdxStr);
                }

                if (!string.IsNullOrEmpty(endIdxStr))
                {
                    idxesFilter.EndIdx = int.Parse(endIdxStr);
                }
            }

            return idxesFilter;
        }

        private void NormalizeArgs(ProgramArgs args)
        {
            args.WorkDir ??= Environment.CurrentDirectory;

            if (args.IdxesUpdateMappings.None())
            {
                args.IdxesUpdateMappings.Add(new IdxesUpdateMapping
                {
                    SrcIdxes = new IdxesFilter().Lst(),
                    TrgIdxes = new IdxesFilter().Lst()
                });
            }
        }

        private void GetResultMap(WorkArgs wka)
        {
            var idxesUpdaterOpts = GetIdxesUpdaterOpts(opts =>
            {
                opts.PrevIdxes = wka.NoteDirsPairTuplesList.Select(
                    tuple => tuple.NoteDirIdx).ToArray();

                opts.IdxesUpdateMappings = wka.Args.IdxesUpdateMappings.ToArray();
            });

            wka.ResultMap = idxesUpdater.UpdateIdxes(
                idxesUpdaterOpts).ToDictionary(
                    kvp => kvp.Value, kvp => wka.NoteDirsPairTuplesList.Single(
                        tuple => tuple.NoteDirIdx == kvp.Key));
        }

        private IdxesUpdaterOpts GetIdxesUpdaterOpts(
            Action<IdxesUpdaterOpts> optsBuilder = null)
        {
            var opts = new IdxesUpdaterOpts
            {
                IncIdx = NoteDirNameIncIdx,
                MinIdx = NoteDirNameMinIdx,
                MaxIdx = NoteDirNameMaxIdx,
            };

            optsBuilder?.Invoke(opts);
            return opts;
        }

        private void GetLoopWorkArgsItemsList(WorkArgs wka)
        {
            wka.LoopWorkArgsItemsList = wka.ResultMap.Select(
                (kvp, i) =>
                {
                    LoopWorkArgsItem loopWka = null!;
                    var dirsPairTuple = kvp.Value;

                    if (kvp.Key != dirsPairTuple.NoteDirIdx)
                    {
                        loopWka = CreateLoopWorkArgsItem(
                            dirsPairTuple, kvp.Key);

                        PrintGetLoopWorkArgsItem(loopWka);
                    }

                    return loopWka;
                }).NotNull().ToList();
        }

        private LoopWorkArgsItem CreateLoopWorkArgsItem(
            DirsPairTuple dirsPairTuple,
            int newIdx)
        {
            var loopWka = new LoopWorkArgsItem
            {
                NewIdx = newIdx,
                FullDirNamePart = dirsPairTuple.FullDirNamePart,
                ShortDirName = dirsPairTuple.ShortDirName,
                FullDirName = dirsPairTuple.FullDirName
            };

            loopWka.TempShortDirName = loopWka.ShortDirName.Substring(
                NoteDirNameMainPfx.Length);

            loopWka.TempFullDirName = loopWka.FullDirName.Substring(
                NoteDirNameMainPfx.Length);

            loopWka.TempShortDirName = NoteDirNameAltPfx + loopWka.TempShortDirName;
            loopWka.TempFullDirName = NoteDirNameAltPfx + loopWka.TempFullDirName;

            loopWka.NewShortDirName = NoteDirNameMainPfx + loopWka.NewIdx;

            loopWka.NewFullDirName = string.Join(
                NoteDirNameMainPfx, loopWka.NewIdx,
                NoteDirNameJoinStr,
                loopWka.FullDirNamePart);

            return loopWka;
        }

        private void PrintGetLoopWorkArgsItem(
            LoopWorkArgsItem loopWka)
        {
            Console.WriteLine();

            PrintToConsole(loopWka.ShortDirName, false, ConsoleColor.DarkCyan);
            PrintToConsole(" -> ", false, ConsoleColor.DarkGray);
            PrintToConsole(loopWka.NewShortDirName, true, ConsoleColor.Cyan);

            Console.WriteLine();
        }

        private void PrintToConsole(
            string msg, bool withNl,
            ConsoleColor foregroundColor)
        {
            Console.ForegroundColor = foregroundColor;

            if (withNl)
            {
                Console.WriteLine(msg);
            }
            else
            {
                Console.Write(msg);
            }
        }

        public class WorkArgs
        {
            public ProgramArgs Args { get; set; }
            public NoteItemsTupleCore NoteItemsTuple { get; set; }
            public List<DirsPairTuple> NoteDirsPairTuplesList { get; set; }
            public Dictionary<int, DirsPairTuple> ResultMap { get; set; }
            public List<LoopWorkArgsItem> LoopWorkArgsItemsList { get; set; }
        }

        public class LoopWorkArgsItem
        {
            public int NewIdx { get; set; }
            public string FullDirNamePart { get; set; }
            public string ShortDirName { get; set; }
            public string FullDirName { get; set; }
            public string TempShortDirName { get; set; }
            public string TempFullDirName { get; set; }
            public string NewShortDirName { get; set; }
            public string NewFullDirName { get; set; }
        }
    }
}
