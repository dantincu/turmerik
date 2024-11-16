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
using Turmerik.Core.Helpers;

namespace Turmerik.AddSectionRanks.ConsoleApp
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
        private readonly UpdFsDirPairsIdxes.IProgramComponent updFsDirPairsIdxes;

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
            UpdFsDirPairsIdxes.IProgramComponent updFsDirPairsIdxes)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.parser = parser ?? throw new ArgumentNullException(
                nameof(parser));

            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

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
        }

        public async Task RunAsync(
            string[] rawArgs)
        {
            var pgArgs = ParseArgs(rawArgs);

            var existingPairs = await existingDirPairsRetriever.GetNoteDirPairsAsync(
                pgArgs.WorkDir);

            await RunAsync(pgArgs, pgArgs.WorkDir, existingPairs);
        }

        public async Task RunAsync(
            ProgramArgs pgArgs,
            string prIdnf,
            NoteItemsTupleCore existingPairs)
        {
            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine($"PR_IDNF: {prIdnf}");
            Console.WriteLine();

            var allSectionTuples = existingPairs.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat == NoteDirCategory.Section).ToList();

            var convertedSectionTuples = allSectionTuples.Where(
                tuple => tuple.NoteSectionRank == "2").ToList();

            var mySectionTuples = allSectionTuples.Where(
                tuple => tuple.NoteSectionRank == null).ToList();

            int mainSectionDirIdx = mySectionTuples.Any() ? mySectionTuples.Min(
                tuple => tuple.NoteDirIdx) - 1 : 199;

            var infoTuple = mySectionTuples.SingleOrDefault(
                tuple => tuple.FullDirNamePart == "$info$");

            if (infoTuple != null)
            {
                mySectionTuples.Remove(infoTuple);
            }

            var sectionTuples = mySectionTuples.Where(
                tuple => "$#".None(chr => tuple.FullDirNamePart?.StartsWith(chr) ?? false)).ToList();

            foreach (var tuple in sectionTuples)
            {
                mySectionTuples.Remove(tuple);
            }

            int sectionDirIdx = convertedSectionTuples.Any() ? convertedSectionTuples.Min(
                tuple => tuple.NoteDirIdx) - 1 : 299;

            var localDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile();

            if (sectionTuples.Any())
            {
                await updFsDirPairsIdxes.RunAsync(new UpdFsDirPairsIdxes.ProgramArgs
                {
                    WorkDir = prIdnf,
                    // InteractiveMode = true,
                    LocalDevicePathsMap = localDevicePathsMap,
                    UpdateSections = true,
                    SrcFromSections = true,
                    TrgFromSections = true,
                    TrgSectionRank = "2",
                    IdxesUpdateMappings = [new() {
                        SrcIdxes = sectionTuples.Select(tuple => new IdxesFilter
                            {
                                SingleIdx = tuple.NoteDirIdx
                            }).ToList(),
                        TrgIdxes = sectionTuples.Select(tuple => new IdxesFilter
                            {
                                SingleIdx = sectionDirIdx--
                            }).ToList(),
                    }],
                });
            }

            if (infoTuple != null)
            {
                var infoDirIdnf = Path.Combine(
                    prIdnf,
                    infoTuple.ShortDirName);

                var infoPairs = await existingDirPairsRetriever.GetNoteDirPairsAsync(infoDirIdnf);

                var mainSectionTuples = infoPairs.DirsPairTuples.Where(
                    tuple => tuple.NoteDirCat == NoteDirCategory.Section).ToList();

                if (mainSectionTuples.Any())
                {
                    mainSectionDirIdx = Math.Min(
                        mainSectionDirIdx, mainSectionTuples.Min(
                            tuple => tuple.NoteDirIdx) - 1);

                    await updFsDirPairsIdxes.RunAsync(new UpdFsDirPairsIdxes.ProgramArgs
                    {
                        WorkDir = infoDirIdnf,
                        // InteractiveMode = true,
                        LocalDevicePathsMap = localDevicePathsMap,
                        UpdateSections = true,
                        SrcFromSections = true,
                        TrgFromSections = true,
                        IdxesUpdateMappings = [new() {
                            SrcIdxes = mainSectionTuples.Select(tuple => new IdxesFilter
                            {
                                SingleIdx = tuple.NoteDirIdx
                            }).ToList(),
                            TrgIdxes = mainSectionTuples.Select(tuple => new IdxesFilter
                            {
                                SingleIdx = mainSectionDirIdx--
                            }).ToList()
                        }]
                    });
                }

                var dirEntries = Directory.GetDirectories(infoDirIdnf);

                foreach (var dirEntry in dirEntries)
                {
                    var dirName = Path.GetFileName(dirEntry);

                    var newDirPath = Path.Combine(
                        prIdnf, dirName);

                    if (Directory.Exists(newDirPath))
                    {
                        throw new InvalidOperationException(
                            $"Directory should not exist: {newDirPath}");
                    }

                    Directory.Move(dirEntry, newDirPath);
                }

                foreach (var file in Directory.GetFiles(infoDirIdnf))
                {
                    File.Delete(file);
                }

                Directory.Delete(infoDirIdnf);

                var infoDirFullDirPath = Path.Combine(
                    prIdnf,
                    infoTuple.FullDirName);

                Directory.Delete(infoDirFullDirPath, true);
            }

            await updFsDirPairsIdxes.RunAsync(new UpdFsDirPairsIdxes.ProgramArgs
            {
                WorkDir = prIdnf,
                // InteractiveMode = true,
                LocalDevicePathsMap = localDevicePathsMap,
                UpdateSections = true,
                SrcFromSections = true,
                TrgFromSections = true,
                IdxesUpdateMappings = [new() {
                    SrcIdxes = new IdxesFilter().Lst(),
                    TrgIdxes = new IdxesFilter().Lst(),
                }],
            });

            existingPairs = await existingDirPairsRetriever.GetNoteDirPairsAsync(prIdnf);

            foreach (var childDirsPairTuple in existingPairs.DirsPairTuples)
            {
                if (childDirsPairTuple.NoteDirCat != NoteDirCategory.Internals)
                {
                    var childIdnf = Path.Combine(prIdnf, childDirsPairTuple.ShortDirName);

                    var childExistingEntries = await existingDirPairsRetriever.GetNoteDirPairsAsync(
                        childIdnf);

                    await RunAsync(pgArgs, childIdnf, childExistingEntries);
                }
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
    }
}
