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
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
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

        Task RunAsync(
            ProgramArgs args);

        void Run(WorkArgs wka);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly IIdxesFilterParser idxesFilterParser;
        private readonly IdxesUpdater idxesUpdater;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly DirsPairConfig config;
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly INotesAppConfigLoader notesAppConfigLoader;
        private readonly NoteDirsPairConfigMtbl noteDirsPairCfg;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            ITextMacrosReplacer textMacrosReplacer,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            IConsoleMsgPrinter consoleMsgPrinter,
            IIdxesFilterParser idxesFilterParser,
            IdxesUpdater idxesUpdater,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory,
            IDirsPairConfigLoader dirsPairConfigLoader,
            INotesAppConfigLoader notesAppConfigLoader)
        {
            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.idxesFilterParser = idxesFilterParser ?? throw new ArgumentNullException(
                nameof(idxesFilterParser));

            this.idxesUpdater = idxesUpdater ?? throw new ArgumentNullException(
                nameof(idxesUpdater));

            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            this.notesAppConfigLoader = notesAppConfigLoader ?? throw new ArgumentNullException(
                nameof(notesAppConfigLoader));

            config = dirsPairConfigLoader.LoadConfig();
            notesConfig = notesAppConfigLoader.LoadConfig();

            noteDirsPairCfg = notesConfig.NoteDirPairs;

            existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                notesConfig.GetNoteDirPairs());
        }

        public async Task RunAsync(
            string[] rawArgs)
        {
            var args = GetProgArgs(rawArgs);
            await RunAsync(args);
        }

        public async Task RunAsync(
            ProgramArgs args)
        {
            if (args.PrintHelpMessage != true)
            {
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
        }

        public void Run(
            WorkArgs wka)
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

        private void PrintHelpMessage(
            ProgramArgs args)
        {
            var x = consoleMsgPrinter.GetDefaultExpressionValues();
            var argOpts = config.ArgOpts;

            var msgTpl = (
                string text,
                string prefix = null) => ConsoleStrMsgTuple.New(
                    prefix ?? $"{{{x.Cyan}}}", text, x.Splitter);

            var optsHead = (string optsStr, string sffxStr, bool? required = null) =>
            {
                var retStr = string.Concat(
                    required == true ? $"{{{x.DarkRed}}}*" : string.Empty,
                    $"{{{x.DarkCyan}}}{optsStr}",
                    required == false ? $"{{{x.Cyan}}}?" : string.Empty,
                    $"{{{x.DarkGray}}}{sffxStr}{{{x.Splitter}}}");

                return retStr;
            };

            var m = new
            {
                ThisTool = msgTpl("this tool"),
            };

            string[] linesArr = [
                $"{{{x.Blue}}}Welcome to the Turmerik UpdFsDirPairsIdxes tool{{{x.NewLine}}}",

                string.Join(" ", $"{m.ThisTool.U} helps you update short folder name indexes for",
                $"note items and sections folder pairs{{{x.NewLine}}}."),

                string.Join(" ", $"Here is a list of argument options {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.WorkDir}", ""),
                    $"Changes the work directory where the folder pair names will be updated",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.InteractiveMode}", ""),
                    $"Enables the interactive mode, where after printing the",
                    $"current and new names for the folders that are to be renamed,",
                    $"the user is then asked to confirm if they wish to go on with the execution of the program,",
                    $"or cancel the execution{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.CreateNoteSection}", ""),
                    $"Indicates that only the names of the note sections folder pairs should be affected by this command",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.ConvertToNoteSections}", ""),
                    $"Indicates that all the folders that are to be renamed are currently",
                    $"of type note items, and will be converted to note sections",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.ConvertToNoteItems}", ""),
                    $"Indicates that all the folders that are to be renamed are currently",
                    $"of type note sections, and will be converted to note items",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.PrintHelpMessage}", ""),
                    $"Prints this help message to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of arguments {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"{{{x.DarkBlue}}}1. {{{x.Splitter}}}The {{{x.Blue}}}indexes update mappings{{{x.Splitter}}}",
                    $"(supports multiple values) filters down the list of affected folder pair indexes and provides",
                    $"target indexes for the current indexes to be updated to",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                $"{{{x.Blue}}}You can find the source code for this tool at the following url:",
                string.Concat(
                    $"{{{x.DarkGreen}}}",
                    "https://github.com/dantincu/turmerik/tree/main/DotNet/Turmerik.UpdFsDirPairsIdxes.ConsoleApp",
                    $"{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}")];

            consoleMsgPrinter.Print(linesArr, null, x);
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

            wka.NoteItemDirsPairTuplesList = wka.NoteItemsTuple.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat == NoteDirCategory.Item).ToList();

            wka.NoteSectionDirsPairTuplesList = wka.NoteItemsTuple.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat == NoteDirCategory.Section).ToList();

            if (wka.NoteItemsTuple.FileDirsPairTuples.Any())
            {
                throw new InvalidOperationException(
                    "Detected file dir pairs in this folder and this would make things too ambigous");
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
                                            config.ArgOpts.PrintHelpMessage.Arr(),
                                            data => data.Args.PrintHelpMessage = true, true),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.InteractiveMode.Arr(),
                                            data => data.Args.InteractiveMode = true, true),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.WorkDir.Arr(),
                                            data => data.Args.WorkDir = data.ArgFlagValue.Single().Nullify(true)),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNoteSection.Arr(),
                                            data =>
                                            {
                                                data.Args.UpdateSections = true;
                                                data.Args.TrgFromSections = true;
                                                data.Args.SrcFromSections = true;

                                                if (data.ArgFlagValue.Any())
                                                {
                                                    data.Args.TrgSectionRank = data.ArgFlagValue.First().Nullify();
                                                    data.Args.SrcSectionRank = data.ArgFlagValue.Last().Nullify();
                                                }
                                            }, false, 2),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNote.Arr(),
                                            data =>
                                            {
                                                data.Args.UpdateNotes = true;
                                                data.Args.SrcFromSections = false;
                                                data.Args.TrgFromSections = false;
                                            }, true),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.ConvertToNoteSections.Arr(),
                                            data =>
                                            {
                                                data.Args.ConvertToNoteSections = true;
                                                data.Args.TrgSectionRank = data.ArgFlagValue.FirstOrDefault().Nullify();
                                                data.Args.SrcFromSections = false;
                                                data.Args.TrgFromSections = true;
                                            }, false, 1),
                                        consoleArgsParser.ArgsFlagOpts(data,
                                            config.ArgOpts.ConvertToNoteItems.Arr(),
                                            data =>
                                            {
                                                data.Args.ConvertToNoteItems = true;
                                                data.Args.SrcSectionRank = data.ArgFlagValue.FirstOrDefault().Nullify();
                                                data.Args.SrcFromSections = true;
                                                data.Args.TrgFromSections = false;
                                            }, false, 1)
                                    ],
                                });
                        }
                    },
                    ArgsFactory = () => new ProgramArgs
                    {
                        IdxesUpdateMappings = new List<IdxesUpdateMapping>(),
                        LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile()
                    }
                }).Args;

            if (args.PrintHelpMessage == true)
            {
                PrintHelpMessage(args);
            }
            else
            {
                NormalizeArgs(args);
            }

            return args;
        }

        private void NormalizeArgs(ProgramArgs args)
        {
            args.WorkDir = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                args.WorkDir,
                Directory.GetCurrentDirectory());

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
            var srcIdxesUpdaterOpts = GetIdxesUpdaterOpts(
                wka, wka.Args.SrcFromSections,
                wka.Args.SrcSectionRank,
                out var srcDirNameIdxes);

            var trgIdxesUpdaterOpts = GetIdxesUpdaterOpts(
                wka, wka.Args.TrgFromSections,
                wka.Args.TrgSectionRank,
                out var trgDirNameIdxes);

            var idxesUpdateMappings = wka.Args.IdxesUpdateMappings.ToArray();

            var noteDirsPairTuplesList = GetNoteDirsPairTuplesList(
                wka, wka.Args.SrcFromSections, srcDirNameIdxes);

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
                            dirsPairTuple, kvp.Key,
                            wka.Args.SrcFromSections,
                            wka.Args.TrgFromSections);

                        PrintGetLoopWorkArgsItem(loopWka);
                    }

                    return loopWka;
                }).NotNull().ToList();
        }

        private LoopWorkArgsItem CreateLoopWorkArgsItem(
            DirsPairTuple dirsPairTuple,
            int newIdx,
            bool? srcFromSections,
            bool? trgFromSections)
        {
            var loopWka = new LoopWorkArgsItem
            {
                NewIdx = newIdx,
                FullDirNamePart = dirsPairTuple.FullDirNamePart,
                ShortDirName = dirsPairTuple.ShortDirName,
                FullDirName = dirsPairTuple.FullDirName
            };

            loopWka.TempShortDirName = loopWka.ShortDirName.Substring(
                GetNoteDirNameMainPfx(srcFromSections).Length);

            loopWka.TempFullDirName = loopWka.FullDirName.Substring(
                GetNoteDirNameMainPfx(srcFromSections).Length);

            loopWka.TempShortDirName = GetNoteDirNameAltPfx(srcFromSections) + loopWka.TempShortDirName;
            loopWka.TempFullDirName = GetNoteDirNameAltPfx(srcFromSections) + loopWka.TempFullDirName;

            loopWka.NewShortDirName = GetNoteDirNameMainPfx(trgFromSections) + loopWka.NewIdx;

            loopWka.NewFullDirName = string.Join(
                GetNoteDirNameMainPfx(trgFromSections), loopWka.NewIdx,
                GetNoteDirNameJoinStr(trgFromSections),
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
            bool? updateSections,
            string? sectionRank,
            out NoteDirsPairConfig.IDirNameIdxesT dirNameIdxes)
        {
            dirNameIdxes = updateSections switch
            {
                true => sectionRank.IfNotNull(
                    sectionRankStr => noteDirsPairCfg.GetNoteSectionDirNameIdxesMap()[sectionRankStr!],
                    () => noteDirsPairCfg.GetNoteSectionDirNameIdxes()),
                _ => noteDirsPairCfg.GetNoteDirNameIdxes()
            };

            var idxesUpdaterOpts = idxesUpdater.NormalizeOpts(
                new IdxesUpdaterOpts
                {
                    IncIdx = dirNameIdxes.IncIdx ?? true,
                    MinIdx = dirNameIdxes.MinIdx ?? NextNoteIdxRetriever.DF_MIN_VALUE,
                    MaxIdx = dirNameIdxes.MaxIdx ?? NextNoteIdxRetriever.DF_MAX_VALUE,
                });

            var noteDirsPairTuplesList = GetNoteDirsPairTuplesList(
                wka, updateSections, dirNameIdxes);

            idxesUpdaterOpts.PrevIdxes = noteDirsPairTuplesList.Select(
                tuple => tuple.NoteDirIdx).ToArray();

            return idxesUpdaterOpts;
        }

        private List<DirsPairTuple> GetNoteDirsPairTuplesList(
            WorkArgs wka,
            bool? updateSections,
            NoteDirsPairConfig.IDirNameIdxesT dirNameIdxes) => updateSections switch
        {
            true => wka.NoteSectionDirsPairTuplesList.Where(
                tuple => tuple.NoteDirIdx >= (
                dirNameIdxes.MinIdx ?? NextNoteIdxRetriever.DF_MIN_VALUE) && (
                tuple.NoteDirIdx <= (dirNameIdxes.MaxIdx ?? NextNoteIdxRetriever.DF_MAX_VALUE))).ToList(),
            _ => wka.NoteItemDirsPairTuplesList
        };

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
