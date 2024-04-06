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

namespace Turmerik.DirsPair.ConsoleApps.MkFsDirPairs
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
    }

    public class ProgramComponent : IProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IDirsPairCreator dirsPairCreator;
        private readonly IHtmlDocTitleRetriever htmlDocTitleRetriever;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IDirsPairCreatorFactory dirsPairCreatorFactory,
            IHtmlDocTitleRetriever htmlDocTitleRetriever)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            parser = consoleArgsParser ?? throw new ArgumentNullException(
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
            await NormalizeArgsAsync(args);

            foreach (var nodeArgs in args.RootNodes)
            {
                await RunAsync(
                    args.WorkDir, nodeArgs);
            }
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

            if (opts.OpenMdFile)
            {
                var file = shortNameDir.FolderFiles?.SingleOrDefault();

                if (file != null)
                {
                    string filePath = Path.Combine(
                        shortNameDir.Idnf,
                        file.Name);

                    ProcessH.OpenWithDefaultProgramIfNotNull(filePath);
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

            string resTitle = null;

            if (urlParts.Length > 1)
            {
                resTitle = urlParts[0].Nullify(true);
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

            nodeArgs.ResTitle ??= resTitle;

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
                                            config.ArgOpts.CreateNote.Arr(),
                                            data => data.Args.Current.CreateNote = true, true),
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
