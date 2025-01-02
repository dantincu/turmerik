using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.DirsPair;
using Turmerik.Md;
using Turmerik.Notes.Core;

namespace Turmerik.RemoveObsoleteSectionPdfFiles.ConsoleApp
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

            var mySectionTuples = existingPairs.DirsPairTuples.Where(
                tuple => tuple.NoteDirCat == NoteDirCategory.Section && tuple.NoteSectionRank == "1").ToList();

            foreach (var tuple in mySectionTuples)
            {
                string shortDirPath = Path.Combine(
                    prIdnf, tuple.ShortDirName);

                var pdfFiles = Directory.GetFiles(shortDirPath, "*.pdf");
                var htmlFiles = Directory.GetFiles(shortDirPath, "*.html");

                if (pdfFiles.Length != 1)
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Found {pdfFiles.Length} pdf files for short dir path {shortDirPath}");
                    Console.ResetColor();
                    Console.WriteLine();
                    Console.ReadLine();
                }
                else if (htmlFiles.Any())
                {
                    Console.ForegroundColor = ConsoleColor.Red;
                    Console.WriteLine($"Found {htmlFiles.Length} html files for short dir path {shortDirPath}");
                    Console.ResetColor();
                    Console.WriteLine();
                    Console.ReadLine();
                }
                else
                {
                    File.Delete(pdfFiles.Single());
                }
            }

            foreach (var tuple in existingPairs.DirsPairTuples)
            {
                if (tuple.NoteDirCat != NoteDirCategory.Internals)
                {
                    string shortDirPath = Path.Combine(
                        prIdnf, tuple.ShortDirName);

                    await RunAsync(pgArgs, shortDirPath);
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
