using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Turmerik.Core.ConsoleApps;
using Turmerik.Core.FileSystem;
using Turmerik.Core.Helpers;
using Turmerik.Core.LocalDeviceEnv;
using Turmerik.Core.Text;
using Turmerik.Core.TextSerialization;

namespace Turmerik.NetCore.ConsoleApps.FilesCloner
{
    public interface IProgramArgsRetriever
    {
        ProgramArgs GetArgs(
            string[] rawArgs);
    }

    public class ProgramArgsRetriever : IProgramArgsRetriever
    {
        public const string CFG_FILE_NAME = "trmrk-filescloner-config.json";

        private readonly IConsoleArgsParser parser;
        private readonly IJsonConversion jsonConversion;
        private readonly IProgramConfigRetriever programConfigRetriever;
        private readonly ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever;

        public ProgramArgsRetriever(
            IConsoleArgsParser parser,
            IJsonConversion jsonConversion,
            IProgramConfigRetriever programConfigRetriever,
            ILocalDevicePathMacrosRetriever localDevicePathMacrosRetriever)
        {
            this.parser = parser ?? throw new ArgumentNullException(
                nameof(parser));

            this.jsonConversion = jsonConversion ?? throw new ArgumentNullException(
                nameof(jsonConversion));

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
                Config = programConfigRetriever.LoadProgramConfig()
            };

            FileCloneArgs singleFileArgs = null;
            FileArgs singleFile = null;

            Action<ConsoleArgsParserData<ProgramArgs>> assureSingleFileArgsAssigned = (data) =>
            {
                data.Args.SingleFileArgs = (singleFileArgs ??= new FileCloneArgs
                {
                    CloneInputFile = true
                });
            };

            Action assureSingleFileAssigned = () =>
            {
                singleFileArgs!.File = (singleFile ??= new FileArgs());
            };

            args = parser.Parse(
                new ConsoleArgsParserOpts<ProgramArgs>(rawArgs)
                {
                    ArgsFactory = () => args,
                    ArgsBuilder = data => parser.HandleArgs(
                        new ConsoleArgsParseHandlerOpts<ProgramArgs>
                        {
                            Data = data,
                            ThrowOnTooManyArgs = true,
                            ThrowOnUnknownFlag = true,
                            ItemHandlersArr = [
                                parser.ArgsItemOpts(data, data =>
                                {
                                    assureSingleFileArgsAssigned(data);
                                    singleFileArgs!.InputText = data.ArgItem;
                                })
                            ],
                            FlagHandlersArr = [
                                parser.ArgsFlagOpts(data, ["w"],
                                    data =>
                                    {
                                        data.Args.WorkDir = data.ArgFlagValue!.Single().Nullify(true);
                                    }),
                                parser.ArgsFlagOpts(data, ["i"],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.InputFileLocator = FsEntryLocatorH.FromPath(
                                            data.ArgFlagValue!.SingleOrDefault() ?? throw new ArgumentNullException(
                                                nameof(singleFile.InputFileLocator)));
                                    }),
                                parser.ArgsFlagOpts(data, ["o"],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.CloneDirLocator = FsEntryLocatorH.FromPath(
                                            data.ArgFlagValue!.SingleOrDefault() ?? string.Empty);
                                    }),
                                parser.ArgsFlagOpts(data, ["t"],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.CloneFileNameTpl = data.ArgFlagValue!.SingleOrDefault()!;
                                    }),
                                parser.ArgsFlagOpts(data, ["cksm"],
                                    data =>
                                    {
                                        assureSingleFileArgsAssigned(data);
                                        assureSingleFileAssigned();

                                        singleFile!.UseChecksum = true;
                                    }, true),
                                parser.ArgsFlagOpts(data, ["p"],
                                    data =>
                                    {
                                        data.Args.Profile = data.Args.Config.Profiles.Single(
                                            profile => profile.ProfileName == data.ArgFlagValue!.Single());
                                    })
                            ]
                        })
                }).Args;

            return args;
        }
    }
}
