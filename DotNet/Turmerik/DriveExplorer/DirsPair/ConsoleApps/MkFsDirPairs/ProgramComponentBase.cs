using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.ConsoleApps;
using Turmerik.DriveExplorer.DirsPair.ConsoleApps.RfDirsPairNames;
using Turmerik.DriveExplorer.Notes;
using Turmerik.Helpers;
using Turmerik.Text;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer.DirsPair.ConsoleApps.MkFsDirPairs
{
    public interface IProgramComponent
    {
        Task RunAsync(string[] rawArgs);
    }

    public abstract class ProgramComponentBase : IProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IDirsPairCreator dirsPairCreator;
        private readonly DirsPairConfig config;
        private readonly NotesAppConfigMtbl notesConfig;

        public ProgramComponentBase(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IDirsPairCreatorFactory dirsPairCreatorFactory)
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

            this.dirsPairCreator = dirsPairCreatorFactory.Creator(
                notesConfig.GetNoteDirPairs());
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);
            await NormalizeArgsAsync(args);

            var opts = GetDirsPairOpts(args);
            var dirsPair = await dirsPairCreator.CreateDirsPairAsync(opts);

            if (opts.OpenMdFile)
            {
                var shortNameDir = dirsPair.First();
                var file = shortNameDir.FolderFiles?.SingleOrDefault();

                if (file != null)
                {
                    string filePath = Path.Combine(
                        shortNameDir.Idnf,
                        file.Name);

                    ProcessH.OpenWithDefaultProgramIfNotNull(filePath);
                }
            }
        }

        protected abstract Task<string> GetResouceTitleAsync(string resUrl);

        private DirsPairOpts GetDirsPairOpts(
            ProgramArgs args) => new DirsPairOpts
            {
                PrIdnf = args.WorkDir,
                Title = args.Title,
                OpenMdFile = args.OpenMdFile,
                MaxFsEntryNameLength = config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH,
                ShortDirName = args.ShortDirName,
                FullDirNamePart = GetFullDirNamePart(args),
                JoinStr = args.FullDirNameJoinStr,
                MdFileName = GetMdFileName(args),
                MdFileContentsTemplate = config.FileContents.MdFileContentsTemplate,
                KeepFileName = config.FileNames.KeepFileName,
                KeepFileContents = GetKeepFileContents(args),
                MdFileFirstContent = args.MdFirstContent,
                TrmrkGuidInputName = config.TrmrkGuidInputName,
                ThrowIfAnyItemAlreadyExists = config.ThrowIfAnyItemAlreadyExists ?? true,
                CreateNote = args.CreateNote,
                CreateNoteBook = args.CreateNoteBook,
                CreateNoteInternalsDir = args.CreateNoteInternalsDir,
                CreateNoteFilesDir = args.CreateNoteFilesDir,
            };

        private string GetMdFileName(
            ProgramArgs args) => args.DirNameTpl?.MdFileNameTemplate?.With(
                mdFileNameTemplate => string.Format(
                    mdFileNameTemplate,
                    args.FullDirNamePart)) ?? config.FileNames.With(
                        fileNames => (fileNames.PrependTitleToNoteMdFileName ?? false).If(
                            () => args.FullDirNamePart) + fileNames.MdFileName);

        private string GetFullDirNamePart(
            ProgramArgs args) => args.DirNameTpl?.With(
                dirNameTpl => string.Format(
                    dirNameTpl.DirNameTpl,
                    args.FullDirNamePart)) ?? args.FullDirNamePart;

        private string GetKeepFileContents(
            ProgramArgs args) => string.Format(
                config.FileContents.KeepFileContentsTemplate,
                Trmrk.TrmrkGuidStrNoDash,
                config.TrmrkGuidInputName ?? TrmrkNotesH.TRMRK_GUID_INPUT_NAME);

        private async Task NormalizeArgsAsync(
            ProgramArgs args)
        {
            bool hasUrl = !string.IsNullOrWhiteSpace(args.Url);
            bool hasUri = !string.IsNullOrWhiteSpace(args.Uri);

            if (hasUrl || hasUri)
            {
                await FetchResourceAsync(
                    args, hasUrl, hasUri);
            }

            args.Title ??= args.ResTitle;

            args.WorkDir ??= Environment.CurrentDirectory;
            args.FullDirNameJoinStr ??= config.DirNames.DefaultJoinStr;

            args.FullDirNamePart = GetFullDirNamePart(
                args.Title ?? string.Empty);
        }

        private async Task FetchResourceAsync(
            ProgramArgs args,
            bool hasUrl,
            bool hasUri)
        {
            string url = hasUrl ? args.Url : args.Uri;

            WriteSectionToConsole(
                "Fetching resource from the following url: ",
                url, ConsoleColor.Blue);

            string resTitle = (await GetResouceTitleAsync(
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
                        args.ResTitle = newResTitle;
                    }
                }

                args.ResTitle ??= resTitle;
            }
            else
            {
                Console.WriteLine(
                    "The resource at the provided url doesn't have a title; please type a title yourself: ");

                resTitle = Console.ReadLine().Nullify(
                    true) ?? args.Title ?? throw new ArgumentNullException(
                        nameof(resTitle));

                args.ResTitle = resTitle;
                Console.WriteLine();
            }

            args.MdFirstContent = string.Format(
                config.FileContents.MdFileContentSectionTemplate,
                $"[{args.ResTitle}]({url})");
        }

        private string GetFullDirNamePart(
            string title) => fsEntryNameNormalizer.NormalizeFsEntryName(
                title, config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH);

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
                            ItemHandlersArr = [
                                parser.ArgsItemOpts(data, data => data.Args.Title = data.ArgItem.Nullify(true)),
                                parser.ArgsItemOpts(data, data => data.Args.ShortDirName = data.ArgItem),
                                parser.ArgsItemOpts(data, data => data.Args.FullDirNameJoinStr = data.ArgItem)
                            ],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.WorkDir.Arr(),
                                    data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.Url.Arr(),
                                    data => data.Args.Url = data.ArgFlagValue!.JoinStr(":")),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.Uri.Arr(),
                                    data => data.Args.Uri = data.ArgFlagValue!.JoinStr(":")),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.OpenMdFile.Arr(),
                                    data => data.Args.OpenMdFile = true, true),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.SkipMdFileCreation.Arr(),
                                    data => data.Args.SkipMdFileCreation = true, true),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.CreateNote.Arr(),
                                    data => data.Args.CreateNote = true, true),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.CreateNoteBook.Arr(),
                                    data => data.Args.CreateNoteBook = true, true),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.CreateNoteInternalsDir.Arr(),
                                    data => data.Args.CreateNoteInternalsDir = true, true),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.CreateNoteFilesDir.Arr(),
                                    data => data.Args.CreateNoteFilesDir = true, true),
                                parser.ArgsFlagOpts(data,
                                    config.ArgOpts.DirNameTpl.Arr(),
                                    data => data.Args.DirNameTpl = config.DirNames.DirNamesTplMap[
                                        data.ArgFlagValue!.Single()])
                            ]
                        })
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
