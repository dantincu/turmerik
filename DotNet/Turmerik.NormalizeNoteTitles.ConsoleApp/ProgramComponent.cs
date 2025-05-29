using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextParsing.Md;
using Turmerik.Core.TextSerialization;
using Turmerik.DirsPair;
using Turmerik.Md;
using Turmerik.Notes.Core;

namespace Turmerik.NormalizeNoteTitles.ConsoleApp
{
    public class ProgramComponent
    {
        private const string W = "w";
        private const string REC = "rec";

        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly INoteMdParser nmdParser;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly DirsPairConfig config;
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly INotesAppConfigLoader notesAppConfigLoader;
        private readonly LocalDevicePathMacrosMapMtbl localDevicePathMacrosMapMtbl;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser parser,
            IConsoleMsgPrinter consoleMsgPrinter,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ITextMacrosReplacer textMacrosReplacer,
            INoteMdParser nmdParser,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory,
            IDirsPairConfigLoader dirsPairConfigLoader,
            INotesAppConfigLoader notesAppConfigLoader)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.parser = parser ?? throw new ArgumentNullException(
                nameof(parser));

            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.localDevicePathMacrosMapMtbl = localDevicePathMacrosRetriever.LoadFromConfigFile();

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.nmdParser = nmdParser ?? throw new ArgumentNullException(
                nameof(nmdParser));

            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            this.notesAppConfigLoader = notesAppConfigLoader ?? throw new ArgumentNullException(
                nameof(notesAppConfigLoader));

            config = dirsPairConfigLoader.LoadConfig();
            notesConfig = notesAppConfigLoader.LoadConfig();

            existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                notesConfig.GetNoteDirPairs());
        }


        public async Task RunAsync(
            string[] rawArgs)
        {
            var pgArgs = ParseArgs(rawArgs);

            await RunAsync(pgArgs, pgArgs.WorkDir, true);
        }

        public async Task<bool> RunAsync(
            ProgramArgs pgArgs,
            string prIdnf,
            bool isInteractive)
        {
            var existingPairs = await existingDirPairsRetriever.GetNoteDirPairsAsync(
                prIdnf);

            var allNoteTuples = existingPairs.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat != NoteDirCategory.Internals).ToArray();

            var allNoteHcyTuplesMap = allNoteTuples.Select(
                tuple => new NoteItemsHcyTuple
                {
                    PrTuple = tuple,
                    ShortDirPath = Path.Combine(
                        prIdnf, tuple.ShortDirName)
                }).ToArray();

            foreach (var tuple in allNoteHcyTuplesMap)
            {
                bool hasNoTitle = false;
                bool hasObsTitle = false;
                bool hasErrors = false;
                bool hasMdTitle = false;
                string? mdTitle = null;
                string? jsonStr = null;

                var allMdFiles = Directory.GetFiles(
                    tuple.ShortDirPath, "*.md", SearchOption.TopDirectoryOnly);

                bool hasNoMdFiles = allMdFiles.None();
                bool hasTooManyMdFiles = allMdFiles.Length > 1;

                var jsonFilePath = Path.Combine(
                    tuple.ShortDirPath, config.FileNames.JsonFileName);

                bool hasNoJsonFile = File.Exists(
                    jsonFilePath) == false;

                NoteItemCore noteItem;

                if (!hasNoJsonFile)
                {
                    jsonStr = File.ReadAllText(jsonFilePath);
                    noteItem = jsonConversion.Adapter.Deserialize<NoteItemCore>(jsonStr);
                    hasNoTitle = string.IsNullOrWhiteSpace(noteItem.Title);
                }
                else
                {
                    noteItem = new();
                }

                if (!hasNoMdFiles && !hasTooManyMdFiles)
                {
                    string mdFilePath = allMdFiles.Single();

                    mdTitle = MdH.TryGetMdTitleFromFile(
                        mdFilePath);

                    hasMdTitle = !string.IsNullOrWhiteSpace(mdTitle);
                    hasObsTitle = mdTitle != noteItem.Title;
                }

                hasErrors = hasNoMdFiles || hasTooManyMdFiles || hasNoJsonFile || hasNoTitle || hasObsTitle;

                if (hasErrors)
                {
                    Console.WriteLine();
                    Console.ForegroundColor = ConsoleColor.DarkCyan;
                    Console.Write("Short dir path: ");
                    Console.ForegroundColor = ConsoleColor.Cyan;
                    Console.WriteLine(tuple.ShortDirPath);
                    Console.ForegroundColor = ConsoleColor.Red;

                    if (hasNoMdFiles)
                    {
                        Console.WriteLine("Has no markdown files");
                    }
                    else if (hasTooManyMdFiles)
                    {
                        Console.WriteLine("Has too many markdown files");
                    }
                    else if (hasNoJsonFile)
                    {
                        Console.WriteLine("Has no json file");
                    }
                    else if (hasNoTitle)
                    {
                        Console.WriteLine("Has no title");
                    }
                    else if (hasObsTitle)
                    {
                        Console.WriteLine("Has obsolete title");
                    }

                    if (isInteractive)
                    {
                        Console.ResetColor();
                        Console.WriteLine("Press any key to proceed with this one only or ENTER to proceed with all");

                        var answer = Console.ReadKey();
                        isInteractive = answer.Key != ConsoleKey.Enter;
                    }

                    if (hasMdTitle)
                    {
                        Console.WriteLine();
                        noteItem.Title = mdTitle!;
                        jsonStr = jsonConversion.Adapter.Serialize(noteItem);
                        File.WriteAllText(jsonFilePath!, jsonStr);
                    }
                }

                isInteractive = await RunAsync(pgArgs, tuple.ShortDirPath, isInteractive);
            }

            return isInteractive;
        }

        public ProgramArgs ParseArgs(
            string[] rawArgs)
        {
            var pgArgs = parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = [],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data,
                                    [W], data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                                parser.ArgsFlagOpts(data,
                                    [REC], data => data.Args.RecursiveMatchingDirNamesArr = data.ArgFlagValue!),
                            ]
                        })
                }).Args;

            pgArgs.WorkDir ??= string.Empty;
            pgArgs.LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile();

            pgArgs.WorkDir = textMacrosReplacer.NormalizePath(
                pgArgs.LocalDevicePathsMap,
                pgArgs.WorkDir, Environment.CurrentDirectory);

            pgArgs.RecursiveMatchingDirNameRegexsArr = pgArgs.RecursiveMatchingDirNamesArr?.Select(
                dirName => new Regex(dirName)).ToArray();

            return pgArgs;
        }

        internal class NoteItemsHcyTuple
        {
            public DirsPairTuple PrTuple { get; set; }
            public string ShortDirPath { get; set; }
            public NoteItemsTupleCore ChildEntries { get; set; }
        }
    }
}
