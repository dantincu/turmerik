using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.Helpers;
using Turmerik.Core.TextSerialization;
using Turmerik.Core.Utility;
using Turmerik.DirsPair.ConsoleApps.RfDirsPairNames;
using Turmerik.Core.Text;
using HtmlAgilityPack;
using Turmerik.DirsPair;
using Turmerik.Notes.Core;
using Turmerik.Html;
using Turmerik.Core.DriveExplorer;
using System.Runtime.InteropServices;
using System.Diagnostics;

namespace Turmerik.DirsPair.ConsoleApps.MkFsDirPairs
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly IConsoleArgsParser parser;
        private readonly IProcessLauncherCore processLauncher;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IDirsPairCreator dirsPairCreator;
        private readonly IHtmlDocTitleRetriever htmlDocTitleRetriever;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleMsgPrinter consoleMsgPrinter,
            IConsoleArgsParser consoleArgsParser,
            IProcessLauncherCore processLauncher,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IDirsPairCreatorFactory dirsPairCreatorFactory,
            IHtmlDocTitleRetriever htmlDocTitleRetriever)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));

            this.processLauncher = processLauncher ?? throw new ArgumentNullException(
                nameof(processLauncher));

            this.parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME)));

            notesConfig = jsonConversion.Adapter.Deserialize<NotesAppConfigMtbl>(
                File.ReadAllText(Path.Combine(
                    ProgramH.ExecutingAssemmblyPath,
                    TrmrkNotesH.NOTES_CFG_FILE_NAME)));

            dirsPairCreator = dirsPairCreatorFactory.Creator(
                notesConfig.GetNoteDirPairs());

            this.htmlDocTitleRetriever = htmlDocTitleRetriever ?? throw new ArgumentNullException(
                nameof(htmlDocTitleRetriever));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);

            if (args.PrintHelpMessage == true)
            {
                PrintHelpMessage(args);
            }
            else
            {
                await NormalizeArgsAsync(args);

                foreach (var nodeArgs in args.RootNodes)
                {
                    await RunAsync(
                        args.WorkDir, nodeArgs);
                }
            }
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
                $"{{{x.Blue}}}Welcome to the Turmerik MkFsDirPairs tool{{{x.NewLine}}}",

                string.Join(" ", $"{m.ThisTool.U} helps you take notes by creating",
                    $"a pair of folders starting with the same short name that consists of",
                    $"an autoincremented index (or autodecremented index, depending on the configuration)",
                    $"optionally preceded by a prefix. The first folder's name will actually be",
                    $"equal to this short dir name, and the second dir's name will be obtained from this short dir name by",
                    $"appending a (configurable) join string followed by a normalized full dir name part",
                    $"which is obtained from the title you pass in as the first argument,",
                    $"from which the file system entry invalid characters are removed and then,",
                    $"if the resulted string is longer than the configurable maximum allowed",
                    $"directory name length, it's replaced by a slice that starts from its first character",
                    $"and contains the maximum allowed number of characters.{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of argument options {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.WorkDir}", ""),
                    $"Changes to work directory where the pair (or pairs) of folders will be created",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.Url}", ""),
                    $"Provides an url to fetch an html document from which to parse the title that will be used",
                    $"for the note title, markdown file name and full dir name part if the first argument is an empty string.",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.Uri}", ""),
                    $"Similar to the {{{x.DarkCyan}}}{argOpts.Url}{{{x.Splitter}}} option, but",
                    $"after fetching the html document and parsing the title from it, the user",
                    $"will be asked to either confirm that the parsed title is to be used for the note title",
                    $"or provide another title by typing or pasting it to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.OpenMdFile}", ""),
                    $"Indicates that the newly created markdown file should be open in the OS default",
                    $"markdown editor program after the pair of folders has been created",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.SkipMdFileCreation}", ""),
                    $"Indicates that no markdown file should be created",
                    $"for the pair of folder that will be created by this command",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.CreateNote}", ""),
                    $"Indicates that the pair of folders that will be created should represent a note item",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.CreateNoteSection}", ""),
                    $"Indicates that the pair of folders that will be created should represent a note section",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.CreateNoteBook}", ""),
                    $"Indicates that the pair of folders that will be created should represent a note book",
                    $"i.e. a pair of folders that sits in the root folder of a group of nested notes",
                    $"and will not contain nested notes itself (it will be an note internal folders pair)",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.CreateNoteFilesDir}", ""),
                    $"Indicates that the pair of folders that will be created should represent a note attachment files folder",
                    $"i.e. a pair of folders that sits in the folder of a note item or note section",
                    $"and will contain files uploaded or copied there by the user (it will be an note internal folders pair)",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.CreateNoteInternalsDir}", ""),
                    $"Indicates that the pair of folders that will be created should represent a note internals folder",
                    $"i.e. a pair of folders that sits in the folder of a note item or note section",
                    $"and will contain user settings / preferences and various files and folders that a future",
                    $"note taking app might need to store that are not of direct concern for the user",
                    $"(it will be an note internal folders pair)",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.DirNameTpl}", ""),
                    $"Specifies the name of the folder name template to be used. Normally, this arg should not be used",
                    $"directly, I left it here for \"legacy compatibility\", because the folder name template is",
                    $"automatically assigned based on which of the {{{x.DarkCyan}}}{argOpts.CreateNoteBook}{{{x.Splitter}}},",
                    $"{{{x.DarkCyan}}}{argOpts.CreateNoteFilesDir}{{{x.Splitter}}} or",
                    $"{{{x.DarkCyan}}}{argOpts.CreateNoteInternalsDir}{{{x.Splitter}}} flag has been passed on",
                    $"in order to generate the corresponding constant value for the full dir name part",
                    $"or left null if none of these flags has been passed in, in order to generate the full dir name part",
                    $"from the provided title.",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.HcyChildNode}", ""),
                    $"Creates a child node where the following arguments, options and flags for this command will be",
                    $"assigned to{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.HcySibblingNode}", ""),
                    $"Creates a sibbling node where the following arguments, options and flags for this command will be",
                    $"assigned to{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.HcyParentNode}", ""),
                    $"Moves up to the parent node to further create sibblings or other children",
                    $"for the parent node{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.PrintHelpMessage}", ""),
                    $"Prints this help message to the console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"Here is a list of arguments {m.ThisTool.L} supports",
                    $"(those marked with {{{x.DarkRed}}}*{{{x.Splitter}}} are required):{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", $"{{{x.DarkBlue}}}1. {{{x.DarkRed}}}*{{{x.Splitter}}}The {{{x.Blue}}}note title{{{x.Splitter}}}",
                    $"(which is required unless you pass one of these flags on:",
                    $"{{{x.DarkCyan}}}{argOpts.CreateNoteBook}{{{x.Splitter}}},",
                    $"{{{x.DarkCyan}}}{argOpts.CreateNoteFilesDir}{{{x.Splitter}}} or",
                    $"{{{x.DarkCyan}}}{argOpts.CreateNoteInternalsDir}{{{x.Splitter}}})",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                $"{{{x.DarkBlue}}}2. {{{x.Splitter}}}The {{{x.Blue}}}short dir name{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}",
                $"{{{x.DarkBlue}}}3. {{{x.Splitter}}}The {{{x.Blue}}}join string{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}",

                $"{{{x.Blue}}}You can find the source code for this tool at the following url:",
                string.Concat(
                    $"{{{x.DarkGreen}}}",
                    "https://github.com/dantincu/turmerik/tree/main/DotNet/Turmerik.LsFsDirPairs.ConsoleApp",
                    $"{{{x.Splitter}}}{{{x.NewLine}}}{{{x.NewLine}}}")];

            consoleMsgPrinter.Print(linesArr, null, x);
        }

        private async Task RunAsync(
            string workDir,
            ProgramArgs.Node nodeArgs)
        {
            var opts = GetDirsPairOpts(workDir, nodeArgs);
            var dirsPair = await dirsPairCreator.CreateDirsPairAsync(opts);

            var shortNameDir = dirsPair.First();

            Console.ForegroundColor = ConsoleColor.DarkGreen;
            Console.Write("Work dir path: ");

            Console.ForegroundColor = ConsoleColor.Green;
            Console.WriteLine(workDir);

            Console.ResetColor();
            Console.WriteLine();

            Console.ForegroundColor = ConsoleColor.DarkCyan;
            Console.Write("Short dir name: ");

            Console.ForegroundColor = ConsoleColor.Cyan;
            Console.WriteLine(shortNameDir.Name);
            Console.ResetColor();

            var mdFile = shortNameDir.FolderFiles?.SingleOrDefault();

            string mdFilePath = Path.Combine(
                shortNameDir.Idnf,
                mdFile.Name);

            if (mdFile != null)
            {
                if (opts.OpenMdFile)
                {
                    ProcessH.OpenWithDefaultProgramIfNotNull(mdFilePath);
                }
                else if (!nodeArgs.SkipPdfFileCreation && (config.CreatePdfCmdNameTpl?.Length ?? -1) > 0)
                {
                    await processLauncher.Launch(new ProcessLauncherOpts
                    {
                        UseShellExecute = true,
                        FileName = config.CreatePdfCmdNameTpl.First(),
                        ArgumentsNmrbl = config.CreatePdfCmdNameTpl.Skip(1).Select(
                            arg => string.Format(arg, mdFilePath))
                    });
                }
            }

            string childNodesWorkDir = Path.Combine(
                workDir, shortNameDir.Name);

            foreach (var childNodeArgs in nodeArgs.ChildNodes)
            {
                await RunAsync(
                    childNodesWorkDir, childNodeArgs);
            }
        }

        private Task<string> GetResouceTitleAsync(
            string resUrl) => htmlDocTitleRetriever.GetResouceTitleAsync(
                resUrl);

        private DirsPairOpts GetDirsPairOpts(
            string workDir,
            ProgramArgs.Node nodeArgs) => new DirsPairOpts
            {
                PrIdnf = workDir,
                Title = nodeArgs.Title,
                SkipMdFileCreation = nodeArgs.SkipMdFileCreation,
                OpenMdFile = nodeArgs.OpenMdFile,
                MaxFsEntryNameLength = config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH,
                ShortDirName = nodeArgs.ShortDirName,
                FullDirNamePart = GetFullDirNamePart(nodeArgs),
                JoinStr = nodeArgs.FullDirNameJoinStr,
                MdFileName = GetMdFileName(nodeArgs),
                MdFileContentsTemplate = config.FileContents.MdFileContentsTemplate,
                KeepFileName = config.FileNames.KeepFileName,
                KeepFileContents = GetKeepFileContents(),
                MdFileFirstContent = nodeArgs.MdFirstContent,
                TrmrkGuidInputName = config.TrmrkGuidInputName,
                ThrowIfAnyItemAlreadyExists = config.ThrowIfAnyItemAlreadyExists ?? true,
                CreateNote = nodeArgs.CreateNote,
                CreateNoteSection = nodeArgs.CreateNoteSection,
                CreateNoteBook = nodeArgs.CreateNoteBook,
                CreateNoteInternalsDir = nodeArgs.CreateNoteInternalsDir,
                CreateNoteFilesDir = nodeArgs.CreateNoteFilesDir,
            };

        private string GetMdFileName(
            ProgramArgs.Node nodeArgs) => nodeArgs.DirNameTpl?.MdFileNameTemplate?.With(
                mdFileNameTemplate => string.Format(
                    mdFileNameTemplate,
                    nodeArgs.FullDirNamePart)) ?? config.FileNames.With(
                        fileNames => (fileNames.PrependTitleToNoteMdFileName ?? false).If(
                            () => nodeArgs.FullDirNamePart) + fileNames.MdFileName);

        private string GetFullDirNamePart(
            ProgramArgs.Node nodeArgs) => nodeArgs.DirNameTpl?.With(
                dirNameTpl => string.Format(
                    dirNameTpl.DirNameTpl,
                    nodeArgs.FullDirNamePart)) ?? nodeArgs.FullDirNamePart;

        private string GetKeepFileContents() => string.Format(
            config.FileContents.KeepFileContentsTemplate,
            Trmrk.TrmrkGuidStrNoDash,
            config.TrmrkGuidInputName ?? TrmrkNotesH.TRMRK_GUID_INPUT_NAME);

        private async Task NormalizeArgsAsync(
            ProgramArgs args)
        {
            args.WorkDir ??= Environment.CurrentDirectory;

            foreach (var nodeArgs in args.RootNodes)
            {
                await NormalizeArgsAsync(nodeArgs);
            }
        }

        private async Task NormalizeArgsAsync(
            ProgramArgs.Node nodeArgs)
        {
            bool hasUrl = !string.IsNullOrWhiteSpace(nodeArgs.Url);
            bool hasUri = !string.IsNullOrWhiteSpace(nodeArgs.Uri);

            if (hasUrl || hasUri)
            {
                await FetchResourceAsync(
                    nodeArgs, hasUrl, hasUri);
            }

            nodeArgs.Title ??= nodeArgs.ResTitle;
            nodeArgs.FullDirNameJoinStr ??= config.DirNames.DefaultJoinStr;

            nodeArgs.FullDirNamePart = GetFullDirNamePart(
                nodeArgs.Title ?? string.Empty);

            foreach (var childNodeArgs in nodeArgs.ChildNodes)
            {
                await NormalizeArgsAsync(childNodeArgs);
            }
        }

        private async Task FetchResourceAsync(
            ProgramArgs.Node nodeArgs,
            bool hasUrl,
            bool hasUri)
        {
            string url = hasUrl ? nodeArgs.Url : nodeArgs.Uri;
            string[] urlParts = url.Split('|');
            url = urlParts.Last();

            string? resTitle = null;

            if (urlParts.Length > 1)
            {
                resTitle = string.Join("|",
                    urlParts.Take(urlParts.Length - 1)).Nullify(true);
            }

            if (resTitle == null)
            {
                WriteSectionToConsole(
                    "Fetching resource from the following url: ",
                    url, ConsoleColor.Blue);

                resTitle = (await GetResouceTitleAsync(
                    url)).Nullify(true);

                if (resTitle != null)
                {
                    WriteSectionToConsole(
                        "The resource at the provided url has the following title: ",
                        resTitle, ConsoleColor.Cyan);

                    if (hasUri)
                    {
                        Console.WriteLine(string.Join(" ",
                            "Are you want to use this title? If you do, then just",
                            "press enter next; otherwise, type a title yourself: "));

                        string newResTitle = Console.ReadLine().Nullify(true);

                        if (newResTitle != null)
                        {
                            resTitle = newResTitle;
                        }
                    }
                }
                else
                {
                    Console.WriteLine(
                        "The resource at the provided url doesn't have a title; please type a title yourself: ");

                    resTitle = Console.ReadLine().Nullify(
                        true) ?? nodeArgs.Title ?? throw new ArgumentNullException(
                            nameof(resTitle));

                    Console.WriteLine();
                }
            }
            else
            {
                WriteSectionToConsole(
                    "Using the following resource title: ",
                    resTitle, ConsoleColor.Cyan);
            }

            nodeArgs.ResTitle ??= resTitle?.Replace("\\", "\\\\");

            nodeArgs.MdFirstContent = string.Format(
                config.FileContents.MdFileContentSectionTemplate,
                $"[{nodeArgs.ResTitle}]({url})");
        }

        private string GetFullDirNamePart(
            string title) => fsEntryNameNormalizer.NormalizeFsEntryName(
                title, config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH);

        private ProgramArgs GetArgs(
            string[] rawArgs) => parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsFactory = () => new ProgramArgs().ActWith(args =>
                    {
                        args.Current = new ProgramArgs.Node
                        {
                            ChildNodes = new List<ProgramArgs.Node>()
                        };

                        args.RootNodes = new List<ProgramArgs.Node> { args.Current };
                        args.CurrentSibblings = args.RootNodes;
                    }),
                    MacroFlagName = config.ArgOpts.Macro,
                    MacrosMap = config.Macros.Map,
                    ArgsBuilder = data =>
                    {
                        var args = data.Args;

                        if (data.ArgFlagName == null)
                        {
                            switch (args.Current.ArgsCount)
                            {
                                case 0:
                                    args.Current.Title = data.ArgItem.Nullify(true);
                                    break;
                                case 1:
                                    args.Current.ShortDirName = data.ArgItem.Nullify(true);
                                    break;
                                case 2:
                                    args.Current.FullDirNameJoinStr = data.ArgItem;
                                    break;
                                default:
                                    throw new ArgumentException(
                                        "Expected no more than 3 arguments for each node but already received the 4th");
                            }

                            args.Current.ArgsCount++;
                        }
                        else
                        {
                            parser.HandleArgs(
                                new ConsoleArgsParseHandlerOpts<ProgramArgs>
                                {
                                    Data = data,
                                    ThrowOnTooManyArgs = false,
                                    ThrowOnUnknownFlag = true,
                                    ItemHandlersArr = [],
                                    FlagHandlersArr = [
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.HcyChildNode.Arr(),
                                            data =>
                                            {
                                                var args = data.Args;
                                                var nextParent = args.Current;

                                                args.Current = new ProgramArgs.Node
                                                {
                                                    ParentNode = nextParent,
                                                    ChildNodes = new List<ProgramArgs.Node>()
                                                };

                                                args.CurrentSibblings = nextParent.ChildNodes;
                                                args.CurrentSibblings.Add(args.Current);
                                            }),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.HcyParentNode.Arr(),
                                            data =>
                                            {
                                                var args = data.Args;
                                                var nextCurrent = args.Current.ParentNode;
                                                var nextParent = nextCurrent.ParentNode;

                                                args.Current = nextCurrent;

                                                if (nextParent != null)
                                                {
                                                    args.CurrentSibblings = nextParent.ChildNodes;
                                                }
                                                else
                                                {
                                                    args.CurrentSibblings = args.RootNodes;
                                                }
                                            }),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.HcySibblingNode.Arr(),
                                            data =>
                                            {
                                                var args = data.Args;
                                                var parent = args.Current.ParentNode;

                                                if (data.TotalCount + 1 < data.Opts.ExpandedRawArgs.Length)
                                                {
                                                    args.Current = new ProgramArgs.Node
                                                    {
                                                        ParentNode = parent,
                                                        ChildNodes = new List<ProgramArgs.Node>()
                                                    };

                                                    args.CurrentSibblings.Add(args.Current);
                                                }
                                            }),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.PrintHelpMessage.Arr(),
                                            data => data.Args.PrintHelpMessage = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.WorkDir.Arr(),
                                            data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.Url.Arr(),
                                            data => data.Args.Current.Url = data.ArgFlagValue!.JoinStr(":")),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.Uri.Arr(),
                                            data => data.Args.Current.Uri = data.ArgFlagValue!.JoinStr(":")),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.OpenMdFile.Arr(),
                                            data => data.Args.Current.OpenMdFile = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.SkipMdFileCreation.Arr(),
                                            data => data.Args.Current.SkipMdFileCreation = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.SkipPdfFileCreation.Arr(),
                                            data => data.Args.Current.SkipPdfFileCreation = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNote.Arr(),
                                            data => data.Args.Current.CreateNote = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNoteSection.Arr(),
                                            data => data.Args.Current.CreateNoteSection = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNoteBook.Arr(),
                                            data => data.Args.Current.CreateNoteBook = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNoteInternalsDir.Arr(),
                                            data => data.Args.Current.CreateNoteInternalsDir = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNoteFilesDir.Arr(),
                                            data => data.Args.Current.CreateNoteFilesDir = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.DirNameTpl.Arr(),
                                            data => data.Args.Current.DirNameTpl = config.DirNames.DirNamesTplMap[
                                                data.ArgFlagValue!.Single()])
                                    ]
                                });
                        }
                    }
                }).Args;

        private void WriteSectionToConsole(
            string caption,
            string content,
            ConsoleColor foregroundColor)
        {
            Console.WriteLine(caption);
            Console.ForegroundColor = foregroundColor;
            Console.WriteLine(content);
            Console.ResetColor();
            Console.WriteLine();
        }
    }
}
