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
using Markdig;
using PuppeteerSharp;

namespace Turmerik.PrintDupplicateTextLines.ConsoleApp
{
    public class ProgramComponent
    {
        private const string W = "w";
        private const string REC = "rec";
        private const string P = "p";
        private const string S = "s";
        private const string F = "f";

        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;

        private bool isSkipping;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser parser,
            IConsoleMsgPrinter consoleMsgPrinter,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ITextMacrosReplacer textMacrosReplacer)
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
        }

        public async Task RunAsync(
            string[] rawArgs)
        {
            this.isSkipping = false;
            var pgArgs = ParseArgs(rawArgs);

            if (pgArgs.SkipUntilPath != null)
            {
                this.isSkipping = true;
            }

            await RunAsync(pgArgs);
        }

        public async Task RunAsync(
            ProgramArgs pgArgs)
        {
            Console.ResetColor();
            Console.WriteLine();
            Console.WriteLine($"PR_IDNF: {pgArgs.WorkDir}");

            if (isSkipping)
            {
                if (pgArgs.SkipUntilPath == pgArgs.WorkDir)
                {
                    isSkipping = false;
                }
                else
                {
                    Console.WriteLine("SKIPPING");
                }
            }

            Console.WriteLine();

            if (!isSkipping)
            {
                var textFilesArr = Directory.GetFiles(
                    pgArgs.WorkDir,
                    pgArgs.TextFileNamePattern);

                if (textFilesArr.Any())
                {
                    if (textFilesArr.Length > 1)
                    {
                        throw new Exception($"Found {textFilesArr.Length} files matching the pattern in dir path {pgArgs.WorkDir}");
                    }

                    var textFile = textFilesArr.Single();

                    var textLines = File.ReadAllLines(textFile).Select(
                        (line, idx) => new TextLine
                        {
                            Text = line,
                            TrimmedText = line.Trim(),
                            IsAllWhitespace = string.IsNullOrWhiteSpace(line),
                            Idx = idx
                        }.ActWith(line =>
                        {
                            if (pgArgs.FilterLinesRegex != null && !line.IsAllWhitespace)
                            {
                                line.MatchesFilter = pgArgs.FilterLinesRegex.IsMatch(
                                    line.Text);
                            }
                        })).ToList();

                    bool hasDupps = false;

                    for (int i = 1; i < textLines.Count; i++)
                    {
                        var currenLine = textLines[i];

                        if (!currenLine.IsAllWhitespace && currenLine.MatchesFilter != false)
                        {
                            var kvp = textLines.Take(i).FirstKvp(
                                line => !line.IsAllWhitespace && line.TrimmedText == currenLine.TrimmedText);

                            if (kvp.Key >= 0)
                            {
                                currenLine.DuppIdx = kvp.Value.Idx;
                                kvp.Value.HasDupps = true;
                                hasDupps = true;
                            }
                        }
                    }

                    if (hasDupps)
                    {
                        Console.WriteLine($"Found dupplicate text lines in file {textFile}");
                        Console.WriteLine();

                        for (int i = 0; i < textLines.Count; ++i)
                        {
                            var line = textLines[i];
                            Console.Write($"{i}: ");
                        
                            if (line.DuppIdx.HasValue)
                            {
                                Console.ForegroundColor = ConsoleColor.Magenta;
                            }
                            else if (line.HasDupps)
                            {
                                Console.ForegroundColor = ConsoleColor.Yellow;
                            }
                            else
                            {
                                Console.ForegroundColor = ConsoleColor.Cyan;
                            }

                            Console.Write(line.Text);
                            Console.ResetColor();
                            Console.WriteLine();
                        }

                        ProcessH.OpenWithDefaultProgramIfNotNull(textFile);
                        Console.WriteLine("Do you want to fix the text file? type y for yes and anything else for no");
                        bool answerIsYes = Console.ReadLine().ToLower() == "y";

                        if (answerIsYes)
                        {
                            var newTextLines = textLines.Where(
                                line => !line.DuppIdx.HasValue).Select(
                                line => line.Text).ToArray();

                            File.WriteAllLines(textFile, newTextLines);
                        }

                        Console.WriteLine("Type anything to move on");
                        Console.ReadLine();
                    }
                }
            }

            if (pgArgs.RecursiveMatchingDirNameRegexsArr != null)
            {
                var subFoldersArr = Directory.GetDirectories(
                    pgArgs.WorkDir).OrderBy(s => s).ToArray();

                var subFolderPgArgsArr = subFoldersArr.Where(
                    folder => pgArgs.RecursiveMatchingDirNameRegexsArr?.Any(
                        regex => regex.IsMatch(folder)) ?? true).Select(
                    folder => new ProgramArgs
                    {
                        WorkDir = folder,
                        LocalDevicePathsMap = pgArgs.LocalDevicePathsMap,
                        RecursiveMatchingDirNameRegexsArr = pgArgs.RecursiveMatchingDirNameRegexsArr,
                        RecursiveMatchingDirNamesArr = pgArgs.RecursiveMatchingDirNamesArr,
                        TextFileNamePattern = pgArgs.TextFileNamePattern,
                        SkipUntilPath = pgArgs.SkipUntilPath,
                        FilterLines = pgArgs.FilterLines,
                        FilterLinesRegex = pgArgs.FilterLinesRegex,
                    }).ToArray();

                foreach (var subFolderPgArgs in subFolderPgArgsArr)
                {
                    await RunAsync(subFolderPgArgs);
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
                                    [P], data => data.Args.TextFileNamePattern = data.ArgFlagValue.Single()),
                                parser.ArgsFlagOpts(data,
                                    [S], data => data.Args.SkipUntilPath = data.ArgFlagValue.Single()),
                                parser.ArgsFlagOpts(data,
                                    [F], data => data.Args.FilterLines = data.ArgFlagValue.Single()),
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

            if (pgArgs.SkipUntilPath != null)
            {
                pgArgs.SkipUntilPath = textMacrosReplacer.NormalizePath(
                    pgArgs.LocalDevicePathsMap,
                    pgArgs.SkipUntilPath, Environment.CurrentDirectory);
            }

            if (pgArgs.FilterLines != null)
            {
                pgArgs.FilterLinesRegex = new Regex(
                    pgArgs.FilterLines);
            }

            return pgArgs;
        }

        private class TextLine
        {
            public string Text { get; set; }
            public string TrimmedText { get; set; }
            public bool IsAllWhitespace { get; set; }
            public bool? MatchesFilter { get; set; }
            public int Idx { get; set; }
            public int? DuppIdx { get; set; }
            public bool HasDupps { get; set; }
        }
    }
}
