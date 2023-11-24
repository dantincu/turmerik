using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.ConsoleApps;
using Turmerik.Helpers;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.DriveExplorer.DirsPair.ConsoleApps.MkFsDirPairs
{
    public class ProgramComponent
    {
        private readonly IJsonConversion jsonConversion;
        private readonly IConsoleArgsParser parser;
        private readonly IFsEntryNameNormalizer fsEntryNameNormalizer;
        private readonly IDirsPairCreator dirsPairCreator;
        private readonly DirsPairConfig config;

        public ProgramComponent(
            IJsonConversion jsonConversion,
            IConsoleArgsParser consoleArgsParser,
            IFsEntryNameNormalizer fsEntryNameNormalizer,
            IDirsPairCreator dirsPairCreator)
        {
            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

            parser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.dirsPairCreator = dirsPairCreator ?? throw new ArgumentNullException(
                nameof(dirsPairCreator));

            string configFilePath = Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                DriveExplorerH.DIR_PAIRS_CFG_FILE_NAME);

            config = jsonConversion.Adapter.Deserialize<DirsPairConfig>(
                File.ReadAllText(configFilePath));
        }

        public async Task RunAsync(string[] rawArgs)
        {
            var args = GetArgs(rawArgs);
            NormalizeArgs(args);

            var opts = GetDirsPairOpts(args);
            var dirsPair = await dirsPairCreator.CreateDirsPairAsync(opts);

            if (opts.OpenMdFile)
            {
                var shortNameDir = dirsPair.First();
                var file = shortNameDir.FolderFiles.Single();

                string filePath = Path.Combine(
                    shortNameDir.Idnf,
                    file.Name);

                ProcessH.OpenWithDefaultProgramIfNotNull(filePath);
            }
        }

        private DirsPairOpts GetDirsPairOpts(
            ProgramArgs args) => new DirsPairOpts
            {
                PrIdnf = args.WorkDir,
                Title = args.Title,
                OpenMdFile = args.OpenMdFile,
                MaxFsEntryNameLength = config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH,
                ShortDirName = args.ShortDirName,
                FullDirNamePart = args.DirNameTpl?.With(
                    dirNameTpl => string.Format(
                        dirNameTpl.DirNameTpl,
                        args.FullDirNamePart)) ?? args.FullDirNamePart,
                JoinStr = args.FullDirNameJoinStr,
                MdFileNameTemplate = args.DirNameTpl?.MdFileNameTemplate?.With(
                    mdFileNameTemplate => string.Format(
                        mdFileNameTemplate,
                        args.FullDirNamePart)) ?? $"{config.FileNames.MdFileNameTemplate}.md",
                MdFileContentsTemplate = config.FileContents.MdFileContentsTemplate,
                KeepFileName = config.FileNames.KeepFileName,
                KeepFileNameContents = string.Format(
                    config.FileContents.KeepFileContentsTemplate,
                    Trmrk.TrmrkGuidStrNoDash),
                ThrowIfAnyItemAlreadyExists = config.ThrowIfAnyItemAlreadyExists ?? true
            };

        private void NormalizeArgs(
            ProgramArgs args)
        {
            args.WorkDir ??= Environment.CurrentDirectory;
            args.FullDirNameJoinStr ??= config.DirNames.DefaultJoinStr;
            args.FullDirNamePart = GetFullDirNamePart(args.Title ?? string.Empty);
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
                                parser.ArgsItemOpts(data, data => data.Args.ShortDirName = data.ArgItem),
                                parser.ArgsItemOpts(data, data => data.Args.Title = data.ArgItem),
                                parser.ArgsItemOpts(data, data => data.Args.FullDirNameJoinStr = data.ArgItem)
                            ],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data, config.ArgOpts.WorkDir.Arr(),
                                    data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                                parser.ArgsFlagOpts(data, config.ArgOpts.OpenMdFile.Arr(),
                                    data => data.Args.OpenMdFile = true, true),
                                parser.ArgsFlagOpts(data, config.ArgOpts.SkipMdFileCreation.Arr(),
                                    data => data.Args.SkipMdFileCreation = true, true),
                                parser.ArgsFlagOpts(data, config.ArgOpts.CreateNote.Arr(),
                                    data => data.Args.CreateNote = true, true),
                                parser.ArgsFlagOpts(data, config.ArgOpts.CreateNoteBook.Arr(),
                                    data => data.Args.CreateNoteBook = true, true),
                                parser.ArgsFlagOpts(data, config.ArgOpts.CreateNoteInternalsDir.Arr(),
                                    data => data.Args.CreateNoteInternalsDir = true, true),
                                parser.ArgsFlagOpts(data, config.ArgOpts.CreateNoteFilesDir.Arr(),
                                    data => data.Args.CreateNoteFilesDir = true, true),
                                parser.ArgsFlagOpts(data, config.ArgOpts.DirNameTpl.Arr(),
                                    data => data.Args.DirNameTpl = config.DirNames.DirNamesTplMap[
                                        data.ArgFlagValue!.Single()])
                            ]
                        })
                }).Args;
    }
}
