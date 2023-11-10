using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Turmerik.ConsoleApps;
using Turmerik.DriveExplorer;
using Turmerik.Helpers;
using Turmerik.Notes;
using Turmerik.TextSerialization;
using Turmerik.Utility;

namespace Turmerik.MkFsDirsPair.ConsoleApp
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

            this.parser = consoleArgsParser ?? throw new ArgumentNullException(
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
            await dirsPairCreator.CreateDirsPairAsync(opts);
        }

        private DirsPairOpts GetDirsPairOpts(
            ProgramArgs args) => new DirsPairOpts
            {
                PrIdnf = args.WorkDir,
                Title = args.Title,
                MaxFsEntryNameLength = config.FileNameMaxLength ?? DriveExplorerH.DEFAULT_ENTRY_NAME_MAX_LENGTH,
                ShortDirName = args.ShortDirName,
                FullDirNamePart = args.FullDirNamePart,
                JoinStr = args.FullDirNameJoinStr,
                MdFileNameTemplate = $"{config.FileNames.MdFileNameTemplate}.md",
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
            args.FullDirNameJoinStr ??= " ";
            args.FullDirNamePart = GetFullDirNamePart(args.Title);
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
                            ItemHandlersArr = parser.ArgsItemOpts(
                                data, data => data.Args.ShortDirName = data.ArgItem).Arr(
                                    parser.ArgsItemOpts(data, data => data.Args.Title = data.ArgItem),
                                    parser.ArgsItemOpts(data, data => data.Args.FullDirNameJoinStr = data.ArgItem)),
                            FlagHandlersMap = new Dictionary<string, ConsoleArgsFlagOpts<ProgramArgs>>
                            {
                                {
                                    config.ArgOpts.WorkDir,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.WorkDir = data.ArgFlagValue.Single())
                                },
                                {
                                    config.ArgOpts.OpenMdFile,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.OpenMdFile = true, true)
                                },
                                {
                                    config.ArgOpts.SkipMdFileCreation,
                                    parser.ArgsFlagOpts(data,
                                        data => data.Args.SkipMdFileCreation = true, true)
                                }
                            }
                        })
                    }).Args;
    }
}
