using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.DirsPair;
using Turmerik.Md;
using Turmerik.Notes.Core;
using RfDirsPairNames = Turmerik.Puppeteer.ConsoleApps.RfDirsPairNames;

namespace Turmerik.FsDirPairsNormalizeMacros.ConsoleApp
{
    public class ProgramComponent
    {
        private const string W = "w";
        private const string REC = "rec";
        private const string STEP = "step";

        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly INoteMdParser nmdParser;
        private readonly IExistingDirPairsRetriever existingDirPairsRetriever;
        private readonly RfDirsPairNames.IProgramComponent rfDirPairNamesComponent;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser parser,
            IConsoleMsgPrinter consoleMsgPrinter,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ITextMacrosReplacer textMacrosReplacer,
            INoteMdParser nmdParser,
            IExistingDirPairsRetrieverFactory existingDirPairsRetrieverFactory,
            RfDirsPairNames.IProgramComponent rfDirPairNamesComponent)
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

            config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME)));

            notesConfig = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    TrmrkNotesH.NOTES_CFG_FILE_NAME)));

            existingDirPairsRetriever = existingDirPairsRetrieverFactory.Retriever(
                notesConfig.GetNoteDirPairs());

            this.rfDirPairNamesComponent = rfDirPairNamesComponent ?? throw new ArgumentNullException(
                nameof(rfDirPairNamesComponent));
        }

        public async Task RunAsync(
            string[] rawArgs)
        {
            var pgArgs = ParseArgs(rawArgs);

            var existingPairs = await existingDirPairsRetriever.GetNoteDirPairsAsync(
                pgArgs.WorkDir);

            ReadOnlyDictionary<string, string> macroDirsMap = config.Macros.Map.ToDictionary(
                kvp => kvp.Value[1].ToLowerInvariant().Trim('\"'),
                kvp => kvp.Value[1].ToLowerInvariant().Trim('\"').With(
                    fullDirNamePart =>
                    {
                        if (pgArgs.Step == 1)
                        {
                            string[] fullDirNamePartsArr = fullDirNamePart.Split(
                                ' ', StringSplitOptions.RemoveEmptyEntries).Select(
                                fullDirNamePart => fullDirNamePart.Replace(
                                    "&", "and").Replace(",", "")).ToArray();

                            fullDirNamePart = string.Join("-", fullDirNamePartsArr);
                            fullDirNamePart = $"${fullDirNamePart}$";
                        }

                        return fullDirNamePart;
                    })).RdnlD();

            foreach (var dirsPairTuple in existingPairs.DirsPairTuples)
            {
                string fullDirNamePart = dirsPairTuple.FullDirNamePart.ToLowerInvariant();

                var matchingKvp = macroDirsMap.SingleOrDefault(
                    kvp => kvp.Key == fullDirNamePart);

                if (dirsPairTuple.NoteDirCat != NoteDirCategory.Internals)
                {
                    await RunAsync(pgArgs, pgArgs.WorkDir, dirsPairTuple, matchingKvp, macroDirsMap);
                }
            }
        }

        public async Task RunAsync(
            ProgramArgs pgArgs,
            string prIdnf,
            DirsPairTuple dirsPairTuple,
            KeyValuePair<string, string> matchingKvp,
            ReadOnlyDictionary<string, string> macroDirsMap)
        {
            string newPrPath = Path.Combine(
                prIdnf, dirsPairTuple.ShortDirName);

            bool isSection = dirsPairTuple.NoteDirCat == NoteDirCategory.Section;

            if (matchingKvp.Key != null)
            {
                var rfDirPairNamesArgs = new RfDirsPairNames.ProgramComponent.WorkArgs
                {
                    Args = new RfDirsPairNames.ProgramArgs
                    {
                        ShortNameDirPath = newPrPath,
                        MdTitle = matchingKvp.Value,
                    }
                };

                rfDirPairNamesComponent.NormalizeArgs(
                    rfDirPairNamesArgs.Args);

                switch (matchingKvp.Value)
                {
                    case "$misc$":
                        break;
                    case "$articles$":
                        break;
                    case "$persons$":
                        break;
                    case "$public-persons$":
                        break;
                    case "$historical-figures$":
                        break;
                    case "$terms-and-concepts$":
                        break;
                    case "$products-and-services$":
                        break;
                    case "$environment-geography-nature-and-agriculture$":
                        break;
                    case "$places$":
                        break;
                    case "$geographical-regions$":
                        break;
                    case "$places-and-geographical-regions$":
                        break;
                    default:
                        break;
                }

                await rfDirPairNamesComponent.RunAsync(rfDirPairNamesArgs);
            }

            var existingPairs = await existingDirPairsRetriever.GetNoteDirPairsAsync(newPrPath);

            foreach (var childDirsPairTuple in existingPairs.DirsPairTuples)
            {
                string childFullDirNamePart = childDirsPairTuple.FullDirNamePart.ToLowerInvariant();

                var childMatchingKvp = macroDirsMap.SingleOrDefault(
                    kvp => kvp.Key == childFullDirNamePart);

                if (childDirsPairTuple.NoteDirCat != NoteDirCategory.Internals)
                {
                    await RunAsync(pgArgs, newPrPath, childDirsPairTuple, childMatchingKvp, macroDirsMap);
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
                                parser.ArgsFlagOpts(data,
                                    [STEP], data => data.Args.Step = int.Parse(data.ArgFlagValue!.Single())),
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

            pgArgs.Step ??= 1;
            return pgArgs;
        }
    }
}
