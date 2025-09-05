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
using Turmerik.Core.Text;
using HtmlAgilityPack;
using Turmerik.Notes.Core;
using Turmerik.Html;
using Turmerik.Core.DriveExplorer;
using System.Runtime.InteropServices;
using System.Diagnostics;
using Markdig;
using Turmerik.DirsPair;
using Turmerik.Md;
using Turmerik.Core.TextParsing.Md;
using System.Threading;

namespace Turmerik.NetCore.ConsoleApps.MkFsDirPairs
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);

        Task<string> GetResouceTitleAsync(
            string? title,
            string url,
            bool hasUri);

        string GetTitleFromUri(
            string url,
            bool hasUri);

        Task<MdLink[]> OpenMdFileAndAddLinks();
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IConsoleMsgPrinter consoleMsgPrinter;
        private readonly IConsoleObjectPropsPrinter consoleObjectPropsPrinter;
        private readonly IConsoleArgsParser parser;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IDirsPairCreator dirsPairCreator;
        private readonly IHtmlDocTitleRetriever htmlDocTitleRetriever;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;
        private readonly PdfCreatorFactory pdfCreatorFactory;
        private readonly ITimeStampHelper timeStampHelper;
        private readonly IClipboardService clipboardService;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleMsgPrinter consoleMsgPrinter,
            IConsoleObjectPropsPrinter consoleObjectPropsPrinter,
            IConsoleArgsParser consoleArgsParser,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IDirsPairCreatorFactory dirsPairCreatorFactory,
            IHtmlDocTitleRetriever htmlDocTitleRetriever,
            IDirsPairConfigLoader dirsPairConfigLoader,
            INotesAppConfigLoader notesAppConfigLoader,
            PdfCreatorFactory pdfCreatorFactory,
            ITimeStampHelper timeStampHelper,
            IClipboardService clipboardService)
        {
            this.consoleMsgPrinter = consoleMsgPrinter ?? throw new ArgumentNullException(
                nameof(consoleMsgPrinter));

            this.consoleObjectPropsPrinter = consoleObjectPropsPrinter ?? throw new ArgumentNullException(
                nameof(consoleObjectPropsPrinter));

            parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.htmlDocTitleRetriever = htmlDocTitleRetriever ?? throw new ArgumentNullException(
                nameof(htmlDocTitleRetriever));

            config = dirsPairConfigLoader.LoadConfig();
            notesConfig = notesAppConfigLoader.LoadConfig();

            dirsPairCreator = dirsPairCreatorFactory.Creator(
                notesConfig.GetNoteDirPairs());

            this.pdfCreatorFactory = pdfCreatorFactory ?? throw new ArgumentNullException(
                nameof(pdfCreatorFactory));

            this.timeStampHelper = timeStampHelper ?? throw new ArgumentNullException(
                nameof(timeStampHelper));

            this.clipboardService = clipboardService ?? throw new ArgumentNullException(
                nameof(clipboardService));
        }

        public async Task RunAsync(
            string[] rawArgs)
        {
            var args = GetArgs(rawArgs);

            if (args.PrintHelpMessage == true)
            {
                PrintHelpMessage(args);
            }
            else if (args.PrintConfigSection.HasValue)
            {
                PrintConfigSection(args,
                    args.PrintConfigSection.Value);
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

        public async Task<string> GetResouceTitleAsync(
            string? title,
            string url,
            bool hasUri)
        {
            WriteSectionToConsole(
                "Fetching resource from the following url: ",
                url, ConsoleColor.Blue);

            string resTitle = null;

            await ConsoleH.TryExecuteAsync(async () =>
            {
                resTitle = (await GetResouceTitleCoreAsync(
                    url)).Nullify(true);
            }, false);

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

                    string userAnswer = Console.ReadLine();
                    string newResTitle = userAnswer.Nullify(true);

                    if (newResTitle != null)
                    {
                        resTitle = newResTitle;
                    }
                    else if (userAnswer?.Length > 0)
                    {
                        if (userAnswer == " ")
                        {
                            resTitle = GetTitleFromUri(
                                url, true);
                        }
                        else
                        {
                            resTitle = await clipboardService.GetTextAsync(
                                ) ?? throw new InvalidOperationException(
                                    "Found no text in the clipboard!");
                        }
                    }
                }
            }
            else
            {
                Console.WriteLine(
                    "The resource at the provided url doesn't have a title; please type a title yourself: ");

                resTitle = Console.ReadLine().Nullify(
                    true) ?? title ?? throw new ArgumentNullException(
                        nameof(resTitle));

                Console.WriteLine();
            }

            return resTitle;
        }

        public string GetTitleFromUri(
            string url,
            bool hasUri)
        {
            var uriObj = new Uri(url);
            string host = uriObj.Host;
            string path = uriObj.AbsolutePath;

            string resTitle = path.Trim().Trim('/').Trim().Split('/').Reverse(
                ).ToArray().JoinStr(" - ");

            WriteSectionToConsole(
                "The following title has been extracted from the url: ",
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

            resTitle = string.Join(" - ", resTitle, host);
            return resTitle;
        }

        public async Task<MdLink[]> OpenMdFileAndAddLinks()
        {
            List<MdLink> mdLinksToAddList = new();

            string line = string.Empty;
            bool isNullOrEmpty = false;
            bool isAllWhitespace = false;

            Action refreshLine = () =>
            {
                line = Console.ReadLine();
                isNullOrEmpty = string.IsNullOrEmpty(line);
                isAllWhitespace = !isNullOrEmpty && string.IsNullOrWhiteSpace(line);
            };

            refreshLine();

            while (!isAllWhitespace)
            {
                string newLinkTitle = null;

                if (!isNullOrEmpty && line.StartsWith(":"))
                {
                    newLinkTitle = line.Substring(1);
                    refreshLine();
                }

                if (!isNullOrEmpty)
                {
                    string url = line.Trim();
                    bool crashed = true;

                    if (newLinkTitle == null)
                    {
                        WriteSectionToConsole(
                            "Fetching resource from the following url: ",
                            url, ConsoleColor.Blue);

                        await ConsoleH.TryExecuteAsync(async () =>
                        {
                            newLinkTitle = (await GetResouceTitleCoreAsync(
                                url)).Nullify(true);

                            WriteSectionToConsole(
                                "The resource at the provided url has the following title: ",
                                newLinkTitle, ConsoleColor.Cyan);

                            Console.WriteLine(string.Join(" ",
                                "Are you want to use this title? If you do, then just",
                                "press enter next; otherwise, type a title yourself: "));

                            crashed = false;
                        }, false);

                        if (crashed)
                        {
                            Console.WriteLine("Type a title yourself: ");
                        }

                        string userAnswer = Console.ReadLine();
                        string newResTitle = userAnswer.Nullify(true);

                        if (newResTitle != null)
                        {
                            newLinkTitle = newResTitle;
                        }
                        else if (userAnswer?.Length > 0)
                        {
                            if (userAnswer == " ")
                            {
                                newLinkTitle = GetTitleFromUri(
                                    url, true);
                            }
                            else
                            {
                                newLinkTitle = await clipboardService.GetTextAsync(
                                    ) ?? throw new InvalidOperationException(
                                        "Found no text in the clipboard!");
                            }
                        }
                    }

                    mdLinksToAddList.Add(new()
                    {
                        Title = MdH.EncodeForMd(
                            newLinkTitle),
                        Url = url
                    });
                }

                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("Paste another url or type the SPACE char to go on with the update");
                Console.ResetColor();
                refreshLine();
            }

            return mdLinksToAddList.ToArray();
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

                string.Join(" ", optsHead($":{argOpts.SkipPdfFileCreation}", ""),
                    $"Indicates that no pdf file should be created",
                    $"for the pair of folder that will be created by this command",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

                string.Join(" ", optsHead($":{argOpts.CreatePdfFile}", ""),
                    $"Indicates that a pdf file should be created",
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

                string.Join(" ", optsHead($":{argOpts.PrintConfigSection}", ""),
                    $"Prints the specified config section to console",
                    $"{{{x.NewLine}}}{{{x.NewLine}}}"),

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

        private void PrintConfigSection(
            ProgramArgs args,
            ProgramArgs.PrintConfigSectionType printConfigSectionType)
        {
            object configSection = null;

            switch (printConfigSectionType)
            {
                case ProgramArgs.PrintConfigSectionType.AllowedValues:
                    break;
                case ProgramArgs.PrintConfigSectionType.ArgOpts:
                    configSection = config.ArgOpts;
                    break;
                case ProgramArgs.PrintConfigSectionType.DirNamesMacrosMap:
                    if (args.PrintConfigSectionFilter != null)
                    {
                        configSection = config.DirNames.MacrosMap.Where(
                            kvp => kvp.Value.Contains(
                                args.PrintConfigSectionFilter)).Dictnr();
                    }
                    else
                    {
                        configSection = config.DirNames.MacrosMap;
                    }
                    break;
                case ProgramArgs.PrintConfigSectionType.MacrosMap:
                    if (args.PrintConfigSectionFilter != null)
                    {
                        configSection = config.Macros.Map.Where(
                            kvp => kvp.Value[1].Contains(
                                args.PrintConfigSectionFilter)).Dictnr();
                    }
                    else
                    {
                        configSection = config.Macros.Map;
                    }
                    break;
                default:
                    throw new NotSupportedException(
                        $"{nameof(printConfigSectionType)}: {printConfigSectionType}");
            }

            configSection ??= EnumsH.GetValues<ProgramArgs.PrintConfigSectionType>().ToDictionary(
                value => (int)value,
                value => value.ToString());

            Console.ForegroundColor = ConsoleColor.DarkCyan;

            Console.WriteLine("Printing config section: ");
            Console.WriteLine();

            Console.ForegroundColor = ConsoleColor.Cyan;

            int tokensCount = 0;

            consoleObjectPropsPrinter.Print(new ()
            {
                SrcObject = configSection,
                OnPropPrinted = () =>
                {
                    if (++tokensCount % 10 == 0)
                    {
                        Console.ForegroundColor = ConsoleColor.DarkGreen;

                        Console.WriteLine("/*");
                        Console.WriteLine("***********************************************");
                        Console.WriteLine("*/");
                        Console.ResetColor();
                    }
                }
            });

            Console.WriteLine();
            Console.ResetColor();
        }

        private async Task RunAsync(
            string workDir,
            ProgramArgs.Node nodeArgs)
        {
            (var shortNameDir, 
               var mdFilePath,
               var mdFile) = await RunNodeArgsAsync(
                workDir,
                nodeArgs);

            if (mdFile != null)
            {
                if (ShouldCreatePdfFile(nodeArgs))
                {
                    var pdfCreator = pdfCreatorFactory.Creator(
                        new()
                        {
                            MdFile = mdFile,
                            MdFilePath = mdFilePath,
                            ShortNameDir = shortNameDir,
                        });

                    await pdfCreator.TryCreatePdf();
                }
            }

            string childNodesWorkDir = Path.Combine(
                workDir, shortNameDir.Name);

            foreach (var childNodeArgs in nodeArgs.ChildNodes)
            {
                await RunAsync(
                    childNodesWorkDir,
                    childNodeArgs);
            }
        }

        private bool ShouldCreatePdfFile(
            ProgramArgs.Node nodeArgs) => nodeArgs.CreatePdfFile || 
                config.CreatePdfFile == true && !nodeArgs.SkipPdfFileCreation;

        private async Task<Tuple<DriveItemX, string?, DriveItemX?>> RunNodeArgsAsync(
            string workDir,
            ProgramArgs.Node nodeArgs)
        {
            if (nodeArgs.OpenMdFileAndAddLinks)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine("Paste a url to add as md link");
                Console.ResetColor();

                nodeArgs.MdLinksToAddArr = await OpenMdFileAndAddLinks();
            }

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

            var mdFile = shortNameDir.FolderFiles?.FirstOrDefault();
            string? mdFilePath = null;

            if (mdFile != null)
            {
                mdFilePath = Path.Combine(
                    shortNameDir.Idnf,
                    mdFile.Name);

                if (opts.OpenMdFile)
                {
                    ProcessH.OpenWithDefaultProgramIfNotNull(mdFilePath);

                    if (opts.OpenMdFileAndWatch)
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine($"Listening for changes to file {mdFilePath}; press any key to stop listening");
                        Console.ResetColor();

                        using (FileSystemWatcher watcher = new FileSystemWatcher())
                        {
                            watcher.Path = Path.GetDirectoryName(mdFilePath);
                            watcher.Filter = Path.GetFileName(mdFilePath);
                            watcher.NotifyFilter = NotifyFilters.LastWrite;

                            var pdfCreator = pdfCreatorFactory.Creator(
                                new()
                                {
                                    MdFile = mdFile,
                                    MdFilePath = mdFilePath,
                                    ShortNameDir = shortNameDir,
                                });

                            watcher.Changed += (sender, evt) =>
                            {
                                Console.ForegroundColor = ConsoleColor.Blue;

                                Console.WriteLine($"Change detected {timeStampHelper.TmStmp(
                                    null, true, TimeStamp.Ticks, false, false, true)}");

                                Console.ResetColor();
                                pdfCreator.TryCreatePdfIfNotBusy();
                            };

                            watcher.EnableRaisingEvents = true;

                            Console.ReadKey();
                            Console.ForegroundColor = ConsoleColor.Green;
                            Console.WriteLine($"Stopped listening for changes to file {mdFilePath}");
                            Console.ResetColor();
                        }
                    }
                    else if (opts.OpenMdFileInteractively)
                    {
                        Console.ForegroundColor = ConsoleColor.Green;
                        Console.WriteLine($"Press any key to update the pdf file or the ENTER key to move on");
                        Console.ResetColor();

                        var key = Console.ReadKey();

                        while (key.Key != ConsoleKey.Enter)
                        {
                            var pdfCreator = pdfCreatorFactory.Creator(
                                new()
                                {
                                    MdFile = mdFile,
                                    MdFilePath = mdFilePath,
                                    ShortNameDir = shortNameDir,
                                });

                            await pdfCreator.TryCreatePdf();
                            key = Console.ReadKey();
                        }
                    }
                }
            }

            return Tuple.Create(
                shortNameDir,
                mdFilePath,
                mdFile);
        }

        private async Task<string> GetResouceTitleCoreAsync(
            string resUrl)
        {
            string title = await htmlDocTitleRetriever.GetResouceTitleAsync(resUrl);

            title = title.Trim().ReplaceChars(
                c => ' ', char.IsWhiteSpace).Split(
                [ ' ' ], StringSplitOptions.RemoveEmptyEntries).JoinStr(" ");

            return title;
        }

        private DirsPairOpts GetDirsPairOpts(
            string workDir,
            ProgramArgs.Node nodeArgs) => new DirsPairOpts
            {
                PrIdnf = workDir,
                Title = nodeArgs.Title,
                SkipMdFileCreation = nodeArgs.SkipMdFileCreation,
                OpenMdFile = nodeArgs.OpenMdFile,
                OpenMdFileAndWatch = nodeArgs.OpenMdFileAndWatch,
                OpenMdFileInteractively = nodeArgs.OpenMdFileInteractively,
                MaxFsEntryNameLength = config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH,
                ShortDirName = nodeArgs.ShortDirName,
                FullDirNamePart = GetFullDirNamePart(nodeArgs),
                JoinStr = nodeArgs.FullDirNameJoinStr,
                MdFileName = GetMdFileName(nodeArgs),
                JsonFileName = config.FileNames.JsonFileName,
                MdFileContentsTemplate = config.FileContents.MdFileContentsTemplate,
                KeepFileName = config.FileNames.KeepFileName,
                KeepFileContents = GetKeepFileContents(),
                MdFileFirstContent = nodeArgs.MdFirstContent,
                MdLinksToAddArr = nodeArgs.MdLinksToAddArr,
                InsertLinksToAdd = nodeArgs.OpenMdFileAndInsertLinks,
                TrmrkGuidInputName = config.TrmrkGuidInputName,
                ThrowIfAnyItemAlreadyExists = config.ThrowIfAnyItemAlreadyExists ?? true,
                CreateNote = nodeArgs.CreateNote,
                CreateNoteSection = nodeArgs.CreateNoteSection,
                NoteSectionRank = nodeArgs.NoteSectionRank,
                CreateNoteBook = nodeArgs.CreateNoteBook,
                CreateNoteInternalsDir = nodeArgs.CreateNoteInternalsDir,
                CreateNoteFilesDir = nodeArgs.CreateNoteFilesDir,
            };

        private string GetMdFileName(
            ProgramArgs.Node nodeArgs) => nodeArgs.DirNameTpl?.MdFileNameTemplate?.With(
                mdFileNameTemplate => string.Format(
                    mdFileNameTemplate,
                    nodeArgs.FullDirNamePart)) ?? config.FileNames.With(
                        fileNames => fileNames.MdFileNamePfx + (fileNames.PrependTitleToNoteMdFileName ?? false).If(
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

            if (!Path.IsPathRooted(args.WorkDir))
            {
                args.WorkDir = Path.Combine(
                    Environment.CurrentDirectory,
                    args.WorkDir);
            }

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

            if (nodeArgs.Title != null)
            {
                nodeArgs.Title = TextMacrosH.ReplaceMacros(
                    nodeArgs.Title,
                    config.DirNames.MacrosMap);
            }

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

            if (nodeArgs.ResTitle == null)
            {
                if (nodeArgs.GetTitleFromUrl == true)
                {
                    nodeArgs.ResTitle = GetTitleFromUri(
                        url, hasUri);
                }
                else if (nodeArgs.GetTitleFromClipboard == true)
                {
                    nodeArgs.ResTitle = await clipboardService.GetTextAsync(
                        ) ?? throw new InvalidOperationException(
                            "Found no text in the clipboard!");
                }
                else
                {
                    nodeArgs.ResTitle = await GetResouceTitleAsync(
                        nodeArgs, url, hasUri);
                }
            }

            nodeArgs.EncodedResTitle = MdH.EncodeForMd(
                nodeArgs.ResTitle);

            nodeArgs.MdFirstContent = string.Format(
                config.FileContents.MdFileContentSectionTemplate,
                $"[{nodeArgs.EncodedResTitle}]({url})");
        }

        private Task<string> GetResouceTitleAsync(
            ProgramArgs.Node nodeArgs,
            string url,
            bool hasUri) => GetResouceTitleAsync(
                nodeArgs.Title, url, hasUri);

        private string GetFullDirNamePart(
            string title) => fsEntryNameNormalizer.NormalizeFsEntryName(
                title, config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH);

        private ProgramArgs GetArgs(
            string[] rawArgs) => parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsFactory = () => new ProgramArgs
                    {
                        HasNodeRequiringPdf = config.CreatePdfFile ?? false
                    }.ActWith(args =>
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
                    MacroModifiersMap = new()
                    {
                        {
                            "s",
                            new ()
                            {
                                { -1, Tuple.Create<string[], string[]>([], [":="]) },
                                { int.MaxValue, Tuple.Create<string[], string[]>([], []) }
                            }
                        },
                        {
                            "c",
                            new ()
                            {
                                { -1, Tuple.Create<string[], string[]>([], [":+"]) },
                                { int.MaxValue, Tuple.Create<string[], string[]>([], [])
                                }
                            }
                        }
                    },
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

                                                args.Current = new ProgramArgs.Node
                                                {
                                                    ParentNode = parent,
                                                    ChildNodes = new List<ProgramArgs.Node>()
                                                };

                                                args.CurrentSibblings.Add(args.Current);
                                            }),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.PrintHelpMessage.Arr(),
                                            data => data.Args.PrintHelpMessage = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.PrintConfigSection.Arr(),
                                            data =>
                                            {
                                                string? argFlagValue = data.ArgFlagValue!.FirstOrDefault();

                                                if (argFlagValue != null)
                                                {
                                                    if (int.TryParse(
                                                        argFlagValue,
                                                        out int value))
                                                    {
                                                        data.Args.PrintConfigSection = (
                                                            ProgramArgs.PrintConfigSectionType)value;
                                                    }
                                                    else if (Enum.TryParse<ProgramArgs.PrintConfigSectionType>(
                                                        argFlagValue,
                                                        out var enumValue))
                                                    {
                                                        data.Args.PrintConfigSection = enumValue;
                                                    }

                                                    if (data.ArgFlagValue.Length > 1)
                                                    {
                                                        data.Args.PrintConfigSectionFilter = data.ArgFlagValue.Skip(
                                                            1).ToArray().JoinStr(":");
                                                    }
                                                }
                                                else
                                                {
                                                    data.Args.PrintConfigSection = ProgramArgs.PrintConfigSectionType.AllowedValues;
                                                }
                                            }),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.WorkDir.Arr(),
                                            data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.Title.Arr(),
                                            data => data.Args.Current.ResTitle = string.Join(":", data.ArgFlagValue)),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.Url.Arr(),
                                            data => data.Args.Current.Url = OnUrlProvided(data)),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.Uri.Arr(),
                                            data => data.Args.Current.Uri = OnUrlProvided(data)),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.OpenMdFile.Arr(),
                                            data => data.Args.Current.OpenMdFile = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.OpenMdFileAndWatch.Arr(),
                                            data =>
                                            {
                                                data.Args.Current.OpenMdFile = true;
                                                data.Args.Current.OpenMdFileAndWatch = true;
                                            }, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.OpenMdFileInteractively.Arr(),
                                            data =>
                                            {
                                                data.Args.Current.OpenMdFile = true;
                                                data.Args.Current.OpenMdFileInteractively = true;
                                            }, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.SkipMdFileCreation.Arr(),
                                            data => data.Args.Current.SkipMdFileCreation = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.SkipPdfFileCreation.Arr(),
                                            data => data.Args.Current.SkipPdfFileCreation = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreatePdfFile.Arr(),
                                            data =>
                                            {
                                                data.Args.Current.CreatePdfFile = true;
                                                data.Args.HasNodeRequiringPdf = true;
                                            }, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNote.Arr(),
                                            data => data.Args.Current.CreateNote = true, true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.CreateNoteSection.Arr(),
                                            data =>
                                            {
                                                data.Args.Current.CreateNoteSection = true;
                                                data.Args.Current.NoteSectionRank = data.ArgFlagValue.FirstOrDefault();
                                            }),
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
                                                data.ArgFlagValue!.Single()]),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.OpenMdFileAndAddLinks.Arr(),
                                            data => data.Args.Current.OpenMdFileAndAddLinks = true),
                                        parser.ArgsFlagOpts(data,
                                            config.ArgOpts.OpenMdFileAndInsertLinks.Arr(),
                                            data =>
                                            {
                                                data.Args.Current.OpenMdFileAndAddLinks = true;
                                                data.Args.Current.OpenMdFileAndInsertLinks = true;
                                            }),
                                    ]
                                });
                        }
                    }
                }).Args;

        private string GetUrl(
            string[] argFlagValue,
            out string? urlOption)
        {
            switch (argFlagValue.Length)
            {
                case 0:
                case 1:
                    throw new ArgumentException(
                        nameof(ProgramArgs.Node.Url));
                case 2:
                    urlOption = null;
                    break;
                default:
                    urlOption = argFlagValue.First();

                    if ("-".Arr("_").Contains(urlOption))
                    {
                        argFlagValue = argFlagValue.Skip(1).ToArray();
                    }
                    else
                    {
                        urlOption = null;
                    }

                    break;
            }

            string url = argFlagValue.JoinStr(":");
            return url;
        }

        private string OnUrlProvided(
            ConsoleArgsParserData<ProgramArgs> data)
        {
            string url = GetUrl(
                data.ArgFlagValue!,
                out string? urlOption);

            if (urlOption != null)
            {
                switch (urlOption)
                {
                    case "-":
                        data.Args.Current.GetTitleFromUrl = true;
                        break;
                    case "_":
                        data.Args.Current.GetTitleFromClipboard = true;
                        break;
                    default:
                        throw new ArgumentException(
                            nameof(urlOption));
                }
            }

            return url;
        }

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

        private class CreatePdfFileArgs
        {
            public DriveItemX? ShortNameDir { get; init; }
            public string MdFilePath { get; init; }
            public DriveItemX? MdFile { get; init; }
        }
    }
}
