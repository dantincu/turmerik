using Markdig;
using Markdig.Helpers;
using PuppeteerSharp;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Text;
using Turmerik.Core.TextParsing;
using Turmerik.Core.TextParsing.Md;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.DirsPair;
using Turmerik.Html;
using Turmerik.Md;
using Turmerik.Notes.Core;
using static Turmerik.Puppeteer.ConsoleApps.RfDirsPairNames.ProgramComponent;

namespace Turmerik.Puppeteer.ConsoleApps.RfDirsPairNames
{
    public interface IProgramComponent
    {
        Task<Tuple<string?, string?>> RunAsync(
            string[] rawArgs);

        Task<string?> RunAsync(
            WorkArgs wka,
            bool normalizeArgs = true);

        Task NormalizeArgs(ProgramArgs args);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly MdToPdf.IProgramComponent mdToPdfProgramComponent;
        private readonly MkFsDirPairs.IProgramComponent mkFsDirPairsProgramComponent;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IHtmlDocTitleRetriever htmlDocTitleRetriever;
        private readonly DirsPairConfig config;
        private readonly IDirsPairConfigLoader dirsPairConfigLoader;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly INotesAppConfigLoader notesAppConfigLoader;
        private readonly NoteDirsPairConfigMtbl noteDirsPairCfg;
        private readonly NoteDirsPairConfigMtbl.FileNamesT noteFileNamesCfg;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleMsgPrinter consoleMsgPrinter,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IConsoleArgsParser consoleArgsParser,
            MdToPdf.IProgramComponent mdToPdfProgramComponent,
            MkFsDirPairs.IProgramComponent mkFsDirPairsProgramComponent,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever,
            ITextMacrosReplacer textMacrosReplacer,
            IHtmlDocTitleRetriever htmlDocTitleRetriever,
            IDirsPairConfigLoader dirsPairConfigLoader,
            INotesAppConfigLoader notesAppConfigLoader)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.mdToPdfProgramComponent = mdToPdfProgramComponent ?? throw new ArgumentNullException(
                nameof(mdToPdfProgramComponent));

            this.mkFsDirPairsProgramComponent = mkFsDirPairsProgramComponent ?? throw new ArgumentNullException(
                nameof(mkFsDirPairsProgramComponent));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.htmlDocTitleRetriever = htmlDocTitleRetriever ?? throw new ArgumentNullException(
                nameof(htmlDocTitleRetriever));

            this.dirsPairConfigLoader = dirsPairConfigLoader ?? throw new ArgumentNullException(
                nameof(dirsPairConfigLoader));

            this.notesAppConfigLoader = notesAppConfigLoader ?? throw new ArgumentNullException(
                nameof(notesAppConfigLoader));

            config = dirsPairConfigLoader.LoadConfig();
            notesConfig = notesAppConfigLoader.LoadConfig();

            noteDirsPairCfg = notesConfig.NoteDirPairs;
            noteFileNamesCfg = noteDirsPairCfg.FileNames;
        }

        public async Task<Tuple<string?, string?>> RunAsync(
            string[] rawArgs)
        {
            var args = await GetWorkArgsAsync(rawArgs);
            string? title = args.MdTitle;
            string? newFullDirNamePart;

            if (args.PrintHelpMessage != true)
            {
                var wka = new WorkArgs
                {
                    Args = args
                };

                newFullDirNamePart = await RunAsync(
                    wka, false);
            }
            else
            {
                title = null;
                newFullDirNamePart = null;
            }

            return Tuple.Create(title, newFullDirNamePart);
        }

        public async Task<string?> RunAsync(
            WorkArgs wka,
            bool normalizeArgs = true)
        {
            (var stopSkipping, var newFullDirNamePart) = await RunCoreAsync(wka, normalizeArgs);
            return newFullDirNamePart;
        }

        public async Task NormalizeArgs(ProgramArgs args)
        {
            bool autoChoose = args.InteractiveMode != true;
            args.LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile();

            args.ShortNameDirPath = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                args.ShortNameDirPath,
                null);

            args.SkipUntilPath = args.SkipUntilPath?.With(
                path => textMacrosReplacer.NormalizePath(
                    args.LocalDevicePathsMap, path, args.ShortNameDirPath));

            args.RecursiveMatchingDirNameRegexsArr = args.RecursiveMatchingDirNamesArr?.Select(
                dirName => new Regex(dirName)).ToArray();

            if (args.SkipShortNameDirPath != true && (args.SkipUntilPath == null || args.SkipUntilPath == args.ShortNameDirPath))
            {
                if (args.MdTitle != null)
                {
                    args.UpdateMdFile = true;

                    args.MdTitle = TextMacrosH.ReplaceMacros(
                        args.MdTitle,
                        config.DirNames.MacrosMap);
                }

                if (Directory.Exists(args.ShortNameDirPath))
                {
                    string mdTitle = null;

                    args.MdFileName ??= GetMdFile(
                        args.ShortNameDirPath,
                        out mdTitle,
                        autoChoose);

                    args.MdTitle ??= mdTitle;

                    if (args.MdFileName != null)
                    {
                        args.MdFilePath = Path.Combine(
                            args.ShortNameDirPath,
                            args.MdFileName);

                        if (args.OpenMdFileAndDeferUpdate == true)
                        {
                            Console.ForegroundColor = ConsoleColor.Green;
                            Console.WriteLine($"Opening md file {args.MdFilePath}; press any key to go on with the update");
                            Console.ResetColor();

                            ProcessH.OpenWithDefaultProgramIfNotNull(
                                args.MdFilePath);

                            Console.ReadKey();

                            args.MdTitle = mdTitle = MdH.TryGetMdTitleFromFile(
                                args.MdFilePath);

                            UpdateTimeStamp(args.ShortNameDirPath);
                        }
                        else if (args.OpenMdFileAndAddLinks == true)
                        {
                            Console.ForegroundColor = ConsoleColor.Green;
                            Console.WriteLine(string.Join(" ", $"Opening md file {args.MdFilePath};",
                                "paste a url to add as md link"));
                            Console.ResetColor();

                            ProcessH.OpenWithDefaultProgramIfNotNull(
                                args.MdFilePath);

                            args.MdLinksToAddArr = await mkFsDirPairsProgramComponent.OpenMdFileAndAddLinks();
                            UpdateTimeStamp(args.ShortNameDirPath);
                        }
                    }
                }
                else if (File.Exists(args.ShortNameDirPath))
                {
                    args.MdFilePath = args.ShortNameDirPath;

                    args.MdFileName = Path.GetFileName(
                        args.MdFilePath);

                    args.ShortNameDirPath = Path.GetDirectoryName(
                        args.MdFilePath);
                }

                args.ParentDirPath = Path.GetDirectoryName(
                    args.ShortNameDirPath);

                args.ShortDirName = Path.GetFileName(
                    args.ShortNameDirPath);

                if ((args.FullDirName = GetFullDirName(
                    args, autoChoose,
                    out string fullDirNamePartStr)) != null)
                {
                    args.FullDirPath = Path.Combine(
                        args.ParentDirPath,
                        args.FullDirName);

                    args.FullDirNamePart = fullDirNamePartStr;
                }
            }
        }

        private async Task<Tuple<bool, string>> RunCoreAsync(
            WorkArgs wka,
            bool normalizeArgs)
        {
            var args = wka.Args;

            if (normalizeArgs)
            {
                await NormalizeArgs(args);
            }

            string? newFullDirNamePart = null;

            bool stopSkipping = args.SkipUntilPath == null || (
                args.SkipUntilPath == args.ShortNameDirPath);

            if (args.SkipShortNameDirPath != true && stopSkipping)
            {
                if (wka.Args.UpdateTimeStamp == true)
                {
                    UpdateTimeStamp(wka.Args.ShortNameDirPath);
                }

                newFullDirNamePart = fsEntryNameNormalizer.NormalizeFsEntryName(
                    wka.Args.MdTitle,
                    config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH);

                string newMdFileName = GetMdFileName(newFullDirNamePart);

                string newFullDirName = GetFullDirNamePart(
                    args, newFullDirNamePart);

                if (newMdFileName != args.MdFileName)
                {
                    TryRenameMdFile(wka, newMdFileName);
                }

                if (args.UpdateMdFile == true)
                {
                    if (!string.IsNullOrWhiteSpace(wka.Args.MdTitle))
                    {
                        string newMdFilePath = Path.Combine(
                            args.ShortNameDirPath,
                            newMdFileName);

                        MdH.UpdateMdTitleFromFile(
                            newMdFilePath,
                            (title, line, idx, linesArr) => wka.Args.MdTitle);
                    }
                    else
                    {
                        throw new Exception("Trying to update the md file but no title found");
                    }
                }

                TryRenameFullNameDir(wka, newFullDirName);

                if (args.MdLinksToAddArr != null)
                {
                    string newMdFilePath = Path.Combine(
                        args.ShortNameDirPath,
                        newMdFileName);

                    var mdLinesList = File.ReadAllLines(
                        newMdFilePath).ToList();

                    var kvp = args.OpenMdFileAndInsertLinks switch
                    {
                        true => mdLinesList.FirstKvp(line => line.Trim().StartsWith("# ")),
                        false => new KeyValuePair<int, string>(-1, string.Empty)
                    };

                    if (mdLinesList.Any())
                    {
                        if (!string.IsNullOrWhiteSpace(mdLinesList.Last()))
                        {
                            mdLinesList.Add(string.Empty);
                        }
                    }
                    else
                    {
                        kvp = new(-2, string.Empty);
                    }

                    if (kvp.Key < 0)
                    {
                        foreach (var mdLink in args.MdLinksToAddArr)
                        {
                            string mdLinkStr = $"[{mdLink.Title}]({mdLink.Url})";
                            mdLinesList.Add(mdLinkStr);
                            mdLinesList.Add(string.Empty);
                        }
                    }
                    else
                    {
                        foreach (var mdLink in args.MdLinksToAddArr)
                        {
                            string mdLinkStr = $"[{mdLink.Title}]({mdLink.Url})";
                            mdLinesList.Insert(kvp.Key + 2, mdLinkStr);
                            mdLinesList.Insert(kvp.Key + 3, string.Empty);
                        }
                    }

                    File.WriteAllLines(
                        newMdFilePath,
                        mdLinesList);
                }

                if ((config.CreatePdfFile ?? false) && args.SkipPdfFileCreation != true)
                {
                    await mdToPdfProgramComponent.RunAsync(
                        new MdToPdf.ProgramArgs
                        {
                            WorkDir = wka.Args.ShortNameDirPath,
                            RemoveExisting = true
                        });
                }
            }

            if (args.RecursiveMatchingDirNameRegexsArr != null)
            {
                var subFoldersArr = Directory.GetDirectories(
                    args.ShortNameDirPath);

                var subFolderPgArgsArr = subFoldersArr.Where(
                    folder => args.RecursiveMatchingDirNameRegexsArr?.Any(
                        regex => regex.IsMatch(folder)) ?? true).Select(
                    folder => new ProgramArgs
                    {
                        LocalDevicePathsMap = args.LocalDevicePathsMap,
                        ShortNameDirPath = folder,
                        SkipPdfFileCreation = args.SkipPdfFileCreation,
                        SkipUntilPath = args.SkipUntilPath,
                        RecursiveMatchingDirNameRegexsArr = args.RecursiveMatchingDirNameRegexsArr,
                        RecursiveMatchingDirNamesArr = args.RecursiveMatchingDirNamesArr
                    }).ToArray();

                foreach (var subFolderPgArgs in subFolderPgArgsArr)
                {
                    if (stopSkipping)
                    {
                        subFolderPgArgs.SkipUntilPath = null;
                    }

                    (stopSkipping, _) = await RunCoreAsync(new WorkArgs
                    {
                        Args = subFolderPgArgs
                    }, true);
                }
            }

            return Tuple.Create(stopSkipping, newFullDirNamePart);
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
                $"{{{x.Blue}}}Welcome to the Turmerik RfDirsPairNames tool{{{x.NewLine}}}",

                string.Join(" ", $"{m.ThisTool.U} helps you update the markdown file name and",
                $"the full folder name for the working directory.{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of argument options {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.InteractiveMode}", ""),
                    $"Enables the interactive mode where, before making any changes to any files or folders",
                    $"A list of markdown files (if more than 1 is found in the working directory)",
                    $"is printed to the console and the user is asked to choose which markdown file",
                    $"should be used for extracting the title that will be used to generate the new names",
                    $"for the markdown file and full folder name. And if it's only one markdown file",
                    $"the user still has the option to cancel the execution in the interactive mode",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.PrintHelpMessage}", ""),
                    $"Prints this help message to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.SkipCurrentNode}", ""),
                    $"Skips the current dir path",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of arguments {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"{{{x.DarkBlue}}}1. {{{x.Splitter}}}The {{{x.Blue}}}short name dir path{{{x.Splitter}}}",
                    $"Specifies the path of the short name folder whose corresponding full name folder and",
                    $"markdown file are to be renamed. If ommited, the current directory will be used instead.",
                    $"If provided a relative path, the current directory will be used as base path for",
                    $"getting the short name folder path.{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"{{{x.DarkBlue}}}2. {{{x.Splitter}}}The {{{x.Blue}}}markdown file name{{{x.Splitter}}}",
                    $"that will be used to extract the note item title from{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"{{{x.DarkBlue}}}3. {{{x.Splitter}}}The {{{x.Blue}}}note item title{{{x.Splitter}}}",
                    $"that will be used for generating the new markdown file name and the new full dir name part",
                    $"instead of extracting it from the markdown file{{{x.NewLine}}}{{{x.NewLine}}}"),

                $"{{{x.Blue}}}You can find the source code for this tool at the following url:",
                string.Concat(
                    $"{{{x.DarkGreen}}}",
                    "https://github.com/dantincu/turmerik/tree/main/DotNet/Turmerik.RfDirsPairNames.ConsoleApp",
                    $"{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}")];

            consoleMsgPrinter.Print(linesArr, null, x);
        }

        private string TryRenameMdFile(
            WorkArgs wka,
            string newMdFileName)
        {
            var args = wka.Args;

            string newMdFilePath = Path.Combine(
                args.ShortNameDirPath,
                newMdFileName);

            if (!File.Exists(newMdFilePath))
            {
                if (args.MdFilePath != null)
                {
                    File.Move(
                        args.MdFilePath,
                        newMdFilePath);

                    WriteWithForegroundsToConsole([
                        Tuple.Create(ConsoleColor.Green, "Renamed"),
                        Tuple.Create(ConsoleColor.Blue, $" {args.MdFileName} "),
                        Tuple.Create(ConsoleColor.Green, "to"),
                        Tuple.Create(ConsoleColor.Cyan, $" {newMdFileName} "),
                    ]);
                }
                else
                {
                    if (args.FullDirNamePart != null && Directory.GetFiles(
                        args.ShortNameDirPath, "*.md").None())
                    {
                        var fileNamesCfg = config.FileNames;

                        string mdFileName = (fileNamesCfg.PrependTitleToNoteMdFileName ?? false).If(
                            () => args.FullDirNamePart) + fileNamesCfg.MdFileName;

                        string mdFilePath = Path.Combine(
                            args.ShortNameDirPath,
                            mdFileName);

                        string mdContent = string.Format(
                            config.FileContents.MdFileContentsTemplate,
                            args.FullDirNamePart,
                            Trmrk.TrmrkGuidStrNoDash,
                            config.TrmrkGuidInputName ?? TrmrkNotesH.TRMRK_GUID_INPUT_NAME);

                        File.WriteAllText(
                            mdFilePath,
                            mdContent);

                        WriteWithForegroundsToConsole([
                            Tuple.Create(ConsoleColor.DarkMagenta, "No .md file found at all, so wrote title"),
                            Tuple.Create(ConsoleColor.Magenta, $" {args.FullDirNamePart} "),
                            Tuple.Create(ConsoleColor.DarkMagenta, "to new md file"),
                            Tuple.Create(ConsoleColor.Magenta, $" {mdFileName} "),
                        ]);
                    }
                }
            }
            else
            {
                WriteWithForegroundsToConsole([
                    Tuple.Create(ConsoleColor.DarkRed, "File"),
                    Tuple.Create(ConsoleColor.Red, $" {newMdFileName} "),
                    Tuple.Create(ConsoleColor.DarkRed, "already exists"),
                ]);
            }

            Console.WriteLine();
            return newMdFilePath;
        }

        private void TryRenameFullNameDir(
            WorkArgs wka,
            string newFullDirName)
        {
            var args = wka.Args;

            string newFullDirPath = Path.Combine(
                args.ParentDirPath,
                newFullDirName);

            if (args.FullDirPath != null && Directory.Exists(
                args.FullDirPath))
            {
                if (args.FullDirPath != newFullDirPath)
                {
                    FsH.MoveDirectory(
                        args.FullDirPath,
                        newFullDirPath);
                }
            }
            else
            {
                Directory.CreateDirectory(
                    newFullDirPath);
            }

            WriteWithForegroundsToConsole([
                Tuple.Create(ConsoleColor.Green, "Renamed"),
                        Tuple.Create(ConsoleColor.Blue, $" {args.FullDirName} "),
                        Tuple.Create(ConsoleColor.Green, "to"),
                        Tuple.Create(ConsoleColor.Cyan, $" {newFullDirName} "),
                    ]);

            string keepFilePath = Path.Combine(
                newFullDirPath,
                config.FileNames.KeepFileName);

            string keepFileContents = (
                config.FileContents.KeepFileContainsNoteJson == true) switch
            {
                true => wka.Args.MdTitle.With(mdTitle =>
                {
                    string json = null;

                    if (File.Exists(keepFilePath))
                    {
                        string existingJson = File.ReadAllText(
                            keepFilePath);

                        if (!string.IsNullOrWhiteSpace(existingJson))
                        {
                            try
                            {
                                var decorator = jsonConversion.Decorator<NoteItemCore>(
                                    existingJson);

                                decorator.ShallowMergeWith(new NoteItemCore
                                {
                                    Title = wka.Args.MdTitle
                                });

                                json = decorator.Serialize();
                            }
                            catch (Exception exc)
                            {
                                json = null;
                            }
                        }
                    }

                    json ??= jsonConversion.Adapter.Serialize(new NoteItemCore
                    {
                        Title = wka.Args.MdTitle
                    });

                    return json;
                }),
                _ => string.Format(
                    config.FileContents.KeepFileContentsTemplate,
                    Trmrk.TrmrkGuidStrNoDash,
                    config.TrmrkGuidInputName ?? TrmrkNotesH.TRMRK_GUID_INPUT_NAME)
            };

            File.WriteAllText(
                keepFilePath,
                keepFileContents);

            Console.WriteLine();
        }

        private async Task<ProgramArgs> GetWorkArgsAsync(string[] rawArgs)
        {
            var args = consoleArgsParser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data => consoleArgsParser.HandleArgs(new ConsoleArgsParseHandlerOpts<ProgramArgs>
                    {
                        Data = data,
                        ThrowOnTooManyArgs = true,
                        ThrowOnUnknownFlag = true,
                        ItemHandlersArr = [
                            consoleArgsParser.ArgsItemOpts(data,
                                data => data.Args.ShortNameDirPath = data.ArgItem.Nullify(true)),
                            consoleArgsParser.ArgsItemOpts(data,
                                data => data.Args.MdFileName = data.ArgItem.Nullify(true)),
                            consoleArgsParser.ArgsItemOpts(data,
                                data => data.Args.MdTitle = data.ArgItem.Nullify(true))
                        ],
                        FlagHandlersArr = [
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.PrintHelpMessage.Arr(),
                                data => data.Args.PrintHelpMessage = true, true),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.SkipCurrentNode.Arr(),
                                data => data.Args.SkipShortNameDirPath = true, true),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.SkipUntilPath.Arr(),
                                data => data.Args.SkipUntilPath = data.ArgFlagValue.Single()),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.RecursiveMatchingDirNames.Arr(),
                                data => data.Args.RecursiveMatchingDirNamesArr = data.ArgFlagValue),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.InteractiveMode.Arr(),
                                data => data.Args.InteractiveMode = true),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.OpenMdFileAndDeferUpdate.Arr(),
                                data => data.Args.OpenMdFileAndDeferUpdate = true),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.OpenMdFileAndAddLinks.Arr(),
                                data => data.Args.OpenMdFileAndAddLinks = true),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.OpenMdFileAndInsertLinks.Arr(),
                                data =>
                                {
                                    data.Args.OpenMdFileAndAddLinks = true;
                                    data.Args.OpenMdFileAndInsertLinks = true;
                                }),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.UpdateTimeStamp.Arr(),
                                data => data.Args.UpdateTimeStamp = true),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.Title.Arr(),
                                data => data.Args.MdTitle = string.Join(":", data.ArgFlagValue)),
                            consoleArgsParser.ArgsFlagOpts(data,
                                config.ArgOpts.SkipPdfFileCreation.Arr(),
                                data => data.Args.SkipPdfFileCreation = true, true),
                        ]
                    })
                }).Args;

            if (args.PrintHelpMessage == true)
            {
                PrintHelpMessage(args);
            }
            else
            {
                await NormalizeArgs(args);
            }

            return args;
        }

        private string GetMdFileName(
            string fullDirNamePart) => config.FileNames.With(
                fileNames => fileNames.MdFileNamePfx + (fileNames.PrependTitleToNoteMdFileName ?? false).If(
                    () => fullDirNamePart) + fileNames.MdFileName);

        private string GetFullDirNamePart(
            ProgramArgs args,
            string newFullDirNamePart) => string.Join(
                config.DirNames.DefaultJoinStr,
                args.ShortDirName,
                newFullDirNamePart);

        private Tuple<string, string>[] GetMdFiles(
            string shortDirNamePath)
        {
            var tuplesArr = Directory.GetFiles(
                shortDirNamePath, "*.md").Select(
                file => Tuple.Create(
                    Path.GetFileName(file), file)).Where(
                tuple => tuple.Item1.EndsWith(
                    noteFileNamesCfg.NoteItemMdFileName)).ToArray();

            tuplesArr = tuplesArr.Select(
                tuple => Tuple.Create(
                    tuple.Item1,
                    MdH.TryGetMdTitleFromFile(tuple.Item2))).Where(
                tuple => !string.IsNullOrWhiteSpace(
                    tuple.Item2)).ToArray();

            return tuplesArr;
        }

        private string[] GetFullDirNames(
            ProgramArgs args,
            out string shortDirNamePart)
        {
            shortDirNamePart = string.Concat(
                args.ShortDirName,
                config.DirNames.DefaultJoinStr);

            string[] dirNamesArr = Directory.GetDirectories(
                args.ParentDirPath, $"{shortDirNamePart}*").Select(
                dirName => Path.GetFileName(dirName)).ToArray();

            return dirNamesArr;
        }

        private string GetMdFile(
            string shortDirNamePath,
            out string mdTitle,
            bool autoChooseIfSingle)
        {
            var tuplesArr = GetMdFiles(
                shortDirNamePath);

            var retTuple = GetValue(
                "These are the .md files to set the title from:",
                "Please type in the index of the .md file to set the title from: ",
                tuplesArr, (tuple, i) =>
                {
                    (string fileName, string title) = tuple;

                    WriteIdxLineToConsole(i.ToString());

                    WriteWithForegroundsToConsole([
                        Tuple.Create(ConsoleColor.Blue, fileName),
                        Tuple.Create(ConsoleColor.Cyan, title),
                    ]);
                },
                autoChooseIfSingle,
                () =>
                {
                    Console.ForegroundColor = ConsoleColor.Red;

                    Console.WriteLine(
                        "Did not find any .md file containing a valid title");

                    Console.ResetColor();
                    Console.WriteLine();

                    return Tuple.Create<string, string>(null, null);
                });

            (string mdFileName, mdTitle) = retTuple;
            return mdFileName;
        }

        private string GetFullDirName(
            ProgramArgs args,
            bool autoChooseIfSingle,
            out string fullDirNamePartStr)
        {
            string[] dirNamesArr = GetFullDirNames(
                args, out string shortDirNamePart);

            int shortDirNamePartLen = shortDirNamePart.Length;

            string fullDirName = GetValue(
                "These are the full dir names candidate for being updated",
                "Please type in the index of the full name dir to update: ",
                dirNamesArr,
                (item, i) =>
                {
                    string fullDirNamePart = item.Substring(
                        shortDirNamePartLen);

                    WriteIdxLineToConsole(i.ToString());

                    WriteWithForegroundsToConsole([
                        Tuple.Create(ConsoleColor.Blue, args.ShortDirName),
                        Tuple.Create(ConsoleColor.Magenta, config.DirNames.DefaultJoinStr),
                        Tuple.Create(ConsoleColor.Cyan, fullDirNamePart)
                    ]);
                },
                autoChooseIfSingle,
                () =>
                {
                    Console.ForegroundColor = ConsoleColor.Red;

                    Console.WriteLine(
                        "Did not find any full dir names candidate for being updated");

                    Console.ResetColor();
                    Console.WriteLine();

                    return null;
                });

            if (fullDirName != null)
            {
                fullDirNamePartStr = fullDirName.Substring(
                    shortDirNamePartLen);

                args.MdTitle ??= fullDirNamePartStr;
            }
            else
            {
                fullDirNamePartStr = null;
            }

            return fullDirName;
        }

        private TValue GetValue<TValue>(
            string listHeadingMsg,
            string readIdxPromptMsg,
            TValue[] inputArr,
            Action<TValue, int> printItemCallback,
            bool autoChooseIfSingle,
            Func<TValue> defaultValueFactory = null)
        {
            TValue retVal;

            if (inputArr.Any())
            {
                if (autoChooseIfSingle && inputArr.Length == 1)
                {
                    retVal = inputArr.Single();
                }
                else
                {
                    WriteHeadingLineToConsole(listHeadingMsg);

                    for (int i = 0; i < inputArr.Length; i++)
                    {
                        printItemCallback(inputArr[i], i);
                    }

                    ReadIdxFromConsole(
                        readIdxPromptMsg,
                        inputArr,
                        out retVal,
                        defaultValueFactory);
                }
            }
            else if (defaultValueFactory != null)
            {
                retVal = defaultValueFactory();
            }
            else
            {
                retVal = default;
            }

            return retVal;
        }

        private int ReadIdxFromConsole<T>(
            string caption,
            T[] arr,
            out T retVal,
            Func<T> defaultValueFactory = null)
        {
            Console.WriteLine(caption);
            int idx = int.Parse(Console.ReadLine());

            if (idx >= 0)
            {
                retVal = arr[idx];
            }
            else if (defaultValueFactory != null)
            {
                retVal = defaultValueFactory();
            }
            else
            {
                retVal = default;
            }

            return idx;
        }

        private void WriteWithForegroundsToConsole(
            Tuple<ConsoleColor, string>[] tuplesArr)
        {
            foreach (var tuple in tuplesArr)
            {
                Console.ForegroundColor = tuple.Item1;
                Console.Write(tuple.Item2);
            }

            Console.ResetColor();
            Console.WriteLine();
        }

        private void WriteIdxLineToConsole(
            string idxStr)
        {
            Console.BackgroundColor = ConsoleColor.Magenta;
            Console.ForegroundColor = ConsoleColor.Black;

            Console.Write(idxStr);
            Console.ResetColor();
            Console.Write(" > ");
        }

        private void WriteHeadingLineToConsole(
            string headingCaption,
            ConsoleColor? foregroundColor = null)
        {
            Console.WriteLine();

            ConsoleH.WithColors(
                () => Console.WriteLine(headingCaption),
                (foregroundColor ?? ConsoleColor.White).Tuple());

            Console.WriteLine();
        }

        private void UpdateTimeStamp(
            string shortNameDirPath)
        {
            string jsonFilePath = Path.Combine(
                shortNameDirPath,
                config.FileNames.JsonFileName);

            NoteItemCore noteItem;

            if (File.Exists(jsonFilePath))
            {
                string json = File.ReadAllText(jsonFilePath);
                noteItem = jsonConversion.Adapter.Deserialize<NoteItemCore>(json);
                noteItem.UpdatedAt = DateTime.UtcNow;
            }
            else
            {
                noteItem = new()
                {
                    UpdatedAt = DateTime.UtcNow,
                };
            }

            string newJson = jsonConversion.Adapter.Serialize(noteItem);
            File.WriteAllText(jsonFilePath, newJson);
        }

        public class WorkArgs
        {
            public ProgramArgs Args { get; set; }
        }
    }
}
