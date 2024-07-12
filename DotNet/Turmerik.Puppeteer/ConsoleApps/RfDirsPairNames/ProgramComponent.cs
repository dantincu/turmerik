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
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.Md;
using Turmerik.Notes.Core;
using Turmerik.TextParsing.Md;
using static Turmerik.Puppeteer.ConsoleApps.RfDirsPairNames.ProgramComponent;

namespace Turmerik.Puppeteer.ConsoleApps.RfDirsPairNames
{
    public interface IProgramComponent
    {
        Task<Tuple<string?, string?>> RunAsync(
            string[] rawArgs);

        Task<string> RunAsync(
            WorkArgs wka);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly MdToPdf.IProgramComponent mdToPdfProgramComponent;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly NoteDirsPairConfigMtbl noteDirsPairCfg;
        private readonly NoteDirsPairConfigMtbl.FileNamesT noteFileNamesCfg;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleMsgPrinter consoleMsgPrinter,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IConsoleArgsParser consoleArgsParser,
            MdToPdf.IProgramComponent mdToPdfProgramComponent)
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

            config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME)));

            notesConfig = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    TrmrkNotesH.NOTES_CFG_FILE_NAME)));

            noteDirsPairCfg = notesConfig.NoteDirPairs;
            noteFileNamesCfg = noteDirsPairCfg.FileNames;
        }

        public async Task<Tuple<string?, string?>> RunAsync(
            string[] rawArgs)
        {
            var args = GetWorkArgs(rawArgs);
            string? title = args.MdTitle;
            string? newFullDirNamePart;

            if (args.PrintHelpMessage != true)
            {
                var wka = new WorkArgs
                {
                    Args = args
                };

                newFullDirNamePart = await RunAsync(wka);
            }
            else
            {
                title = null;
                newFullDirNamePart = null;
            }

            return Tuple.Create(title, newFullDirNamePart);
        }

        public async Task<string> RunAsync(
            WorkArgs wka)
        {
            var args = wka.Args;

            string newFullDirNamePart = fsEntryNameNormalizer.NormalizeFsEntryName(
                wka.Args.MdTitle,
                config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH);

            string newMdFileName = GetMdFileName(newFullDirNamePart);

            string newFullDirName = GetFullDirNamePart(
                args, newFullDirNamePart);

            if (newMdFileName != args.MdFileName)
            {
                TryRenameMdFile(wka, newMdFileName);
            }

            TryRenameFullNameDir(wka, newFullDirName);

            await mdToPdfProgramComponent.RunAsync(
                new MdToPdf.ProgramArgs
                {
                    WorkDir = wka.Args.ShortNameDirPath,
                    RemoveExisting = true
                });

            return newFullDirNamePart;
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

        private void TryRenameMdFile(
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
                true => jsonConversion.Adapter.Serialize(new NoteItemCore
                {
                    Title = wka.Args.MdTitle
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

        private ProgramArgs GetWorkArgs(string[] rawArgs)
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
                                data => data.Args.ShortNameDirPath = data.ArgItem.Nullify(true)?.With(
                                    path => NormPathH.NormPath(
                                        path, (path, isRooted) => isRooted.If(
                                            () => path, () => Path.GetFullPath(path))))!),
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
                                config.ArgOpts.InteractiveMode.Arr(),
                                data => data.Args.InteractiveMode = true)
                        ]
                    })
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
            bool autoChoose = args.InteractiveMode != true;
            args.ShortNameDirPath ??= Environment.CurrentDirectory;

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

        private string GetMdFileName(
            string fullDirNamePart) => config.FileNames.With(
                fileNames => (fileNames.PrependTitleToNoteMdFileName ?? false).If(
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

        public class WorkArgs
        {
            public ProgramArgs Args { get; set; }
        }
    }
}
