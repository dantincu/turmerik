using Turmerik.Core.ConsoleApps;
using Turmerik.Core.DriveExplorer;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.TextParsing;

namespace Turmerik.NetCore.ConsoleApps.SyncLocalFiles
{
    public interface IProgramArgsRetriever
    {
        ProgramArgs GetArgs(
            string[] rawArgs);
    }

    public class ProgramArgsRetriever : IProgramArgsRetriever
    {
        private readonly IConsoleArgsParser parser;
        private readonly ITextMacrosReplacer textMacrosReplacer;
        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;

        public ProgramArgsRetriever(
            IConsoleArgsParser parser,
            ITextMacrosReplacer textMacrosReplacer,
            IProgramConfigRetriever programConfigRetriever,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever)
        {
            this.parser = parser ?? throw new ArgumentNullException(
                nameof(parser));

            this.textMacrosReplacer = textMacrosReplacer ?? throw new ArgumentNullException(
                nameof(textMacrosReplacer));

            this.programConfigRetriever = programConfigRetriever ?? throw new ArgumentNullException(
                nameof(programConfigRetriever));

            this.localDevicePathMacrosRetriever = localDevicePathMacrosRetriever ?? throw new ArgumentNullException(
                nameof(localDevicePathMacrosRetriever));
        }

        public ProgramArgs GetArgs(
            string[] rawArgs)
        {
            var args = new ProgramArgs
            {
                LocalDevicePathsMap = localDevicePathMacrosRetriever.LoadFromConfigFile(),
                LocationNamesMap = new Dictionary<string, List<string>>()
            };

            args = parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsFactory = () => args,
                    ArgsBuilder = data =>
                    {
                        if (data.ArgFlagName == null)
                        {
                            var argItemTuple = GetArgItemTuple(
                                data.ArgItem);

                            data.Args.LocationNamesMap.Add(
                                argItemTuple.Item1,
                                argItemTuple.Item2);
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
                                        parser.ArgsFlagOpts(data, ["wd"],
                                            data => data.Args.WorkDir = data.ArgFlagValue!.Single()),
                                        parser.ArgsFlagOpts(data, ["cfg"],
                                            data => data.Args.ConfigFilePath = data.ArgFlagValue!.Single()),
                                        parser.ArgsFlagOpts(data, ["pf"],
                                            data => data.Args.ProfileName = data.ArgFlagValue!.Single()),
                                        parser.ArgsFlagOpts(data, ["fst"],
                                            data => data.Args.FileSyncType = ParseFileSyncType(data.ArgFlagValue!.Single())),
                                        parser.ArgsFlagOpts(data, ["rtp"],
                                            data => data.Args.RowsToPrint = int.Parse(data.ArgFlagValue!.Single())),
                                        parser.ArgsFlagOpts(data, ["ppgp"],
                                            data => data.Args.PropagatePush = true, true),
                                        parser.ArgsFlagOpts(data, ["i"],
                                            data => data.Args.Interactive = true, true),
                                        parser.ArgsFlagOpts(data, ["skdffprnt"],
                                            data => data.Args.SkipDiffPrinting = true, true),
                                        parser.ArgsFlagOpts(data, ["alldff"],
                                            data => data.Args.TreatAllAsDiff = true, true)
                                    ]
                                });
                        }
                    }
                }).Args;

            args.WorkDir = textMacrosReplacer.NormalizePath(
                args.LocalDevicePathsMap,
                args.WorkDir,
                null);

            if (args.ConfigFilePath != null)
            {
                args.ConfigFilePath = textMacrosReplacer.NormalizePath(
                    args.LocalDevicePathsMap,
                    args.ConfigFilePath,
                    args.WorkDir);
            }

            args.Config ??= programConfigRetriever.LoadProgramConfig(
                args.ConfigFilePath);

            args.Profile = args.Config.Profiles.Single(
                profile => profile.ProfileName == args.ProfileName);

            return args;
        }

        private FileSyncType ParseFileSyncType(
            string argFlagValue) => argFlagValue.ToLowerInvariant() switch
            {
                "diff" => FileSyncType.Diff,
                "pull" => FileSyncType.Pull,
                "push" => FileSyncType.Push,
                _ => throw new ArgumentException(nameof(argFlagValue))
            };

        private Tuple<string, List<string>> GetArgItemTuple(
            string argItem)
        {
            var argItems = argItem.Split(':');

            var retTuple = Tuple.Create(
                argItems.First(),
                argItems.Skip(1).ToList());

            return retTuple;
        }
    }
}
