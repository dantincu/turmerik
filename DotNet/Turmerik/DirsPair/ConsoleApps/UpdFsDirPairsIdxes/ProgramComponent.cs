using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing.IndexesFilter;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
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
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly IIdxesFilterParser idxesFilterParser;
        private readonly IdxesUpdater idxesUpdater;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly NoteDirsPairConfigMtbl noteDirsPairCfg;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            IIdxesFilterParser idxesFilterParser,
            IdxesUpdater idxesUpdater,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory)
        {
            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.idxesFilterParser = idxesFilterParser ?? throw new ArgumentNullException(
                nameof(idxesFilterParser));

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

            existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                notesConfig.GetNoteDirPairs());
        }

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
            Func<LoopWorkArgsItem, Dictionary<string, string>> dirNamesMapFactory) => RunCore(
                wka, actionName, backgroundColor, loopWka =>
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

            /* var noteDirCat = args.UpdateSections switch
            {
                true => NoteDirCategory.Section,
                _ => NoteDirCategory.Item
            }; */

            wka.NoteItemDirsPairTuplesList = wka.NoteItemsTuple.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat == NoteDirCategory.Item).ToList();

            wka.NoteSectionDirsPairTuplesList = wka.NoteItemsTuple.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat == NoteDirCategory.Section).ToList();

            if (wka.NoteItemsTuple.FileDirsPairTuples.Any())
            {
                throw new InvalidOperationException(
                    "Detected file dir pairs in this folder and this would make things too ambigous");
            }

            /* if (wka.NoteItemDirsPairTuplesList.None())
            {
                throw new InvalidOperationException(
                    "Detected no note dir pairs in this folder");
            } */

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
                            data.Args.IdxesUpdateMappings.AddRange(
                                idxesFilterParser.ParseIdxesUpdateMapping(data.ArgItem));
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
                                            data => data.Args.InteractiveMode = true, true),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.WorkDir.Arr(),
                                            data => data.Args.WorkDir = data.ArgFlagValue.Single().Nullify(
                                                true)?.With(path => NormPathH.NormPath(
                                                    path, (path, isRooted) => isRooted.If(
                                                        () => path, () => Path.GetFullPath(
                                                            path))))!),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNoteSection.Arr(),
                                            data => data.Args.UpdateSections = true, true),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.ConvertToNoteSections.Arr(),
                                            data => data.Args.ConvertToNoteSections = true, true),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.ConvertToNoteItems.Arr(),
                                            data => data.Args.ConvertToNoteItems = true, true)
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

            if (new bool?[] {args.UpdateSections, args.ConvertToNoteSections, args.ConvertToNoteItems }.Where(
                value => value == true).Count() > 1)
            {
                throw new ArgumentException(
                    string.Join(" ", $"Only one of the following flags can be provided:",
                        string.Join(",",
                            args.UpdateSections,
                            args.ConvertToNoteSections),
                        "or", nameof(args.ConvertToNoteItems)));
            }
            else
            {
                if (args.UpdateSections == true)
                {
                    args.SrcFromSections = true;
                    args.TrgFromSections = true;
                }
                else if (args.ConvertToNoteSections == true)
                {
                    args.TrgFromSections = true;
                }
                else if (args.ConvertToNoteItems == true)
                {
                    args.SrcFromSections = true;
                }
            }
        }

        private void GetResultMap(WorkArgs wka)
        {
            var srcIdxesUpdaterOpts = GetIdxesUpdaterOpts(
                wka, wka.Args.SrcFromSections);

            var trgIdxesUpdaterOpts = GetIdxesUpdaterOpts(
                wka, wka.Args.TrgFromSections);

            var idxesUpdateMappings = wka.Args.IdxesUpdateMappings.ToArray();

            var noteDirsPairTuplesList = GetNoteDirsPairTuplesList(
                wka, wka.Args.SrcFromSections);

            wka.ResultMap = idxesUpdater.UpdateIdxes(
                srcIdxesUpdaterOpts,
                trgIdxesUpdaterOpts,
                idxesUpdateMappings).ToDictionary(
                    kvp => kvp.Value, kvp => noteDirsPairTuplesList.Single(
                        tuple => tuple.NoteDirIdx == kvp.Key));
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
                            dirsPairTuple, kvp.Key, wka.Args.UpdateSections);

                        PrintGetLoopWorkArgsItem(loopWka);
                    }

                    return loopWka;
                }).NotNull().ToList();
        }

        private LoopWorkArgsItem CreateLoopWorkArgsItem(
            DirsPairTuple dirsPairTuple,
            int newIdx,
            bool? updateSections)
        {
            var loopWka = new LoopWorkArgsItem
            {
                NewIdx = newIdx,
                FullDirNamePart = dirsPairTuple.FullDirNamePart,
                ShortDirName = dirsPairTuple.ShortDirName,
                FullDirName = dirsPairTuple.FullDirName
            };

            loopWka.TempShortDirName = loopWka.ShortDirName.Substring(
                GetNoteDirNameMainPfx(updateSections).Length);

            loopWka.TempFullDirName = loopWka.FullDirName.Substring(
                GetNoteDirNameMainPfx(updateSections).Length);

            loopWka.TempShortDirName = GetNoteDirNameAltPfx(updateSections) + loopWka.TempShortDirName;
            loopWka.TempFullDirName = GetNoteDirNameAltPfx(updateSections) + loopWka.TempFullDirName;

            loopWka.NewShortDirName = GetNoteDirNameMainPfx(updateSections) + loopWka.NewIdx;

            loopWka.NewFullDirName = string.Join(
                GetNoteDirNameMainPfx(updateSections), loopWka.NewIdx,
                GetNoteDirNameJoinStr(updateSections),
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
            string msg,
            bool withNl,
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

        private string GetNoteDirNameJoinStr(
            bool? updateSections) => updateSections switch
            {
                true => noteDirsPairCfg.DirNames.NoteSectionsPfxes.JoinStr,
                _ => noteDirsPairCfg.DirNames.NoteItemsPfxes.JoinStr
            };

        private string GetNoteDirNameMainPfx(
            bool? updateSections) => updateSections switch
            {
                true => noteDirsPairCfg.DirNames.NoteSectionsPfxes.MainPfx,
                _ => noteDirsPairCfg.DirNames.NoteItemsPfxes.MainPfx
            };

        private string GetNoteDirNameAltPfx(
            bool? updateSections) => updateSections switch
            {
                true => noteDirsPairCfg.DirNames.NoteSectionsPfxes.AltPfx,
                _ => noteDirsPairCfg.DirNames.NoteItemsPfxes.AltPfx
            };

        private IdxesUpdaterOpts GetIdxesUpdaterOpts(
            WorkArgs wka,
            bool? updateSections)
        {
            var idxesUpdaterOpts = GetIdxesUpdaterOptsCore(
                updateSections);

            var noteDirsPairTuplesList = GetNoteDirsPairTuplesList(
                wka, updateSections);

            idxesUpdaterOpts.PrevIdxes = noteDirsPairTuplesList.Select(
                tuple => tuple.NoteDirIdx).ToArray();

            return idxesUpdaterOpts;
        }

        private List<DirsPairTuple> GetNoteDirsPairTuplesList(
            WorkArgs wka, bool? updateSections) => GetValue(
                updateSections,
                wka.NoteSectionDirsPairTuplesList,
                wka.NoteItemDirsPairTuplesList);

        private TValue GetValue<TValue>(
            bool? updateSections,
            TValue sectionsValue,
            TValue itemsValue) => updateSections switch
            {
                true => sectionsValue,
                _ => itemsValue
            };

        private IdxesUpdaterOpts GetIdxesUpdaterOptsCore(
            bool? updateSections) => idxesUpdater.NormalizeOpts(updateSections switch
            {
                true => new IdxesUpdaterOpts
                {
                    IncIdx = noteDirsPairCfg.NoteSectionDirNameIdxes.IncIdx ?? true,
                    MinIdx = noteDirsPairCfg.NoteSectionDirNameIdxes.MinIdx ?? NextNoteIdxRetriever.DF_MIN_VALUE,
                    MaxIdx = noteDirsPairCfg.NoteSectionDirNameIdxes.MaxIdx ?? NextNoteIdxRetriever.DF_MAX_VALUE,
                },
                _ => new IdxesUpdaterOpts
                {
                    IncIdx = noteDirsPairCfg.NoteDirNameIdxes.IncIdx ?? true,
                    MinIdx = noteDirsPairCfg.NoteDirNameIdxes.MinIdx ?? NextNoteIdxRetriever.DF_MIN_VALUE,
                    MaxIdx = noteDirsPairCfg.NoteDirNameIdxes.MaxIdx ?? NextNoteIdxRetriever.DF_MAX_VALUE,
                }
            });

        public class WorkArgs
        {
            public ProgramArgs Args { get; set; }
            public NoteItemsTupleCore NoteItemsTuple { get; set; }
            public List<DirsPairTuple> NoteItemDirsPairTuplesList { get; set; }
            public List<DirsPairTuple> NoteSectionDirsPairTuplesList { get; set; }
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
