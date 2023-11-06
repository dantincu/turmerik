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
        private readonly IConsoleArgsParser consoleArgsParser;
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

            this.consoleArgsParser = consoleArgsParser ?? throw new ArgumentNullException(
                nameof(consoleArgsParser));

            this.fsEntryNameNormalizer = fsEntryNameNormalizer ?? throw new ArgumentNullException(
                nameof(fsEntryNameNormalizer));

            this.dirsPairCreator = dirsPairCreator ?? throw new ArgumentNullException(
                nameof(dirsPairCreator));

            string configFilePath = Path.Combine(
                ProgramH.ExecutingAssemmblyPath,
                "trmrk-dirpairs-config.json");

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
            string[] rawArgs) => consoleArgsParser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsBuilder = data =>
                    {
                        if (data.ArgFlagName != null)
                        {
                            HandleArgsFlag(data);
                        }
                        else
                        {
                            HandleArgs(data);
                        }
                    }
                }).Args;

        private void HandleArgs(
            ConsoleArgsParserData<ProgramArgs> data)
        {
            var args = data.Args;

            switch (data.Count)
            {
                case 1:
                    args.ShortDirName = data.ArgItem;
                    break;
                case 2:
                    args.Title = data.ArgItem;
                    break;
                case 3:
                    args.FullDirNameJoinStr = data.ArgItem;
                    break;
                default:
                    throw new ArgumentOutOfRangeException(
                        "Too many arguments: expected no more than 3 non-flag arguments");
            }
        }

        private void HandleArgsFlag(
            ConsoleArgsParserData<ProgramArgs> data)
        {
            var args = data.Args;

            var cfg = config.ArgOpts;
            var argOptName = data.ArgFlagName;

            if (argOptName == cfg.WorkDir)
            {
                args.WorkDir = data.ArgFlagValue.Single();
            }
            else if (argOptName == cfg.OpenMdFile)
            {
                ThrowIfArgOptHasValues(
                    data, cfg.OpenMdFile);

                args.OpenMdFile = true;
            }
            else if (argOptName == cfg.SkipMdFileCreation)
            {
                ThrowIfArgOptHasValues(
                    data, cfg.SkipMdFileCreation);

                args.SkipMdFileCreation = true;
            }
            else
            {
                throw new ArgumentException(
                    $"Invalid flag {argOptName}");
            }
        }

        private void ThrowIfArgOptHasValues(
            ConsoleArgsParserData<ProgramArgs> data,
            string flag)
        {
            if (data.ArgFlagValue.Any())
            {
                throw new ArgumentException(
                    $"The flag {flag} should not be given an explicit value");
            }
        }
    }
}
