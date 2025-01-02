using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextParsing.IndexesFilter;
using Turmerik.Core.TextSerialization;
using Turmerik.DirsPair;
using Turmerik.Md;
using Turmerik.Notes.Core;
using UpdFsDirPairsIdxes = Turmerik.DirsPair.ConsoleApps.UpdFsDirPairsIdxes;
using RfDirsPairNames = Turmerik.Puppeteer.ConsoleApps.RfDirsPairNames;
using MkFsDirPairs = Turmerik.Puppeteer.ConsoleApps.MkFsDirPairs;
using MdToPdf = Turmerik.Puppeteer.ConsoleApps.MdToPdf;
using Turmerik.Core.Helpers;

namespace Turmerik.ConcatenateNotes.ConsoleApp
{
    public class ProgramComponent
    {
        private const string W = "w";
        private const string REC = "rec";

        private static readonly Regex mdTitleRegex = new(@"^\s*\[.+\]\(.+\)\s*$");

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
        private readonly UpdFsDirPairsIdxes.IProgramComponent updFsDirPairsIdxes;
        private readonly RfDirsPairNames.IProgramComponent rfDirsPairNames;
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
            INotesAppConfigLoader notesAppConfigLoader,
            UpdFsDirPairsIdxes.IProgramComponent updFsDirPairsIdxes,
            RfDirsPairNames.IProgramComponent rfDirsPairNames)
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

            this.updFsDirPairsIdxes = updFsDirPairsIdxes ?? throw new ArgumentNullException(
                nameof(updFsDirPairsIdxes));

            this.rfDirsPairNames = rfDirsPairNames ?? throw new ArgumentNullException(
                nameof(rfDirsPairNames));
        }

        public async Task RunAsync(
            string[] rawArgs)
        {
            var pgArgs = ParseArgs(rawArgs);

            await RunAsync(pgArgs, pgArgs.WorkDir);
        }

        public async Task RunAsync(
            ProgramArgs pgArgs,
            string prIdnf)
        {
            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine($"PR_IDNF: {prIdnf}");
            Console.WriteLine();

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

            foreach (var hcyTuple in allNoteHcyTuplesMap)
            {
                hcyTuple.ChildEntries = await existingDirPairsRetriever.GetNoteDirPairsAsync(
                    hcyTuple.ShortDirPath);
            }

            foreach (var hcyTuple in allNoteHcyTuplesMap)
            {
                if (hcyTuple.PrTuple.NoteSectionRank == "1" && new string[] {
                    "$articles$" }.Contains(hcyTuple.PrTuple.FullDirNamePart))
                {
                    var noteItemsArr = hcyTuple.ChildEntries.DirsPairTuples.Where(
                        tuple => tuple.NoteDirCat == NoteDirCategory.Item).ToArray();

                    var linksList = new List<string>();
                    var noteItemsList = new List<DirsPairTuple>();

                    foreach (var noteItem in noteItemsArr)
                    {
                        var noteItemPath = Path.Combine(
                            hcyTuple.ShortDirPath,
                            noteItem.ShortDirName);

                        if (Directory.GetDirectories(noteItemPath).None())
                        {
                            var filesArr = Directory.GetFiles(
                                noteItemPath);

                            if (filesArr.Length > 4)
                            {
                                throw new Exception($"Found {filesArr.Length} files in dir path {noteItemPath}");
                            }

                            var extnsArr = new string[] { ".md", ".html", ".pdf", ".json" };

                            var extnsMap = extnsArr.ToDictionary(extn => extn, extn => filesArr.Where(
                                file => Path.GetExtension(file).ToLower() == extn).ToArray());

                            var extnKvp = extnsArr.FirstKvp(extn => extnsMap[extn].Count() > 1);

                            if (extnKvp.Key >= 0)
                            {
                                throw new Exception($"Found {extnsMap[extnKvp.Value].Length} files with extension {extnKvp.Value} in dir path {noteItemPath}");
                            }

                            if (extnsMap[".md"].None())
                            {
                                throw new Exception($"Found no md file in dir path {noteItemPath}");
                            }

                            var noteItemMdFile = extnsMap[".md"].Single();

                            var mdLinesArr = File.ReadAllLines(noteItemMdFile).Where(
                                line => !string.IsNullOrWhiteSpace(line)).ToArray();

                            if (mdLinesArr.Length == 2 && mdLinesArr[0].StartsWith(
                                "# ") && mdTitleRegex.IsMatch(mdLinesArr[1]))
                            {
                                noteItemsList.Add(noteItem);
                                linksList.Add(mdLinesArr[1]);
                            }
                        }
                    }

                    if (noteItemsList.Any())
                    {
                        var mdFilesArr = Directory.GetFiles(hcyTuple.ShortDirPath, "*.md");

                        if (mdFilesArr.Length != 1)
                        {
                            throw new Exception($"Found {mdFilesArr.Length} in dir path {hcyTuple.ShortDirPath}");
                        }

                        string mdFile = mdFilesArr.Single();
                        var mdLines = File.ReadLines(mdFile).ToList();
                        var kvp = mdLines.FirstKvp(line => line.StartsWith("# "));
                        int idx = kvp.Key + 1;

                        if (idx == mdLines.Count)
                        {
                            mdLines.Add(string.Empty);
                        }

                        if (!string.IsNullOrWhiteSpace(mdLines[idx]))
                        {
                            mdLines.Insert(idx, string.Empty);
                        }

                        idx++;

                        if (idx == mdLines.Count)
                        {
                            mdLines.Add(string.Empty);
                        }
                        else if (!string.IsNullOrWhiteSpace(mdLines[idx]))
                        {
                            mdLines.Insert(idx, string.Empty);
                        }

                        foreach (var link in linksList)
                        {
                            mdLines.Insert(idx, link);
                            mdLines.Insert(idx + 1, string.Empty);
                        }

                        File.WriteAllLines(mdFile, mdLines);

                        await rfDirsPairNames.RunAsync(new RfDirsPairNames.ProgramComponent.WorkArgs()
                        {
                            Args = new RfDirsPairNames.ProgramArgs
                            {
                                ShortNameDirPath = hcyTuple.ShortDirPath,
                                MdFileName = Path.GetFileName(mdFile)
                            }
                        });

                        foreach (var noteItem in noteItemsList)
                        {
                            for (int i = 0; i < 10; i++)
                            {
                                try
                                {
                                    foreach (var path in new string[]
                                    {
                                        Path.Combine(
                                            hcyTuple.ShortDirPath,
                                            noteItem.ShortDirName),
                                        Path.Combine(
                                            hcyTuple.ShortDirPath,
                                            noteItem.FullDirName),
                                    })
                                    {
                                        if (Directory.Exists(path))
                                        {
                                            Directory.Delete(
                                                path, true);
                                        }
                                    }

                                    break;
                                }
                                catch (Exception ex)
                                {
                                    Console.ForegroundColor = ConsoleColor.Red;
                                    Console.WriteLine($"EXCEPTION TRY {i}: {ex.Message}");
                                    Console.ResetColor();

                                    if (i == 9)
                                    {
                                        throw;
                                    }

                                    Thread.Sleep(1000);
                                }
                            }
                        }

                        await updFsDirPairsIdxes.RunAsync(
                            new UpdFsDirPairsIdxes.ProgramArgs
                            {
                                WorkDir = hcyTuple.ShortDirPath,
                                LocalDevicePathsMap = localDevicePathMacrosMapMtbl,
                                UpdateNotes = true,
                                IdxesUpdateMappings = [new() {
                                    SrcIdxes = new IdxesFilter().Lst(),
                                    TrgIdxes = new IdxesFilter().Lst(),
                                }],
                            });
                    }
                }
            }

            foreach (var hcyTuple in allNoteHcyTuplesMap)
            {
                await RunAsync(pgArgs, hcyTuple.ShortDirPath);
            }
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
