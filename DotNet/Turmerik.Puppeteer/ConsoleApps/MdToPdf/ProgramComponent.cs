using Markdig;
using PuppeteerSharp;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Md;
using Turmerik.Puppeteer.Helpers;

namespace Turmerik.Puppeteer.ConsoleApps.MdToPdf
{
    public interface IProgramComponent
    {
        void NormalizeArgs(ProgramArgs pgArgs);
        Task RunAsync(string[] rawArgs);
        Task RunAsync(ProgramArgs pgArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
        private const string W = "w";
        private const string REC = "rec";
        private const string RE = "re";
        private const string H = "h";

        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly DirsPairConfig config;

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

            config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME)));
        }

        public void NormalizeArgs(ProgramArgs pgArgs)
        {
            pgArgs.WorkDir ??= string.Empty;
            pgArgs.LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile();

            pgArgs.WorkDir = textMacrosReplacer.NormalizePath(
                pgArgs.LocalDevicePathsMap,
                pgArgs.WorkDir, Environment.CurrentDirectory);

            if (!string.IsNullOrEmpty(pgArgs.RecursiveMatchingDirName))
            {
                pgArgs.RecursiveMatchingDirNameRegex = new Regex(
                    pgArgs.RecursiveMatchingDirName);
            }
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var pgArgs = GetArgs(rawArgs);

            if (pgArgs.PrintHelpMessage == true)
            {
                PrintHelpMessage(pgArgs);
            }
            else
            {
                await RunAsync(pgArgs);
            }
        }

        public async Task RunAsync(ProgramArgs pgArgs)
        {
            NormalizeArgs(pgArgs);

            await PuppeteerH.WithNewPageAsync(
                (page, browser) => RunCoreAsync(
                    pgArgs,
                    page,
                    browser,
                    MarkdigH.GetMarkdownPipeline()));
        }

        private ProgramArgs GetArgs(
            string[] rawArgs) => parser.Parse(
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
                                        [H], data => data.Args.PrintHelpMessage = true, true),
                                    parser.ArgsFlagOpts(data,
                                        [REC], data => data.Args.RecursiveMatchingDirName = data.ArgFlagValue!.JoinNotNullStr(":")),
                                    parser.ArgsFlagOpts(data,
                                        [RE], data => data.Args.RemoveExisting = true, true)
                            ]
                        })
                }).Args;

        private async Task RunCoreAsync(
            ProgramArgs pgArgs,
            IPage page,
            IBrowser browser,
            MarkdownPipeline markdownPipeline)
        {
            var filesArr = Directory.GetFiles(
                pgArgs.WorkDir);

            var filesMap = PathH.MapFileNameExtensions(filesArr);

            if (pgArgs.RemoveExisting)
            {
                foreach (var extn in ".pdf".Arr(".html"))
                {
                    if (filesMap.TryGetValue(extn, out var filesGroup))
                    {
                        foreach (var file in filesGroup)
                        {
                            File.Delete(file);
                        }
                    }
                }
            }

            if (filesMap.TryGetValue(".md", out var mdFilesGroup))
            {
                foreach (var file in mdFilesGroup)
                {
                    string htmlFilePath = $"{file}.html";
                    string pdfFilePath = $"{file}.pdf";

                    bool @continue = pgArgs.RemoveExisting;

                    if (!@continue)
                    {
                        @continue = !File.Exists(pdfFilePath);

                        if (!@continue)
                        {
                            var mdFile = new FileInfo(file);
                            var pdfFile = new FileInfo(pdfFilePath);

                            @continue = mdFile.LastWriteTimeUtc > pdfFile.CreationTimeUtc;
                        }
                    }

                    if (@continue)
                    {
                        Console.ForegroundColor = ConsoleColor.Cyan;
                        Console.WriteLine(file);
                        Console.ResetColor();

                        string mdStr = File.ReadAllText(file);
                        string htmlStr = Markdown.ToHtml(mdStr, markdownPipeline);

                        File.WriteAllText(htmlFilePath, htmlStr);

                        await PuppeteerH.HtmlToPdfFile(
                            htmlFilePath,
                            pdfFilePath);
                    }
                    else
                    {
                        Console.WriteLine(file);
                    }
                }
            }

            if (pgArgs.RecursiveMatchingDirNameRegex != null)
            {
                var subFoldersArr = Directory.GetDirectories(
                    pgArgs.WorkDir);

                var subFolderPgArgsArr = subFoldersArr.Where(
                    folder => pgArgs.RecursiveMatchingDirNameRegex.IsMatch(
                        folder)).Select(
                    folder => new ProgramArgs(pgArgs)
                    {
                        WorkDir = folder
                    }).ToArray();

                foreach (var subFolderPgArgs in subFolderPgArgsArr)
                {
                    await RunCoreAsync(subFolderPgArgs, page, browser, markdownPipeline);
                }
            }
        }

        private void PrintHelpMessage(
            ProgramArgs args)
        {
            var x = consoleMsgPrinter.GetDefaultExpressionValues();

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
                $"{{{x.Blue}}}Welcome to the Turmerik MdToPdf tool{{{x.NewLine}}}",

                string.Join(" ", $"{m.ThisTool.U} converts existing markdown files",
                    $"to pdf (and html) files.{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of argument options {m.ThisTool.L} supports:{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{W}", ""),
                    $"Changes to work directory where the files are to be converted",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{REC}", ""),
                    $"Does the same job for sub folders and sub folders of sub folders fully recursive",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{RE}", ""),
                    $"Removes existing html and pdf files first",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{H}", ""),
                    $"Prints this help message to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                $"{{{x.Blue}}}You can find the source code for this tool at the following url:",
                string.Concat(
                    $"{{{x.DarkGreen}}}",
                    "https://github.com/dantincu/turmerik/tree/main/DotNet/Turmerik.MdToPdf.ConsoleApp",
                    $"{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}")];

            consoleMsgPrinter.Print(linesArr, null, x);
        }
    }
}
