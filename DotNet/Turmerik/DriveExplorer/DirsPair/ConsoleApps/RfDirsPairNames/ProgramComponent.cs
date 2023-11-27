using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.DriveExplorer.Notes;
using Turmerik.TextParsing.Md;
using static Turmerik.DriveExplorer.DirsPair.ConsoleApps.RfDirsPairNames.ProgramComponent;

namespace Turmerik.DriveExplorer.DirsPair.ConsoleApps.RfDirsPairNames
{
    public interface IProgramComponent
    {
        void Run(string[] rawArgs);
        void Run(WorkArgs wka);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IConsoleArgsParser consoleArgsParser;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly NoteDirsPairConfigMtbl noteDirsPairCfg;
        private readonly NoteDirsPairConfigMtbl.FileNamesT noteFileNamesCfg;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IConsoleArgsParser consoleArgsParser)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

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

        public void Run(string[] rawArgs)
        {
            var args = GetWorkArgs(rawArgs);

            var wka = new WorkArgs
            {
                Args = args
            };

            Run(wka);
        }

        public void Run(WorkArgs wka)
        {
            var args = wka.Args;

            string newFullDirNamePart = fsEntryNameNormalizer.NormalizeFsEntryName(wka.Args.MdTitle,
                config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH);

            string newMdFileName = GetMdFileName(newFullDirNamePart);
            
            string newFullDirName = GetFullDirNamePart(
                args, newFullDirNamePart);

            if (newMdFileName != args.MdFileName)
            {
                TryRenameMdFile(wka, newMdFileName);
            }

            if (newFullDirName != args.FullDirName)
            {
                TryRenameFullNameDir(wka, newFullDirName);
            }
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

            if (!Directory.Exists(newFullDirPath))
            {
                if (args.FullDirPath != null && Directory.Exists(
                    args.FullDirPath))
                    {
                        FsH.MoveDirectory(
                            args.FullDirPath,
                            newFullDirPath);

                        WriteWithForegroundsToConsole([
                            Tuple.Create(ConsoleColor.Green, "Renamed"),
                            Tuple.Create(ConsoleColor.Blue, $" {args.FullDirName} "),
                            Tuple.Create(ConsoleColor.Green, "to"),
                            Tuple.Create(ConsoleColor.Cyan, $" {newFullDirName} "),
                        ]);
                    }
                    else
                    {
                        Directory.CreateDirectory(
                            newFullDirPath);

                        string keepFilePath = Path.Combine(
                            newFullDirPath,
                            config.FileNames.KeepFileName);

                        string keepFileContents = string.Format(
                            config.FileContents.KeepFileContentsTemplate,
                            Trmrk.TrmrkGuidStrNoDash,
                            config.TrmrkGuidInputName ?? TrmrkNotesH.TRMRK_GUID_INPUT_NAME);

                        File.WriteAllText(
                            keepFilePath,
                            keepFileContents);

                        WriteWithForegroundsToConsole([
                            Tuple.Create(ConsoleColor.Blue, "File"),
                            Tuple.Create(ConsoleColor.Cyan, $" {args.FullDirName} ")
                        ]);
                    }
            }
            else
            {
                WriteWithForegroundsToConsole([
                    Tuple.Create(ConsoleColor.DarkRed, "Folder"),
                    Tuple.Create(ConsoleColor.Red, $" {newFullDirName} "),
                    Tuple.Create(ConsoleColor.DarkRed, "already exists"),
                ]);
            }

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
                                config.ArgOpts.InteractiveMode.Arr(),
                                data => data.Args.InteractiveMode = true)
                        ]
                    })
                }).Args;

            NormalizeArgs(args);
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
                foregroundColor ?? ConsoleColor.White);

            Console.WriteLine();
        }

        public class WorkArgs
        {
            public ProgramArgs Args { get; set; }
        }
    }
}
